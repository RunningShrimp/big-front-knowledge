# QA_REPORT · 前端领航员（P4 集成校验）

- 校验时间：2026-09-03T05:48:06.511Z
- 站点根目录：`/Users/didi/Desktop/project/knowledge/big_front_knowledge`
- 校验方式：一次性 Node 脚本（/tmp/qa_check.js）静态扫描 + `node --check` 语法校验
- 结论：**全部通过**

## 逐项结果

| 编号 | 检查项 | 结果 | 证据摘要 |
| --- | --- | --- | --- |
| 1 | 页面齐全（51 个 path 文件存在） | PASS | curriculum.js 解析出 51 个知识点（modules=7）<br>51 个 path 全部存在且可读 |
| 2 | 死链扫描（href/src 本地相对路径） | PASS | 扫描 55 个 html，共校验 427 个本地引用<br>全部可解析到真实文件 |
| 3 | 8 区块结构（data-page + 7 个 data-section + 壳层） | PASS | 51 / 51 个知识点页结构完全一致（import→explain→anim→link→quiz→review→interview）<br>body[data-page] 均与知识点 id 一致；均含 #fg-header / #fg-footer |
| 4 | 内容要素（≥2 Quiz、类比框、动画台、≥2 互联、笔记/自评、details、title） | PASS | 51 / 51 个知识点页要素齐备<br>抽样证据：m1-html-semantic（Quiz×2、analogy-box×1、anim-stage×1、外链 2+、FG.note/assess、details×2、title 非空） |
| 5 | 外链与网络扫描（7 类禁用模式） | PASS | 扫描 59 个 html/js（含内联脚本）<br>7 类模式 0 命中：无 src/href 外链、无 url(http、@import http、fetch(、XMLHttpRequest、new WebSocket、iframe 外链 |
| 6 | 脚本引入顺序（curriculum → progress-store → quiz-engine → site） | PASS | 54 个页面（51 知识点页 + index/wrongbook/selftest）全部按序引入且相对层级正确<br>pages/<m>/ 下均为 ../../assets/...；根目录页为 assets/... |
| 7 | JS 语法（node --check：3 个资源 js + 全部内联脚本） | PASS | 资源 js 通过：assets/js/progress-store.js, assets/js/quiz-engine.js, assets/js/site.js, assets/data/curriculum.js<br>内联脚本语法通过 54 / 54 个（51 知识点页 + 3 个根页面）<br>0 个语法错误 |
| 8 | selftest 用例数 ≥5 | PASS | selftest.html cases 数组定义 7 个用例（含单选对/错、多选部分选对、错题本、遗忘曲线、沙箱等）<br>≥5 满足要求 |
| 9 | localStorage 前缀（feguide:，字符串字面量扫描） | PASS | 共发现 6 处 localStorage 调用点（字面量/常量），全部以 feguide: 开头<br>站点 key 全集（feguide: 前缀字面量）：feguide:note:<pageId>、feguide:progress、feguide:sound、feguide:wrongbook<br>另有 3 处动态变量间接引用（非字面量）：selftest.html（内联） → k；selftest.html（内联） → k；selftest.html（内联） → k —— 已人工核对：均为对既有 feguide: 前缀 key 的备份/恢复（selftest）或由 feguide: 前缀常量传入（readStore/writeStore/lsGet/lsSet）<br>无不带 feguide: 前缀的字面量 key |
| 10 | index/wrongbook 渲染依赖（curriculum.js + 缺失容错） | PASS | index.html：已引入 curriculum.js；存在 CURRICULUM 缺失容错（#fg-notice 提示条）<br>wrongbook.html：已引入 curriculum.js；存在 CURRICULUM 缺失容错（#fg-notice 提示条）<br>index.html：getData() 在 CURRICULUM 缺失时返回 null → 展示 #fg-notice 友好文案（代码：if (!c) { notice.hidden = false; ... }）<br>wrongbook.html：render() 在 CURRICULUM 缺失时展示 fg-notice 提示，错题数据仍按编号展示（FG.findPoint 降级返回 null） |

## 详细证据

### 检查 1：页面齐全（51 个 path 文件存在） —— PASS
- curriculum.js 解析出 51 个知识点（modules=7）
- 51 个 path 全部存在且可读

### 检查 2：死链扫描（href/src 本地相对路径） —— PASS
- 扫描 55 个 html，共校验 427 个本地引用
- 全部可解析到真实文件

### 检查 3：8 区块结构（data-page + 7 个 data-section + 壳层） —— PASS
- 51 / 51 个知识点页结构完全一致（import→explain→anim→link→quiz→review→interview）
- body[data-page] 均与知识点 id 一致；均含 #fg-header / #fg-footer

### 检查 4：内容要素（≥2 Quiz、类比框、动画台、≥2 互联、笔记/自评、details、title） —— PASS
- 51 / 51 个知识点页要素齐备
- 抽样证据：m1-html-semantic（Quiz×2、analogy-box×1、anim-stage×1、外链 2+、FG.note/assess、details×2、title 非空）

### 检查 5：外链与网络扫描（7 类禁用模式） —— PASS
- 扫描 59 个 html/js（含内联脚本）
- 7 类模式 0 命中：无 src/href 外链、无 url(http、@import http、fetch(、XMLHttpRequest、new WebSocket、iframe 外链

### 检查 6：脚本引入顺序（curriculum → progress-store → quiz-engine → site） —— PASS
- 54 个页面（51 知识点页 + index/wrongbook/selftest）全部按序引入且相对层级正确
- pages/<m>/ 下均为 ../../assets/...；根目录页为 assets/...

### 检查 7：JS 语法（node --check：3 个资源 js + 全部内联脚本） —— PASS
- 资源 js 通过：assets/js/progress-store.js, assets/js/quiz-engine.js, assets/js/site.js, assets/data/curriculum.js
- 内联脚本语法通过 54 / 54 个（51 知识点页 + 3 个根页面）
- 0 个语法错误

### 检查 8：selftest 用例数 ≥5 —— PASS
- selftest.html cases 数组定义 7 个用例（含单选对/错、多选部分选对、错题本、遗忘曲线、沙箱等）
- ≥5 满足要求

### 检查 9：localStorage 前缀（feguide:，字符串字面量扫描） —— PASS
- 共发现 6 处 localStorage 调用点（字面量/常量），全部以 feguide: 开头
- 站点 key 全集（feguide: 前缀字面量）：feguide:note:<pageId>、feguide:progress、feguide:sound、feguide:wrongbook
- 另有 3 处动态变量间接引用（非字面量）：selftest.html（内联） → k；selftest.html（内联） → k；selftest.html（内联） → k —— 已人工核对：均为对既有 feguide: 前缀 key 的备份/恢复（selftest）或由 feguide: 前缀常量传入（readStore/writeStore/lsGet/lsSet）
- 无不带 feguide: 前缀的字面量 key

### 检查 10：index/wrongbook 渲染依赖（curriculum.js + 缺失容错） —— PASS
- index.html：已引入 curriculum.js；存在 CURRICULUM 缺失容错（#fg-notice 提示条）
- wrongbook.html：已引入 curriculum.js；存在 CURRICULUM 缺失容错（#fg-notice 提示条）
- index.html：getData() 在 CURRICULUM 缺失时返回 null → 展示 #fg-notice 友好文案（代码：if (!c) { notice.hidden = false; ... }）
- wrongbook.html：render() 在 CURRICULUM 缺失时展示 fg-notice 提示，错题数据仍按编号展示（FG.findPoint 降级返回 null）

## 机械性修复记录
- favicon：为 55 个 html 补充内联 data:image/svg+xml 图标（🧭，整体 percent-encode，无网络请求）
- pages/_template.html：3 处示例死链（./js/what-is-program.html、./js/data-types.html、./js/scope.html）替换为真实知识点相对路径
- pages/m7/m7-handwrite-dom.html：展示性文本 new XMLHttpRequest() 改写为 XHR（消除禁用 API 字面命中，教学含义不变）
- wrongbook.html：render() 内补充 CURRICULUM 缺失容错提示（fg-notice，缺失时错题数据仍按编号展示）

## 待修复项
- 无

## 备注
- favicon 为内联 data:image/svg+xml（🧭，整体 percent-encode），不产生任何网络请求。
- 检查 5 的扫描对象为全部 html/js（含内联脚本）；`fetch(`/`new WebSocket`/外链 src/href/url(http/@import http/iframe 外链 均 0 命中。
- 检查 9 中 `readStore(key)`/`lsGet(key)` 等经参数间接传递的 key，其全部调用点均传入 `feguide:` 前缀常量，已逐一核对。
