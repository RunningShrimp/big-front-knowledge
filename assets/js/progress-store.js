/* ============================================================
 * progress-store.js —— 学习进度 / 错题本本地存储（window.ProgressStore）
 * 说明：
 *   - 纯本地实现：所有数据保存在浏览器 localStorage，key 一律以 feguide: 前缀
 *   - 复习计划按艾宾浩斯遗忘曲线间隔 [1, 3, 7, 14, 30] 天推进
 *   - 本文件零依赖，可独立加载
 * 脚本加载顺序约定：curriculum.js → progress-store.js → quiz-engine.js → site.js → 页面内联脚本
 * ============================================================ */
(function (global) {
  'use strict';

  var KEY_PROGRESS = 'feguide:progress';    // 知识点进度仓库
  var KEY_WRONGBOOK = 'feguide:wrongbook';  // 错题本列表
  var DAY = 24 * 60 * 60 * 1000;            // 一天的毫秒数
  var RETRY_GAP = 3 * DAY;                  // 错题重测间隔：固定 3 天
  var INTERVALS = [1, 3, 7, 14, 30];        // 艾宾浩斯复习间隔（天），按已完成的复习次数取值

  /* 内部时钟：默认取系统时间；selftest 可通过 _setClock 注入模拟时间 */
  var _clockFn = function () { return Date.now(); };

  function now() {
    try { return _clockFn(); } catch (e) { return Date.now(); }
  }

  /* ---------- localStorage 读写（异常时静默降级为内存数据） ---------- */
  function readStore(key, fallback) {
    try {
      var raw = global.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return (parsed === null || parsed === undefined) ? fallback : parsed;
    } catch (e) {
      return fallback; // JSON 损坏时回退默认值
    }
  }
  function writeStore(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* 写入失败（隐私模式等）时静默忽略，本次会话内内存数据仍可用 */
    }
  }

  /* ---------- 进度仓库（内存缓存 + 落盘） ---------- */
  var _cache = null;
  function progress() {
    if (!_cache) _cache = readStore(KEY_PROGRESS, {});
    return _cache;
  }
  function saveProgress() {
    writeStore(KEY_PROGRESS, _cache);
  }
  function emptyRecord() {
    return { visits: 0, lastVisit: 0, mastery: 0, quizBest: 0, reviewCount: 0, nextReviewAt: 0 };
  }
  function copy(rec) {
    var out = {};
    for (var k in rec) {
      if (Object.prototype.hasOwnProperty.call(rec, k)) out[k] = rec[k];
    }
    return out;
  }

  /* 按已完成的复习次数（reviewCount）推进下一次复习时间：+1 → +3 → +7 → +14 → +30 天 */
  function planNextReview(rec, ts) {
    var idx = Math.max(0, Math.min(rec.reviewCount - 1, INTERVALS.length - 1));
    rec.nextReviewAt = ts + INTERVALS[idx] * DAY;
  }

  var store = {

    /** 记录一次访问：visits+1、lastVisit=now，并推进遗忘曲线 */
    visit: function (id) {
      if (!id) return null;
      var data = progress();
      var rec = data[id] || emptyRecord();
      var ts = now();
      rec.visits += 1;
      rec.lastVisit = ts;
      rec.reviewCount += 1;
      planNextReview(rec, ts);
      data[id] = rec;
      saveProgress();
      return copy(rec);
    },

    /** 记录测验成绩（只保留最佳成绩 quizBest）并推进复习计划 */
    recordQuiz: function (id, score, total) {
      if (!id) return null;
      var data = progress();
      var rec = data[id] || emptyRecord();
      var ts = now();
      var s = Number(score) || 0;
      if (s > rec.quizBest) rec.quizBest = s;
      rec.reviewCount += 1;
      planNextReview(rec, ts);
      data[id] = rec;
      saveProgress();
      return copy(rec);
    },

    /** 自评掌握度（1~5，越界自动收敛） */
    setMastery: function (id, level) {
      if (!id) return null;
      var n = Math.max(1, Math.min(5, Number(level) || 0));
      var data = progress();
      var rec = data[id] || emptyRecord();
      rec.mastery = n;
      data[id] = rec;
      saveProgress();
      return copy(rec);
    },

    /** 读取单个知识点进度；无记录返回 null */
    get: function (id) {
      var data = progress();
      return data[id] ? copy(data[id]) : null;
    },

    /** 读取全量进度对象（浅拷贝，避免外部误改缓存） */
    all: function () {
      var data = progress();
      var out = {};
      for (var k in data) {
        if (Object.prototype.hasOwnProperty.call(data, k)) out[k] = copy(data[k]);
      }
      return out;
    },

    /** 遗忘曲线到期、待复习的知识点 id 数组 */
    dueList: function () {
      var data = progress();
      var ts = now();
      var out = [];
      for (var k in data) {
        if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
        var rec = data[k];
        if (rec && rec.nextReviewAt > 0 && ts >= rec.nextReviewAt) out.push(k);
      }
      return out;
    },

    /* ---------------- 错题本 ---------------- */

    /**
     * 新增 / 刷新一条错题（同 qid 视为同一题：刷新 ts 与 nextRetryAt，不重复堆叠）
     * 条目结构：{qid, pageId, type, stem, options, answer, explain, ts, nextRetryAt=ts+3天}
     */
    addWrong: function (item) {
      if (!item || !item.qid) return null;
      var list = store.wrongList();
      var ts = now();
      var entry = {
        qid: String(item.qid),
        pageId: item.pageId || '',
        type: item.type || 'single',
        stem: item.stem || '',
        options: Array.isArray(item.options) ? item.options : [],
        answer: (item.answer === undefined || item.answer === null) ? [] : item.answer,
        explain: item.explain || '',
        ts: ts,
        nextRetryAt: ts + RETRY_GAP // 3 天后可重测
      };
      list = list.filter(function (w) { return w.qid !== entry.qid; });
      list.unshift(entry); // 最新错题排前面
      writeStore(KEY_WRONGBOOK, list);
      return entry;
    },

    /** 按 qid 移出错题本；有删除返回 true */
    removeWrong: function (qid) {
      var list = store.wrongList();
      var next = list.filter(function (w) { return w.qid !== qid; });
      writeStore(KEY_WRONGBOOK, next);
      return next.length < list.length;
    },

    /** 全部错题（数组） */
    wrongList: function () {
      return readStore(KEY_WRONGBOOK, []);
    },

    /** 清空全部学习数据（进度 + 错题本），不可恢复 */
    resetAll: function () {
      _cache = {};
      try {
        global.localStorage.removeItem(KEY_PROGRESS);
        global.localStorage.removeItem(KEY_WRONGBOOK);
      } catch (e) { /* 忽略 */ }
    },

    /* ---------- 测试钩子（selftest 页使用，业务页面勿调用） ---------- */
    /** 注入 / 还原内部时钟：传入返回毫秒时间戳的函数；传空还原系统时间 */
    _setClock: function (fn) {
      _clockFn = fn || function () { return Date.now(); };
    },
    _now: now,
    _DAY: DAY,
    _INTERVALS: INTERVALS
  };

  global.ProgressStore = store;
})(window);
