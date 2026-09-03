/* ============================================================
 * site.js —— 全站壳层与公共组件（window.FG）
 * 职责：
 *   1. 自动壳层：检测 body[data-page="<pointId>"]，自动渲染 #fg-header
 *      （面包屑 模块名/标题 + 上一页/下一页/返回地图 + 音效开关）与 #fg-footer，
 *      并调用 ProgressStore.visit(pointId)；
 *      pointId 不在课程数据中时降级渲染通用头部（内部模板示范页用，此时不记访问）
 *   2. FG.sound：Web Audio 本地合成短音（'correct' / 'wrong'），
 *      开关状态存 feguide:sound，默认开；在用户点击事件内首次调用以兼容浏览器手势限制
 *   3. FG.note.mount(el, pageId)：费曼笔记「讲给外行听 · 我的理解」，
 *      输入即存 feguide:note:<pageId>，刷新自动回显
 *   4. FG.assess.mount(el, pageId)：1~5 星掌握度自评，写 ProgressStore.setMastery
 *
 * 脚本加载顺序约定：curriculum.js → progress-store.js → quiz-engine.js → site.js → 页面内联脚本
 * ============================================================ */
(function (global) {
  'use strict';

  var SOUND_KEY = 'feguide:sound';

  /* ---------- 小工具 ---------- */
  function lsGet(key) {
    try { return global.localStorage.getItem(key); } catch (e) { return null; }
  }
  function lsSet(key, val) {
    try { global.localStorage.setItem(key, val); } catch (e) { /* 忽略 */ }
  }
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 计算站点根的相对路径：
     根目录页面（index.html 等）→ '.'；
     pages/_template.html → '..'；
     pages/<模块>/x.html → '../..' */
  function detectRoot() {
    var segs = global.location.pathname.split('/');
    segs.pop(); // 去掉文件名
    var i = segs.lastIndexOf('pages');
    if (i < 0) return '.';
    var depth = segs.length - i; // 需向上回退的层数（含 pages 目录本身）
    var out = [];
    for (var k = 0; k < depth; k++) out.push('..');
    return out.join('/') || '.';
  }
  function withRoot(root, rel) {
    return root === '.' ? rel : root + '/' + rel;
  }

  /* 课程数据访问（curriculum.js 可能暂缺，需容错） */
  function curriculum() {
    var c = global.CURRICULUM;
    return (c && Array.isArray(c.modules)) ? c : null;
  }

  /** 在课程数据中查找知识点：返回 {module, point, index, flat} 或 null */
  function findPoint(pageId) {
    var c = curriculum();
    if (!c || !pageId) return null;
    var flat = [];
    (c.modules || []).forEach(function (m) {
      (m.points || []).forEach(function (p) { flat.push({ module: m, point: p }); });
    });
    for (var i = 0; i < flat.length; i++) {
      if (flat[i].point && flat[i].point.id === pageId) {
        return { module: flat[i].module, point: flat[i].point, index: i, flat: flat };
      }
    }
    return null;
  }

  /* ================= 音效：Web Audio 本地合成 ================= */
  function tone(ctx, freq, start, dur, type, vol) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  }

  function soundLabel() {
    return sound.enabled() ? '音效：开' : '音效：关';
  }
  function syncSoundButtons() {
    var list = document.querySelectorAll('.fg-sound-btn');
    for (var i = 0; i < list.length; i++) list[i].textContent = soundLabel();
  }

  var sound = {
    /** 音效开关是否打开（默认开） */
    enabled: function () {
      return lsGet(SOUND_KEY) !== 'off';
    },
    setEnabled: function (on) {
      lsSet(SOUND_KEY, on ? 'on' : 'off');
      syncSoundButtons();
    },
    toggle: function () {
      sound.setEnabled(!sound.enabled());
    },
    /** 播放短音：'correct'（上行叮咚）/ 'wrong'（低频嘟嘟）。须在用户手势内首次调用 */
    play: function (name) {
      if (!sound.enabled()) return;
      try {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (!AC) return;
        if (!sound._ctx) sound._ctx = new AC();
        var ctx = sound._ctx;
        if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
        var t = ctx.currentTime;
        if (name === 'wrong') {
          tone(ctx, 233, t, 0.10, 'square', 0.05);
          tone(ctx, 175, t + 0.11, 0.16, 'square', 0.05);
        } else {
          tone(ctx, 659, t, 0.10, 'sine', 0.06);
          tone(ctx, 988, t + 0.09, 0.16, 'sine', 0.06);
        }
      } catch (e) { /* 音频不可用时静默 */ }
    },
    /** 生成一个音效开关按钮（供自绘头部的页面复用） */
    button: function () {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'fg-btn fg-btn--ghost fg-btn--sm fg-sound-btn';
      b.setAttribute('aria-pressed', sound.enabled() ? 'true' : 'false');
      b.textContent = soundLabel();
      b.addEventListener('click', function () { sound.toggle(); });
      return b;
    }
  };

  /* ================= 费曼笔记 ================= */
  var note = {
    /** 挂载「讲给外行听 · 我的理解」文本域：输入即存，刷新回显 */
    mount: function (el, pageId) {
      var host = typeof el === 'string' ? document.querySelector(el) : el;
      if (!host || !pageId) return;
      var key = 'feguide:note:' + pageId;
      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'fg-note';
      var lab = document.createElement('label');
      lab.className = 'fg-note-label';
      lab.setAttribute('for', 'fg-note-' + pageId);
      lab.textContent = '讲给外行听 · 我的理解（输入自动保存）';
      var ta = document.createElement('textarea');
      ta.id = 'fg-note-' + pageId;
      ta.className = 'fg-note-input';
      ta.rows = 4;
      ta.placeholder = '试着用一句大白话，把这个知识点讲给完全不懂的人听……';
      ta.value = lsGet(key) || '';
      ta.addEventListener('input', function () { lsSet(key, ta.value); });
      wrap.appendChild(lab);
      wrap.appendChild(ta);
      host.appendChild(wrap);
    }
  };

  /* ================= 掌握度自评（1~5 星） ================= */
  var assess = {
    /** 挂载星级自评组件，点击即写 ProgressStore.setMastery */
    mount: function (el, pageId) {
      var host = typeof el === 'string' ? document.querySelector(el) : el;
      if (!host || !pageId) return;
      host.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'fg-assess';
      var lab = document.createElement('span');
      lab.className = 'fg-assess-label';
      lab.textContent = '掌握度自评';
      var stars = document.createElement('span');
      stars.className = 'fg-stars';
      var val = document.createElement('span');
      val.className = 'fg-assess-val';

      var cur = 0;
      if (global.ProgressStore) {
        var rec = global.ProgressStore.get(pageId);
        if (rec && rec.mastery) cur = rec.mastery;
      }

      function paint() {
        var btns = stars.querySelectorAll('.fg-star');
        for (var i = 0; i < btns.length; i++) {
          btns[i].textContent = (i < cur) ? '★' : '☆';
          btns[i].classList.toggle('is-on', i < cur);
          btns[i].setAttribute('aria-label', (i + 1) + ' 星');
        }
        val.textContent = cur > 0 ? (cur + ' / 5') : '未评';
      }
      for (var n = 1; n <= 5; n++) {
        (function (level) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'fg-star';
          b.addEventListener('click', function () {
            cur = level;
            if (global.ProgressStore) global.ProgressStore.setMastery(pageId, level);
            paint();
          });
          stars.appendChild(b);
        })(n);
      }
      paint();
      wrap.appendChild(lab);
      wrap.appendChild(stars);
      wrap.appendChild(val);
      host.appendChild(wrap);
    }
  };

  /* ================= 自动壳层 ================= */
  function ensureSlot(id, tag, atEnd) {
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement(tag);
      el.id = id;
      if (atEnd) document.body.appendChild(el);
      else document.body.insertBefore(el, document.body.firstChild);
    }
    return el;
  }

  function navLink(target, text, root) {
    var a = document.createElement('a');
    a.className = 'fg-btn fg-btn--ghost fg-btn--sm';
    if (target && target.point && target.point.path) {
      a.href = withRoot(root, target.point.path);
      a.textContent = text;
    } else {
      a.textContent = text;
      a.classList.add('is-disabled');
      a.setAttribute('aria-disabled', 'true');
    }
    return a;
  }

  function initShell() {
    var pageId = document.body ? document.body.getAttribute('data-page') : null;
    if (!pageId) return; // 地图 / 错题本 / 自测页自行渲染头部，壳层不介入

    var root = detectRoot();
    var header = ensureSlot('fg-header', 'header', false);
    var footer = ensureSlot('fg-footer', 'footer', true);
    var loc = findPoint(pageId);

    header.className = 'fg-header';
    header.innerHTML = '';

    if (loc) {
      /* 命中课程：面包屑 + 上一页/下一页/返回地图 + 音效开关 */
      var prev = loc.flat[loc.index - 1];
      var next = loc.flat[loc.index + 1];

      var crumb = document.createElement('nav');
      crumb.className = 'fg-crumb';
      crumb.innerHTML =
        '<a href="' + withRoot(root, 'index.html') + '">学习地图</a>' +
        '<span class="fg-crumb-sep">/</span>' +
        '<span class="fg-crumb-module">' + esc(loc.module.name || '') + '</span>' +
        '<span class="fg-crumb-sep">/</span>' +
        '<strong class="fg-crumb-title">' + esc(loc.point.title || pageId) + '</strong>';
      header.appendChild(crumb);

      var nav = document.createElement('div');
      nav.className = 'fg-header-nav';
      nav.appendChild(navLink(prev, '← 上一页', root));
      var back = document.createElement('a');
      back.className = 'fg-btn fg-btn--ghost fg-btn--sm';
      back.href = withRoot(root, 'index.html');
      back.textContent = '返回地图';
      nav.appendChild(back);
      nav.appendChild(navLink(next, '下一页 →', root));
      nav.appendChild(sound.button());
      header.appendChild(nav);

      /* 记录一次访问（visits+1 并推进遗忘曲线） */
      if (global.ProgressStore) global.ProgressStore.visit(pageId);
    } else {
      /* 降级：pointId 不在课程数据中（内部模板示范页 / 课程数据暂缺） */
      var fb = document.createElement('div');
      fb.className = 'fg-crumb';
      fb.innerHTML =
        '<a href="' + withRoot(root, 'index.html') + '">前端领航员</a>' +
        '<span class="fg-crumb-sep">/</span>' +
        '<strong class="fg-crumb-title">模板示范页</strong>' +
        '<span class="fg-badge fg-badge--muted fg-badge--sm">该页面不在课程地图中，进度不纳入统计</span>';
      header.appendChild(fb);

      var nav2 = document.createElement('div');
      nav2.className = 'fg-header-nav';
      nav2.appendChild(sound.button());
      header.appendChild(nav2);
      /* 不在课程中的页面不调用 ProgressStore.visit，避免污染学习统计 */
    }

    footer.className = 'fg-footer';
    footer.innerHTML = '<p>前端领航员 · 大前端全栈成长地图 —— 纯静态本地学习站，无网络请求；所有进度数据仅保存在本机浏览器 localStorage，清除浏览器数据会丢失进度。</p>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShell);
  } else {
    initShell();
  }

  /* ================= 对外暴露 ================= */
  global.FG = {
    sound: sound,
    note: note,
    assess: assess,
    esc: esc,
    curriculum: curriculum,
    findPoint: findPoint
  };
})(window);
