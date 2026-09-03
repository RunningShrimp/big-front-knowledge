/* ============================================================
 * quiz-engine.js —— 判题引擎（window.QuizEngine）
 * 能力：
 *   - 单选 / 多选：即时判分、展开解析、播放音效，答错自动写入错题本
 *   - 代码题：把「用户代码 + 逐条断言」放进 iframe sandbox="allow-scripts"
 *     的 srcdoc 中执行，逐条展示通过/失败；沙箱不可用或执行抛错（含超时）
 *     时自动降级为「展示参考实现 + 自评按钮（已掌握 / 未掌握）」
 * 依赖：progress-store.js（错题本）；site.js 的 FG.sound（音效，缺省时静默）
 *
 * 题目对象结构：
 *   单选 { id, type:'single', stem, options:[...], answer:[索引数组], explain }
 *   多选 { id, type:'multi',  ...同上 }（全部选对才得分）
 *   代码 { id, type:'code',   stem, stub(起始代码), reference(参考实现), asserts:[断言表达式字符串,...] }
 *
 * 脚本加载顺序约定：curriculum.js → progress-store.js → quiz-engine.js → site.js → 页面内联脚本
 * ============================================================ */
(function (global) {
  'use strict';

  var LETTERS = 'ABCDEFGH';
  var RUN_TIMEOUT = 4000; // 沙箱执行超时（毫秒），超时视为沙箱不可用 → 降级

  /* 工具：HTML 转义 */
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* 工具：把值序列化为可安全嵌入内联脚本的 JSON 字符串（转义 < 防止提前闭合标签） */
  function scriptSafe(v) {
    return JSON.stringify(v).replace(/</g, '\\u003c');
  }

  /* 工具：两组索引数组排序后是否完全相等（多选需全对且不多选） */
  function sortedEq(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    var x = a.slice().sort(function (m, n) { return m - n; });
    var y = b.slice().sort(function (m, n) { return m - n; });
    for (var i = 0; i < x.length; i++) {
      if (x[i] !== y[i]) return false;
    }
    return true;
  }

  /* 工具：播放音效（FG 可能尚未加载或被用户关闭，均需容错） */
  function sound(name) {
    try {
      if (global.FG && global.FG.sound) global.FG.sound.play(name);
    } catch (e) { /* 音效失败不影响判题 */ }
  }

  /* 工具：写入错题本（条目结构与 ProgressStore.addWrong 契约一致） */
  function toWrongbook(q, pageId, answer, explain) {
    try {
      if (global.ProgressStore && global.ProgressStore.addWrong) {
        global.ProgressStore.addWrong({
          qid: q.id,
          pageId: pageId,
          type: q.type,
          stem: q.stem,
          options: Array.isArray(q.options) ? q.options : [],
          answer: answer,
          explain: explain
        });
      }
    } catch (e) { /* 错题本写入失败不影响判题展示 */ }
  }

  /* 沙箱能力检测：默认检查 iframe 的 sandbox 属性是否受支持；
     selftest 页可覆写 QuizEngine._isSandboxAvailable 来模拟「检测失败」 */
  function defaultSandboxCheck() {
    try {
      return 'sandbox' in document.createElement('iframe');
    } catch (e) {
      return false;
    }
  }

  /* 判分收尾：更新对外结果对象；全部题目判完后触发 whenReady 回调 */
  function settle(state, result) {
    state.graded += 1;
    result.score = state.score;
    result.total = state.total;
    if (state.graded >= state.total && !state.fired) {
      state.fired = true;
      var snapshot = { score: state.score, total: state.total };
      state.readyFns.forEach(function (fn) {
        try { fn(snapshot); } catch (e) { /* 单个回调异常不影响其他回调 */ }
      });
    }
  }

  /* ---------------- 选项题（单选 / 多选） ---------------- */
  function mountChoice(item, q, pageId, mode, state, result) {
    var multi = q.type === 'multi';
    var box = document.createElement('div');
    box.className = 'quiz-options';
    var inputs = [];

    (q.options || []).forEach(function (opt, i) {
      var label = document.createElement('label');
      label.className = 'quiz-option';
      var input = document.createElement('input');
      input.type = multi ? 'checkbox' : 'radio';
      input.name = 'quiz-' + (q.id || 'q' + state.total + '-' + i);
      input.value = String(i);
      label.appendChild(input);
      var text = document.createElement('span');
      text.className = 'quiz-option-text';
      text.innerHTML = '<b class="quiz-option-key">' + (LETTERS[i] || i) + '.</b> ' + esc(opt);
      label.appendChild(text);
      box.appendChild(label);
      inputs.push(input);
    });
    item.appendChild(box);

    var actions = document.createElement('div');
    actions.className = 'quiz-actions';
    var hint = document.createElement('span');
    hint.className = 'quiz-hint';
    hint.hidden = true;
    hint.textContent = '请先选择答案再提交';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fg-btn fg-btn--primary fg-btn--sm';
    btn.textContent = '提交答案';
    actions.appendChild(btn);
    actions.appendChild(hint);
    item.appendChild(actions);

    var explain = document.createElement('div');
    explain.className = 'quiz-explain';
    explain.hidden = true;
    item.appendChild(explain);

    btn.addEventListener('click', function () {
      if (item.getAttribute('data-graded') === '1') return; // 已判过，防重复提交
      var picked = [];
      inputs.forEach(function (ip, i) {
        if (ip.checked) picked.push(i);
      });
      if (picked.length === 0) {
        hint.hidden = false; // 未作答：提示而不是判错
        return;
      }
      hint.hidden = true;
      gradeChoice(item, q, picked, pageId, state, result, inputs, explain);
    });
  }

  function gradeChoice(item, q, picked, pageId, state, result, inputs, explain) {
    item.setAttribute('data-graded', '1');
    var right = sortedEq(picked, q.answer || []);

    /* 标记选项正误 */
    var labels = item.querySelectorAll('.quiz-option');
    (q.answer || []).forEach(function (ai) {
      if (labels[ai]) labels[ai].classList.add('is-right');
    });
    if (!right) {
      picked.forEach(function (pi) {
        if (labels[pi]) labels[pi].classList.add('is-wrong');
      });
    }
    inputs.forEach(function (ip) { ip.disabled = true; });
    var act = item.querySelector('.quiz-actions');
    if (act) act.hidden = true;

    /* 展开解析 */
    var ansText = (q.answer || []).map(function (i) { return LETTERS[i] || i; }).join('、');
    explain.innerHTML =
      '<div class="quiz-explain-title">' + (right ? '回答正确' : '回答错误') +
      ' · 正确答案：' + esc(ansText) + '</div>' +
      '<div class="quiz-explain-body">' + esc(q.explain || '') + '</div>';
    explain.hidden = false;
    explain.classList.add(right ? 'quiz-explain--ok' : 'quiz-explain--bad');

    if (right) {
      sound('correct');
      state.score += 1;
    } else {
      sound('wrong');
      toWrongbook(q, pageId, q.answer || [], q.explain || '');
    }
    settle(state, result);
  }

  /* ---------------- 代码题（沙箱断言 + 降级） ---------------- */
  function mountCode(item, q, pageId, mode, state, result) {
    var area = document.createElement('div');
    area.className = 'quiz-code';
    item.appendChild(area);

    /* 沙箱不可用：直接渲染降级面板 */
    if (!engine._isSandboxAvailable()) {
      renderDegrade(item, q, '当前浏览器不支持沙箱执行，已切换为「对照参考实现 · 自评」模式。', pageId, state, result);
      return;
    }

    var ta = document.createElement('textarea');
    ta.className = 'quiz-code-input';
    ta.name = 'quiz-code-' + (q.id || state.total);
    ta.rows = 8;
    ta.spellcheck = false;
    ta.setAttribute('aria-label', '代码作答区');
    ta.value = q.stub || '';
    area.appendChild(ta);

    var actions = document.createElement('div');
    actions.className = 'quiz-actions';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'fg-btn fg-btn--primary fg-btn--sm';
    btn.textContent = '运行判题';
    actions.appendChild(btn);
    area.appendChild(actions);

    var out = document.createElement('div');
    out.className = 'quiz-asserts';
    area.appendChild(out);

    var explain = document.createElement('div');
    explain.className = 'quiz-explain';
    explain.hidden = true;
    area.appendChild(explain);

    btn.addEventListener('click', function () {
      if (item.getAttribute('data-graded') === '1') return;
      item.setAttribute('data-graded', '1'); // 防重复点击
      btn.disabled = true;
      btn.textContent = '沙箱运行中…';
      runInSandbox(ta.value, Array.isArray(q.asserts) ? q.asserts : [], function (payload) {
        if (!payload || payload.error) {
          /* 沙箱执行抛错或超时：降级 */
          renderDegrade(item, q, '沙箱执行出错或超时，已切换为「对照参考实现 · 自评」模式。', pageId, state, result);
          return;
        }
        renderAssertResults(item, q, payload.results || [], pageId, state, result);
      });
    });
  }

  /* 把用户代码与断言注入 iframe sandbox="allow-scripts" 执行，postMessage 取回逐条结果 */
  function runInSandbox(code, asserts, onDone) {
    var token = 'fg' + Date.now() + Math.random().toString(36).slice(2);
    var iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.className = 'quiz-sandbox';
    iframe.setAttribute('title', '判题沙箱');

    var timer = setTimeout(function () {
      cleanup();
      onDone(null); // 超时 → 走降级
    }, RUN_TIMEOUT);

    function cleanup() {
      clearTimeout(timer);
      global.removeEventListener('message', onMsg);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }
    function onMsg(ev) {
      var d = ev && ev.data;
      if (!d || d.__fgquiz !== 'result' || d.token !== token) return; // 只认本次运行的回执
      cleanup();
      onDone(d);
    }
    global.addEventListener('message', onMsg);

    /* 沙箱内脚本：间接 eval 把用户代码注入全局作用域（保证 function 声明对断言可见），
       再逐条执行断言表达式，收集 {expr, ok, error} */
    var runner =
      'var __T=' + scriptSafe(token) + ';' +
      'var __A=' + scriptSafe(asserts) + ';' +
      'function __send(p){p=p||{};p.__fgquiz="result";p.token=__T;parent.postMessage(p,"*");}' +
      'try{' +
      '(0,eval)(' + scriptSafe(String(code === null || code === undefined ? '' : code)) + ');' +
      'var __r=[];' +
      'for(var i=0;i<__A.length;i++){' +
      'var ok=false,er=null;' +
      'try{ok=!!(0,eval)(__A[i]);}catch(e){er=String(e&&e.message||e);}' +
      '__r.push({expr:__A[i],ok:ok,error:er});}' +
      '__send({results:__r});' +
      '}catch(e){__send({error:String(e&&e.message||e)});}';

    iframe.srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>' +
      runner + '<\/script></body></html>';
    document.body.appendChild(iframe);
  }

  /* 展示逐条断言结果并计分 */
  function renderAssertResults(item, q, results, pageId, state, result) {
    var act = item.querySelector('.quiz-actions');
    if (act) act.hidden = true;
    var out = item.querySelector('.quiz-asserts');

    var passCount = 0;
    results.forEach(function (r) {
      if (r.ok) passCount += 1;
      var row = document.createElement('div');
      row.className = 'quiz-assert ' + (r.ok ? 'quiz-assert--pass' : 'quiz-assert--fail');
      row.innerHTML =
        '<span class="quiz-assert-icon">' + (r.ok ? '✓' : '✗') + '</span>' +
        '<code class="quiz-assert-expr">' + esc(r.expr) + '</code>' +
        '<span class="quiz-assert-msg">' + (r.ok ? '通过' : (r.error ? '抛错：' + esc(r.error) : '未通过')) + '</span>';
      if (out) out.appendChild(row);
    });

    var allPass = results.length > 0 && passCount === results.length;
    var explain = item.querySelector('.quiz-explain');
    if (explain) {
      explain.innerHTML =
        '<div class="quiz-explain-title">' + (allPass ? '全部断言通过' : '还有断言未通过') +
        ' · 通过 ' + passCount + ' / ' + results.length + ' 条</div>' +
        (q.reference ? '<pre class="quiz-reference"><code>' + esc(q.reference) + '</code></pre>' : '') +
        (q.explain ? '<div class="quiz-explain-body">' + esc(q.explain) + '</div>' : '');
      explain.hidden = false;
      explain.classList.add(allPass ? 'quiz-explain--ok' : 'quiz-explain--bad');
    }

    if (allPass) {
      sound('correct');
      state.score += 1;
    } else {
      sound('wrong');
      /* 代码题错题条目：answer 存参考实现，explain 存逐条断言（换行分隔），便于错题本重测 */
      toWrongbook(q, pageId, q.reference || '', (q.asserts || []).join('\n'));
    }
    settle(state, result);
  }

  /* 降级路径：展示参考实现 + 自评按钮（已掌握 / 未掌握） */
  function renderDegrade(item, q, reason, pageId, state, result) {
    var area = item.querySelector('.quiz-code') || item;
    area.innerHTML = '';

    var box = document.createElement('div');
    box.className = 'quiz-degrade';
    var html = '<div class="quiz-degrade-note">' + esc(reason) + '</div>';
    if (q.reference) {
      html += '<div class="quiz-degrade-label">参考实现</div>' +
        '<pre class="quiz-reference"><code>' + esc(q.reference) + '</code></pre>';
    }
    if (Array.isArray(q.asserts) && q.asserts.length) {
      html += '<div class="quiz-degrade-label">本应满足的断言</div>' +
        '<pre class="quiz-reference"><code>' + esc(q.asserts.join('\n')) + '</code></pre>';
    }
    box.innerHTML = html;

    var acts = document.createElement('div');
    acts.className = 'quiz-actions quiz-degrade-actions';
    var okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = 'fg-btn fg-btn--ok fg-btn--sm';
    okBtn.textContent = '已掌握';
    var noBtn = document.createElement('button');
    noBtn.type = 'button';
    noBtn.className = 'fg-btn fg-btn--bad fg-btn--sm';
    noBtn.textContent = '未掌握';
    acts.appendChild(okBtn);
    acts.appendChild(noBtn);
    box.appendChild(acts);
    area.appendChild(box);

    function selfGrade(mastered) {
      if (item.getAttribute('data-selfgraded') === '1') return;
      item.setAttribute('data-selfgraded', '1');
      acts.hidden = true;
      if (mastered) {
        sound('correct');
        state.score += 1;
      } else {
        sound('wrong');
        toWrongbook(q, pageId, q.reference || '', (q.asserts || []).join('\n'));
      }
      settle(state, result);
    }
    okBtn.addEventListener('click', function () { selfGrade(true); });
    noBtn.addEventListener('click', function () { selfGrade(false); });
  }

  /* ---------------- 引擎入口 ---------------- */
  var engine = {
    /** 沙箱能力检测（可被 selftest 覆写以模拟不可用） */
    _isSandboxAvailable: defaultSandboxCheck,

    /**
     * 挂载一组题目
     * @param {Element|string} container 容器元素或选择器
     * @param {Array} questions 题目数组
     * @param {Object} opts { pageId, mode }，mode 如 'warmup' | 'main' | 'retest'
     * @returns {{score:number, total:number, whenReady:Function}}
     *   score 会随代码题异步判分而就地更新；
     *   whenReady(cb) 在全部题目判分完成后回调 cb({score, total})
     */
    mount: function (container, questions, opts) {
      var root = typeof container === 'string' ? document.querySelector(container) : container;
      var qs = Array.isArray(questions) ? questions : [];
      opts = opts || {};
      var pageId = opts.pageId || '';
      var mode = opts.mode || 'main';

      var state = { score: 0, graded: 0, total: qs.length, readyFns: [], fired: false };
      var result = {
        score: 0,
        total: qs.length,
        whenReady: function (cb) {
          if (typeof cb !== 'function') return;
          if (state.fired) cb({ score: state.score, total: state.total });
          else state.readyFns.push(cb);
        }
      };

      if (!root) return result; // 容器不存在：静默返回，不抛错
      root.innerHTML = '';
      root.classList.add('quiz');

      qs.forEach(function (q) {
        var item = document.createElement('div');
        item.className = 'quiz-item';
        item.setAttribute('data-qid', q.id || '');
        item.setAttribute('data-type', q.type || 'single');
        item.setAttribute('data-mode', mode);
        root.appendChild(item);

        var typeText = q.type === 'multi' ? '多选' : (q.type === 'code' ? '代码题' : '单选');
        var stem = document.createElement('div');
        stem.className = 'quiz-stem';
        stem.innerHTML = '<span class="quiz-type-badge">' + typeText + '</span>' + esc(q.stem || '');
        item.appendChild(stem);

        if (q.type === 'code') mountCode(item, q, pageId, mode, state, result);
        else mountChoice(item, q, pageId, mode, state, result);
      });

      if (qs.length === 0) settle(state, result); // 空题目列表：立即触发回调
      return result;
    }
  };

  global.QuizEngine = engine;
})(window);
