/**
 * ============================================================
 * 前端领航员 · 大前端全栈成长地图 —— 课程总数据文件
 * ------------------------------------------------------------
 * 说明：
 * 1. 本文件为纯静态站点的唯一课程数据源，直接内联挂载
 *    window.CURRICULUM，无任何 import/export，
 *    浏览器以 file:// 协议直接打开页面即可使用；
 *    页面中只需在本文件之后用 <script> 读取 window.CURRICULUM。
 * 2. 结构总览：
 *    - siteName / tagline：站点名称与副标题
 *    - modules[]：七大知识模块（语言基石 → 综合实战与面试）
 *      - 模块级 summary：一句话模块简介
 *      - points[]：模块下的知识点卡片
 *        · id / title / path：知识点唯一标识、标题与页面路径
 *        · deps：前置知识点 id 列表（依赖图整体无环）
 *        · minutes：建议学习时长（分钟，15~40）
 *        · outline：3~5 条内容大纲（面向零基础 + 面试考点）
 *        · analogy：生活类比素材方向（一句话）
 * ============================================================
 */
window.CURRICULUM = {
  siteName: '前端领航员',
  tagline: '大前端全栈成长地图',
  modules: [

    /* ==========================================================
     * M1 语言基石 —— 一切前端的地基：先练内功，再学招式
     * ========================================================== */
    {
      id: 'm1',
      name: '语言基石',
      color: '#4C6FFF',
      summary: '一切前端的地基：从 HTML 语义化到 JS 核心机制与 TypeScript，练好内功才能举一反三。',
      points: [
        {
          id: 'm1-html-semantic',
          title: 'HTML 语义化与页面结构',
          path: 'pages/m1/m1-html-semantic.html',
          deps: [],
          minutes: 25,
          outline: [
            '语义化标签全景：header、nav、main、article、section、aside、footer 各自的分工',
            '语义化的三大收益：SEO 友好、无障碍可访问（读屏器）、代码可维护',
            '动手对比：div/span 满天飞的「面条页」如何一步步重构为语义化结构',
            '标题层级 h1~h6 的正确用法与常见误区（跳级、一页多个 h1）',
            '面试高频：为什么强调语义化？strong 与 b、em 与 i 有何区别？'
          ],
          analogy: '就像超市货架：生鲜、日用品、零食分区摆放，顾客（搜索引擎）一眼就能找到想要的商品；全堆进一个大箱子里则寸步难行。'
        },
        {
          id: 'm1-css-box',
          title: 'CSS 盒模型与 Flex·Grid 布局',
          path: 'pages/m1/m1-css-box.html',
          deps: ['m1-html-semantic'],
          minutes: 30,
          outline: [
            '盒模型四层结构：content、padding、border、margin，box-sizing 的两种取值',
            '标准盒模型与 IE 盒模型的差异及日常选型建议',
            'Flex 弹性布局：主轴/交叉轴方向、grow/shrink/basis 的空间分配逻辑',
            'Grid 网格布局：行列模板、fr 单位与常见栅格方案',
            '面试高频：盒模型原理、垂直水平居中的 N 种写法'
          ],
          analogy: '盒模型像快递包裹：商品是内容，泡沫棉是 padding，纸箱是 border，包裹之间的间距是 margin；Flex 像排队上公交，Grid 像电影院对号入座。'
        },
        {
          id: 'm1-css-bfc-anim',
          title: 'CSS 进阶：BFC、层叠上下文与动画',
          path: 'pages/m1/m1-css-bfc-anim.html',
          deps: ['m1-css-box'],
          minutes: 30,
          outline: [
            'BFC 是什么：触发条件与「内部布局互不干扰」的隔离特性',
            'BFC 实战应用：清除浮动、防止 margin 合并、自适应两栏布局',
            '层叠上下文与 z-index：为什么设置了 z-index 却不生效',
            'transition 与 animation 的区别、transform 做动画的性能优势',
            '面试高频：BFC 的触发条件、z-index 的层级比较规则'
          ],
          analogy: 'BFC 像每家独立的厨房，各家油烟互不串门；层叠上下文像公司的部门层级——跨部门比职级（z-index）之前，先看你在哪个部门（上下文）。'
        },
        {
          id: 'm1-js-scope',
          title: 'JS 类型、作用域与闭包',
          path: 'pages/m1/m1-js-scope.html',
          deps: ['m1-html-semantic'],
          minutes: 35,
          outline: [
            '基本类型与引用类型：栈与堆的存放差异、值传递与引用传递',
            '类型判断三板斧：typeof、instanceof、Object.prototype.toString',
            '作用域链与变量提升：var 的历史包袱与 let/const 的暂时性死区',
            '闭包的形成原理与经典应用：计数器、私有变量、函数柯里化',
            '面试高频：闭包导致内存泄漏的场景与解决办法'
          ],
          analogy: '作用域像小区门禁：自己楼栋随意进出，去别栋要先有权限；闭包像外卖柜——函数回到家里后，仍能凭小票（引用）取出当初存放的东西。'
        },
        {
          id: 'm1-js-prototype',
          title: '原型链与 this',
          path: 'pages/m1/m1-js-prototype.html',
          deps: ['m1-js-scope'],
          minutes: 30,
          outline: [
            'prototype、__proto__ 与 constructor 三者的关系图解',
            '原型链属性查找过程与属性遮蔽（shadowing）现象',
            'this 的四种绑定规则：默认绑定、隐式绑定、显式绑定（call/apply/bind）、new 绑定',
            '手写 new 与 instanceof 的思路拆解',
            '面试高频：new 操作符做了什么？class 语法与原型是什么关系？'
          ],
          analogy: '原型链像家族继承：自己没有的东西去问父母，父母没有再问祖父母；this 像「我」这个词——谁在说话（调用），它就指向谁。'
        },
        {
          id: 'm1-js-eventloop',
          title: '事件循环与任务队列',
          path: 'pages/m1/m1-js-eventloop.html',
          deps: ['m1-js-scope'],
          minutes: 30,
          outline: [
            '为什么 JS 设计成单线程，异步机制如何弥补效率',
            '调用栈、任务队列与事件循环的协作流程',
            '宏任务（setTimeout）与微任务（Promise.then）的优先级规则',
            '经典执行顺序题：同步、微任务、宏任务混合输出的推演方法',
            '面试高频：浏览器与 Node 事件循环的差异'
          ],
          analogy: '事件循环像只有一名厨师的餐厅：先做完手里的订单（同步任务），新订单排队等；VIP 小抄（微任务）永远插在下一位普通客人（宏任务）之前。'
        },
        {
          id: 'm1-js-promise',
          title: 'Promise 与 async/await',
          path: 'pages/m1/m1-js-promise.html',
          deps: ['m1-js-eventloop'],
          minutes: 30,
          outline: [
            '回调地狱的痛点与 Promise 的三种状态：pending / fulfilled / rejected',
            'then 链的值穿透与错误冒泡，catch 与 finally 的使用时机',
            '并发利器对比：Promise.all / allSettled / race / any',
            'async/await 的语法糖本质与错误处理最佳实践',
            '面试高频：手写简化版 Promise、all 与 allSettled 的选型'
          ],
          analogy: 'Promise 像一张取餐号牌：先拿凭证，餐好了（fulfilled）通知你，做不了（rejected）给你退款；await 就像坐在座位上等叫号，不必一直趴在窗口追问。'
        },
        {
          id: 'm1-js-es6',
          title: 'ES6+ 核心特性',
          path: 'pages/m1/m1-js-es6.html',
          deps: ['m1-js-scope'],
          minutes: 30,
          outline: [
            '变量声明升级：let/const 的块级作用域与暂时性死区',
            '解构赋值、展开/剩余运算符与模板字符串',
            '箭头函数的 this 特点、适用边界与不可用场景',
            '进阶速览：Map/Set、可选链、空值合并、Proxy 的典型用途',
            '面试高频：箭头函数与普通函数的区别、var/let/const 三者对比'
          ],
          analogy: 'ES6 像手机系统的大版本更新：老功能都兼容，但新加了快捷手势（解构）、暗色模式（可选链）——用顺手之后再也回不去了。'
        },
        {
          id: 'm1-ts-basic',
          title: 'TypeScript 基础',
          path: 'pages/m1/m1-ts-basic.html',
          deps: ['m1-js-es6'],
          minutes: 30,
          outline: [
            '为什么需要 TS：动态类型的隐患与编译期检查的价值',
            '基础类型标注与类型推断，any / unknown / never 的区别',
            'interface 与 type 的异同、联合类型与字面量类型',
            '泛型入门：写一个类型安全的通用工具函数',
            '面试高频：unknown 与 any 的差异、枚举的使用场景'
          ],
          analogy: 'TS 像超市自助结算机的扫码环节：商品放错区（类型不匹配）当场报警，而不是回家（线上运行）之后才发现买错了东西。'
        }
      ]
    },

    /* ==========================================================
     * M2 浏览器与网络 —— 打开网页那一刻发生了什么
     * ========================================================== */
    {
      id: 'm2',
      name: '浏览器与网络',
      color: '#0FB5A6',
      summary: '打开网页的那一刻发生了什么：拆解浏览器渲染流程，读懂 HTTP 网络世界的底层规则。',
      points: [
        {
          id: 'm2-pipeline',
          title: '浏览器渲染流水线',
          path: 'pages/m2/m2-pipeline.html',
          deps: ['m1-css-box'],
          minutes: 25,
          outline: [
            '关键五步：解析 HTML 构建 DOM、解析 CSS 构建 CSSOM',
            '渲染树合成与布局（Layout）、绘制（Paint）、合成（Composite）',
            '脚本与样式对渲染的阻塞：defer 与 async 的加载执行差别',
            '首屏渲染关键路径与常见优化切入点',
            '面试高频：从输入 URL 到页面展示的完整流程'
          ],
          analogy: '像装修新房：DOM/CSSOM 是图纸与材料清单，渲染树是施工方案，Layout 量尺寸，Paint 刷墙，Composite 是家具的最终摆位。'
        },
        {
          id: 'm2-reflow',
          title: '重排、重绘与合成层',
          path: 'pages/m2/m2-reflow.html',
          deps: ['m2-pipeline'],
          minutes: 25,
          outline: [
            '重排（Reflow）与重绘（Repaint）的定义与触发条件',
            '代价排序：改几何属性 > 改颜色 > 仅做合成',
            'transform 与 opacity 为什么快：合成层的「免重绘」特权',
            '强制同步布局的成因与「读写分离」的批处理优化',
            '面试高频：如何减少重排重绘？will-change 的原理与滥用风险'
          ],
          analogy: '重排像全屋重新改装水电，重绘只是重新刷漆，合成层则像直接换一张海报贴上墙——动的地方越少，越省时省力。'
        },
        {
          id: 'm2-http',
          title: 'HTTP/1.1、HTTP/2 与 HTTP/3',
          path: 'pages/m2/m2-http.html',
          deps: [],
          minutes: 30,
          outline: [
            'HTTP 报文结构：请求行/响应行、头部字段与正文',
            '常用方法语义与幂等性：GET / POST / PUT / DELETE',
            '状态码家族：2xx 成功、3xx 重定向、4xx 客户端错误、5xx 服务端错误',
            '版本演进：1.1 队头阻塞 → 2 多路复用 → 3 QUIC 换底座',
            '面试高频：HTTP/2 多路复用与 1.1 keep-alive 的区别'
          ],
          analogy: 'HTTP/1.1 是只有一条车道的窄桥，HTTP/2 拓宽成多车道但桥墩（TCP）没换，HTTP/3 连地基一起换成 QUIC——个别车道堵车不再殃及全桥。'
        },
        {
          id: 'm2-https',
          title: 'HTTPS 与 TLS 握手',
          path: 'pages/m2/m2-https.html',
          deps: ['m2-http'],
          minutes: 25,
          outline: [
            '对称与非对称加密的组合拳：混合加密各取所长',
            '数字证书与 CA 信任链：如何确认「对方真的是他」',
            'TLS 握手流程拆解：协商算法、交换密钥、验证签名',
            '中间人攻击为什么防住了：签名与证书校验的作用',
            '面试高频：HTTPS 建连比 HTTP 慢在哪？TLS 1.3 快在哪？'
          ],
          analogy: '像寄保险箱：先用对方的公开锁（公钥）锁住钥匙，只有收件人能打开；公证处（CA）的火漆印保证保险箱中途没被调包。'
        },
        {
          id: 'm2-cache',
          title: '浏览器缓存策略',
          path: 'pages/m2/m2-cache.html',
          deps: ['m2-http'],
          minutes: 25,
          outline: [
            '强缓存：Expires 与 Cache-Control 的优先级及常用指令',
            '协商缓存：Last-Modified/If-Modified-Since 与 ETag/If-None-Match',
            '304 状态码的意义：不传内容、只确认「没变」的省流量应答',
            '缓存策略实战：HTML 不缓存 + 静态资源长缓存加指纹',
            '面试高频：强缓存与协商缓存的完整判定流程'
          ],
          analogy: '强缓存像家里囤好的日用品，用完才去超市；协商缓存像先打电话问超市「价格变了吗」，没变（304）就白跑一趟都不用。'
        },
        {
          id: 'm2-cors',
          title: '跨域与 CORS',
          path: 'pages/m2/m2-cors.html',
          deps: ['m2-http'],
          minutes: 25,
          outline: [
            '同源策略的定义：协议、域名、端口三者必须完全一致',
            'CORS 简单请求与预检请求（OPTIONS）的判定条件',
            '关键响应头：Access-Control-Allow-Origin / Methods / Headers',
            '携带 Cookie 的跨域：credentials 设置与通配符的限制',
            '面试高频：为什么会出现 OPTIONS 请求？JSONP 与 CORS 如何取舍？'
          ],
          analogy: '同源策略像小区门禁，跨域请求是外来访客；CORS 预检像前台先打电话确认「你们公司允许这个人进来吗」，拿到许可才放行。'
        },
        {
          id: 'm2-security',
          title: 'Web 安全：XSS、CSRF 与 CSP',
          path: 'pages/m2/m2-security.html',
          deps: ['m2-cors'],
          minutes: 30,
          outline: [
            'XSS 三种形态：存储型、反射型、DOM 型的攻击链路',
            'XSS 防御体系：输出转义、HttpOnly Cookie、输入校验',
            'CSRF 原理：借用用户已有登录态发起伪造请求',
            'CSRF 防御：CSRF Token、SameSite Cookie、Referer 校验',
            'CSP 内容安全策略；面试高频：XSS 与 CSRF 的本质区别'
          ],
          analogy: 'XSS 是有人往小区公告栏贴假通知骗居民转账；CSRF 是冒充你家亲戚拿你的钥匙申请单去物业办事；CSP 则规定公告栏只允许贴物业盖章的告示。'
        },
        {
          id: 'm2-storage',
          title: '浏览器存储：Cookie、Web Storage 与 IndexedDB',
          path: 'pages/m2/m2-storage.html',
          deps: ['m2-cache'],
          minutes: 25,
          outline: [
            'Cookie：约 4KB 小容量、自动随请求发送、过期与作用域设置',
            'localStorage 与 sessionStorage：5MB 级的持久/会话存储',
            'IndexedDB：浏览器里的「迷你数据库」，事务与索引',
            '场景选型：登录态、主题偏好、离线数据分别存在哪',
            '面试高频：Cookie 与 localStorage 的核心区别'
          ],
          analogy: 'Cookie 是随身口袋名片——走到哪递到哪却装不下几行字；localStorage 是家里储物柜；IndexedDB 则是私人档案室，能分门别类存大量档案。'
        }
      ]
    },

    /* ==========================================================
     * M3 框架与工程化 —— 从手写 DOM 到组件化与工程体系
     * ========================================================== */
    {
      id: 'm3',
      name: '框架与工程化',
      color: '#8B5CF6',
      summary: '从手写 DOM 到组件化开发：理解框架背后的设计思想与现代前端的工程化体系。',
      points: [
        {
          id: 'm3-vdom',
          title: '虚拟 DOM 与 Diff 算法',
          path: 'pages/m3/m3-vdom.html',
          deps: ['m1-js-prototype'],
          minutes: 30,
          outline: [
            '直接操作 DOM 为什么慢：真实 DOM 的重量与重排代价',
            '虚拟 DOM：用轻量 JS 对象描述页面节点',
            'Diff 算法三大策略：同层比较、类型判断、key 的作用',
            '从 Diff 到 Patch：最小化真实 DOM 操作的更新流程',
            '面试高频：列表渲染为什么要有稳定的 key？虚拟 DOM 一定更快吗？'
          ],
          analogy: '虚拟 DOM 像装修前的设计效果图：先在纸面上（内存）比对新旧方案、列出改动清单，再只动需要动的墙，而不是推倒重装。'
        },
        {
          id: 'm3-react',
          title: 'React 核心与 Hooks',
          path: 'pages/m3/m3-react.html',
          deps: ['m3-vdom'],
          minutes: 35,
          outline: [
            '核心心智模型：UI = f(state)，状态驱动视图与单向数据流',
            'JSX 与组件：props 的只读契约、受控与非受控组件',
            '核心 Hooks：useState、useEffect、useMemo、useCallback、useRef',
            '常见陷阱：闭包旧值、依赖数组漏写、不必要的重渲染',
            '面试高频：useEffect 与生命周期的对应关系、Hooks 为什么不能写在条件分支里'
          ],
          analogy: 'React 像点单机：你只负责改订单（state），厨房自动重新出餐（重渲染）；Hooks 是后厨的操作规程——乱摆放（在条件里调用）就会上错菜。'
        },
        {
          id: 'm3-vue',
          title: 'Vue 响应式原理',
          path: 'pages/m3/m3-vue.html',
          deps: ['m3-vdom'],
          minutes: 30,
          outline: [
            '响应式的目标：数据变化与视图更新的自动同步',
            'Vue 2 方案：Object.defineProperty 劫持的原理与三大缺陷',
            'Vue 3 方案：Proxy 全面拦截与惰性响应式的优势',
            '依赖收集与派发更新：track、trigger 的协作流程',
            '面试高频：Vue2 与 Vue3 响应式的区别、ref 与 reactive 怎么选'
          ],
          analogy: '响应式像全屋智能传感器：数据一变（有人开门），灯自动亮（视图更新）；defineProperty 只在特定位置装了传感器，Proxy 则是全屋无死角监控。'
        },
        {
          id: 'm3-state',
          title: '状态管理思想',
          path: 'pages/m3/m3-state.html',
          deps: ['m3-react'],
          minutes: 25,
          outline: [
            '问题起源：跨层级、跨组件的状态共享与同步难题',
            '单一数据源与单向数据流：action → state → view 的闭环',
            'Redux 三原则，以及 Vuex/Pinia、Zustand 的设计对比',
            '状态分类：服务端状态与客户端状态，何时才需要引入状态库',
            '面试高频：什么场景才真正需要全局状态管理？'
          ],
          analogy: '状态管理像公司统一的知识库：各部门不再互相拷贝文件（props 层层传值），都从同一份源头读取，改动须走审批（action）且全程留痕。'
        },
        {
          id: 'm3-router',
          title: '前端路由原理',
          path: 'pages/m3/m3-router.html',
          deps: [],
          minutes: 20,
          outline: [
            '多页应用与单页应用（SPA）的路由差异',
            'hash 模式：监听 hashchange 事件，# 后的内容不会发给服务器',
            'history 模式：pushState/replaceState 与 popstate 事件',
            'history 模式刷新 404 的成因与 Nginx 兜底配置',
            '面试高频：hash 与 history 模式的区别、手写简易路由的思路'
          ],
          analogy: 'SPA 路由像商场里的导览屏：楼还是那栋楼（页面不刷新），屏幕内容随时切换（视图更新）；history 模式刷新 404，就像保安只认正门编号、不认识内部展厅的名字。'
        },
        {
          id: 'm3-module',
          title: '模块化：ESM 与 CommonJS',
          path: 'pages/m3/m3-module.html',
          deps: ['m1-js-es6'],
          minutes: 25,
          outline: [
            '为什么需要模块化：命名冲突与依赖混乱的历史包袱',
            'CommonJS：require 同步加载与运行时的值拷贝',
            'ESM：import/export 静态分析与编译期引用绑定',
            '关键差异：加载时机、this 指向、循环依赖的表现',
            '面试高频：ESM 与 CJS 的区别、为什么 ESM 能做 Tree Shaking'
          ],
          analogy: 'CommonJS 像食堂打菜——打好一份端走（值拷贝），原菜怎么变与你无关；ESM 像共享菜谱——大家看的是同一份原文（引用绑定），菜谱一改所有人都知道。'
        },
        {
          id: 'm3-build',
          title: '构建工具思想与 Vite',
          path: 'pages/m3/m3-build.html',
          deps: ['m3-module'],
          minutes: 25,
          outline: [
            '构建工具解决什么：模块合并、语法降级、资源压缩、环境变量注入',
            '传统方案 Webpack：先全量打包再启动的冷启动代价',
            'Vite 思路：开发时按需 ESM 编译，生产环境用 Rollup 打包',
            '插件与配置生态：一份配置打通开发与构建流程',
            '面试高频：Vite 为什么快？与 Webpack 的本质差异是什么？'
          ],
          analogy: 'Webpack 像自助餐厅——全部菜炒好才开门营业（先打包后服务）；Vite 像现点现炒的小馆子（按需现做），开业飞快，办宴席（生产打包）时再请帮手。'
        },
        {
          id: 'm3-component',
          title: '组件设计原则',
          path: 'pages/m3/m3-component.html',
          deps: ['m3-react', 'm3-vue'],
          minutes: 25,
          outline: [
            '组件的边界：单一职责与合理的拆分粒度',
            'props 设计：受控/非受控模式、默认值与类型契约',
            '组合优于配置：children、插槽与 render props 的运用',
            '通用组件的演进路径：业务剥离、无头（Headless）组件思想',
            '面试高频：如何设计一个 Modal / Select 通用组件？'
          ],
          analogy: '设计组件像设计乐高积木：每块形状单一却能无限组合（组合优于配置），而不是造一个包揽一切却难以改造的大型遥控机器人。'
        }
      ]
    },

    /* ==========================================================
     * M4 性能与质量 —— 快与稳是体验的底线
     * ========================================================== */
    {
      id: 'm4',
      name: '性能与质量',
      color: '#F59E0B',
      summary: '快与稳是体验的底线：用指标定位瓶颈，用优化手段提速，用测试与监控守住质量。',
      points: [
        {
          id: 'm4-cwv',
          title: 'Core Web Vitals 性能指标',
          path: 'pages/m4/m4-cwv.html',
          deps: ['m2-reflow'],
          minutes: 25,
          outline: [
            'LCP 最大内容绘制：衡量「主要东西多久看到」，2.5 秒红线',
            'INP 交互延迟：从点击到反馈的响应速度标准',
            'CLS 累积布局偏移：页面「跳动」的量化与常见成因',
            '测量工具：Lighthouse、PageSpeed Insights、web-vitals 库',
            '面试高频：三大指标的定义、采集方式与优化方向'
          ],
          analogy: '像体检报告三大项：LCP 是「主菜多久端上来」，INP 是「叫服务员多久有人应」，CLS 是「餐桌会不会突然被挪走」。'
        },
        {
          id: 'm4-load',
          title: '首屏与资源加载优化',
          path: 'pages/m4/m4-load.html',
          deps: ['m4-cwv', 'm2-cache'],
          minutes: 30,
          outline: [
            '关键渲染路径优化：CSS/JS 的阻塞行为与 defer/async 的使用',
            '代码分割与路由懒加载：按需把 JS 体积拆小',
            '加载优先级：preload/prefetch 预加载与关键资源内联',
            'SSR/SSG 思想：把「组装页面」的工作提前到服务端或构建期',
            '面试高频：首屏白屏的排查思路与优化清单'
          ],
          analogy: '首屏优化像餐厅上菜策略：先上招牌菜（关键资源）让客人开吃，配菜（非关键资源）后厨慢慢做，别让客人干等一桌满汉全席。'
        },
        {
          id: 'm4-image',
          title: '图片优化与懒加载',
          path: 'pages/m4/m4-image.html',
          deps: ['m4-load'],
          minutes: 20,
          outline: [
            '图片格式选型：WebP / AVIF 与 JPEG / PNG 的体积画质对比',
            '响应式图片：srcset 与 sizes 按屏幕宽度下发合适尺寸',
            '懒加载实现：loading="lazy" 与 IntersectionObserver 的原理',
            '进阶手段：CDN 实时裁剪、占位图与渐进式加载',
            '面试高频：懒加载的实现原理、如何避免图片加载引起的布局抖动'
          ],
          analogy: '懒加载像自助餐厅按需出餐：先端一小份样品（占位图），等客人（用户）走近餐台真要吃了，再上大份正餐（真实图片）。'
        },
        {
          id: 'm4-runtime',
          title: '运行时优化：防抖、节流与计算缓存',
          path: 'pages/m4/m4-runtime.html',
          deps: ['m1-js-scope'],
          minutes: 25,
          outline: [
            '防抖（debounce）：只认最后一次触发，适合搜索输入联想',
            '节流（throttle）：固定频率放行，适合滚动、resize 监听',
            '计算缓存/记忆化：以空间换时间，缓存纯函数的计算结果',
            '长列表优化速览：虚拟滚动的核心思想',
            '面试高频：手写防抖与节流、两者适用场景的辨析'
          ],
          analogy: '防抖像电梯关门键——最后按的人说了算（等人停手再执行）；节流像地铁闸机——无论多少人排队，每秒只放行固定数量。'
        },
        {
          id: 'm4-monitor',
          title: '前端监控与错误上报',
          path: 'pages/m4/m4-monitor.html',
          deps: ['m4-cwv'],
          minutes: 25,
          outline: [
            '监控体系全景：错误监控、性能监控、行为埋点监控',
            'JS 错误采集：window.onerror 与 unhandledrejection 的分工',
            '资源加载失败与接口异常的捕获方式、埋点上报方案',
            '上报策略：批量合并、失败重试与 sendBeacon 的使用',
            '面试高频：如何从零设计一个前端错误监控系统'
          ],
          analogy: '前端监控像商场里的监控摄像头：不打扰顾客（用户无感），但出了事（报错）能回放定位到具体柜台（出错代码位置）。'
        },
        {
          id: 'm4-test',
          title: '单元测试与 E2E 测试',
          path: 'pages/m4/m4-test.html',
          deps: [],
          minutes: 25,
          outline: [
            '测试金字塔：单元、集成、E2E 三层的成本与收益',
            '单元测试：Vitest/Jest 的断言、mock 与覆盖率',
            '组件测试：渲染快照与交互模拟（Testing Library 思想）',
            'E2E 测试：Playwright/Cypress 模拟真实用户操作链路',
            '面试高频：什么样的代码值得写测试？如何平衡覆盖率与成本？'
          ],
          analogy: '测试像产品出厂前的质检流水线：单测是逐颗检查螺丝，E2E 是整机通电试运行——跳过质检直接发货，返修成本会翻好几倍。'
        },
        {
          id: 'm4-error',
          title: '错误处理与容错设计',
          path: 'pages/m4/m4-error.html',
          deps: ['m4-monitor'],
          minutes: 20,
          outline: [
            '错误分类：可预期错误与程序缺陷的不同对待方式',
            '同步/异步错误捕获全景：try/catch、Promise、全局兜底',
            '边界与兜底：React ErrorBoundary、请求重试与超时控制',
            '降级策略：默认值、骨架屏与功能开关（Feature Flag）',
            '面试高频：如何为关键页面设计容错与降级方案'
          ],
          analogy: '容错设计像银行的备用发电机：市电（正常依赖）停了，灯（核心功能）依然亮着；最差也提示「稍后再试」，而不是整栋楼陷入黑暗。'
        }
      ]
    },

    /* ==========================================================
     * M5 跨端开发 —— 一套代码跑遍小程序、App 与 H5
     * ========================================================== */
    {
      id: 'm5',
      name: '跨端开发',
      color: '#EF476F',
      summary: '一套代码如何跑遍小程序、App 与 H5：拆解各跨端方案的架构原理与取舍逻辑。',
      points: [
        {
          id: 'm5-mp-arch',
          title: '小程序双线程架构',
          path: 'pages/m5/m5-mp-arch.html',
          deps: ['m3-vdom', 'm1-js-eventloop'],
          minutes: 25,
          outline: [
            '双线程模型：渲染层（WebView）与逻辑层（JS 引擎）的分离设计',
            '为什么要隔离：安全管控与性能之间的取舍',
            'setData 通信机制与频繁 setData 的性能陷阱',
            'WXML/WXSS 与 HTML/CSS 的对应关系及语法差异',
            '面试高频：小程序为什么采用双线程？setData 有哪些优化手段？'
          ],
          analogy: '双线程像餐厅的前厅与后厨：前厅（渲染层）负责摆盘上菜，后厨（逻辑层）负责炒菜，中间靠传菜口（setData）送单——单传得太勤，菜都凉了。'
        },
        {
          id: 'm5-mp-web',
          title: '小程序与 Web 的差异',
          path: 'pages/m5/m5-mp-web.html',
          deps: ['m5-mp-arch'],
          minutes: 20,
          outline: [
            '技术栈差异：没有完整 DOM/BOM，组件由框架统一封装',
            '生命周期对比：onLoad/onShow/onHide 与 Web 页面事件的不同',
            '能力边界：包体积限制、发布审核机制与开放 API',
            '迁移思路：一份逻辑层代码如何适配小程序与 H5 两端',
            '面试高频：小程序与 H5 开发的核心区别有哪些'
          ],
          analogy: 'H5 像自驾游——路况（浏览器能力差异）全靠自己应对；小程序像坐景区观光车——路线固定、安检严格（审核），但直达景点（原生能力）更省心。'
        },
        {
          id: 'm5-rn',
          title: 'React Native 原理',
          path: 'pages/m5/m5-rn.html',
          deps: ['m3-react'],
          minutes: 25,
          outline: [
            '核心思想：JS 写逻辑，由原生组件负责渲染',
            '旧架构 Bridge：异步消息桥的通信模型与性能瓶颈',
            '新架构 Fabric 与 JSI：同步直调，去掉序列化开销',
            '样式系统：Flexbox 子集与平台差异的处理方式',
            '面试高频：RN 与小程序、Hybrid 在渲染方式上的区别'
          ],
          analogy: '旧 Bridge 像隔着翻译开电话会——你说一句他翻一句还有延迟；新 JSI 像配了随身同传——几乎同步对话，沟通成本大降。'
        },
        {
          id: 'm5-flutter',
          title: 'Flutter 自绘引擎',
          path: 'pages/m5/m5-flutter.html',
          deps: ['m5-rn'],
          minutes: 25,
          outline: [
            '自绘 vs 映射原生控件：两种跨端渲染哲学的对决',
            'Skia 渲染引擎：Dart 直接下发绘制指令到 GPU',
            'Dart 语言与 AOT/JIT 双模式：开发热重载、发布高性能',
            'Widget / Element / RenderObject 三棵树的职责划分',
            '面试高频：Flutter 与 RN 渲染机制的对比'
          ],
          analogy: 'RN 像在各国雇本地施工队按图纸盖楼（用原生控件）；Flutter 像带着自己的施工队和建材，去哪儿都盖出一模一样的房子（自绘），风格绝对统一。'
        },
        {
          id: 'm5-hybrid',
          title: 'Hybrid 开发与 JSBridge',
          path: 'pages/m5/m5-hybrid.html',
          deps: ['m5-mp-web'],
          minutes: 25,
          outline: [
            'Hybrid 架构：原生壳 + WebView 加载 H5 的混合模式',
            'JSBridge 原理：URL Scheme 拦截与注入 API 两种通道',
            '双向通信：H5 调用原生、原生回调 H5 的完整链路',
            '离线包与热更新：绕过应用发版周期的加载优化',
            '面试高频：JSBridge 的实现原理与安全注意事项'
          ],
          analogy: 'Hybrid 像景区里的观光小火车：车身是原生的（容器稳），乘客是 H5（内容灵活）；JSBridge 是车厢对讲机——乘客（网页）喊一声「开空调」，司机（原生）就照做。'
        },
        {
          id: 'm5-choose',
          title: '跨端方案选型',
          path: 'pages/m5/m5-choose.html',
          deps: ['m5-rn', 'm5-flutter', 'm5-hybrid'],
          minutes: 20,
          outline: [
            '候选方案盘点：H5、小程序、RN、Flutter、原生在能力光谱上的位置',
            '四维评估法：性能体验、开发效率、团队技术栈、生态成熟度',
            '典型场景匹配：电商大促页、工具类 App、内容资讯的选型逻辑',
            '混合策略：核心模块原生 + 边缘模块跨端的组合拳',
            '面试高频：让你为新产品选跨端方案，如何给出论证'
          ],
          analogy: '选型像选交通工具：地铁（原生）最快但线路固定，打车（RN/Flutter）灵活均衡，共享单车（H5）随处可用但慢——先看去哪儿（场景），再决定坐什么车。'
        }
      ]
    },

    /* ==========================================================
     * M6 后端基础（Node 向）—— 前端工程师的后端第一课
     * ========================================================== */
    {
      id: 'm6',
      name: '后端基础（Node 向）',
      color: '#10B981',
      summary: '前端工程师的后端第一课：用熟悉的 JS 搭起服务、连上数据库，把应用真正部署上线。',
      points: [
        {
          id: 'm6-node',
          title: 'Node.js 运行时与事件循环',
          path: 'pages/m6/m6-node.html',
          deps: ['m1-js-eventloop'],
          minutes: 25,
          outline: [
            'Node 的组成：V8 引擎 + libuv + 内置模块的分层结构',
            'Node 事件循环六大阶段：timers、poll、check 等轮转顺序',
            '与浏览器事件循环的差异：微任务的执行时机不同',
            '异步非阻塞 IO 模型：单线程如何扛住高并发',
            '面试高频：Node 与浏览器事件循环的区别、setImmediate 与 setTimeout 谁先执行'
          ],
          analogy: 'Node 像一位前台总管：不亲自搬货（不做重计算），只负责接单与调度（异步 IO），所有体力活都外包给快递员（系统线程池）。'
        },
        {
          id: 'm6-server',
          title: 'HTTP 服务：Express 与 Koa',
          path: 'pages/m6/m6-server.html',
          deps: ['m6-node', 'm2-http'],
          minutes: 25,
          outline: [
            '用 Node 原生 http 模块手写一个最小可用服务器',
            'Express：回调式中间件与单向「管道」处理模型',
            'Koa：基于 async/await 的洋葱模型执行顺序',
            '路由、静态资源服务与常用中间件（body 解析、cors）',
            '面试高频：Express 与 Koa 中间件机制的区别'
          ],
          analogy: '中间件像工厂流水线：Express 是单向传送带，逐站加工；Koa 的洋葱模型像安检通道——进时查一次包、出时再查一次，一来一回都有机会处理。'
        },
        {
          id: 'm6-rest',
          title: 'RESTful API 设计',
          path: 'pages/m6/m6-rest.html',
          deps: ['m6-server'],
          minutes: 20,
          outline: [
            'REST 核心思想：一切皆资源——URL 表资源、HTTP 方法表动作',
            'URL 设计规范：名词复数、层级嵌套与版本管理',
            '状态码语义化：200/201/400/401/403/404/500 的正确使用',
            '统一响应结构与分页、过滤、排序参数的设计',
            '面试高频：REST 的设计原则、GET 与 POST 的语义区别'
          ],
          analogy: 'RESTful 像图书馆检索系统：书架编号（URL）含义固定，借书还书（HTTP 方法）各有窗口，不必每次都问管理员「这个操作该找谁」。'
        },
        {
          id: 'm6-db',
          title: '数据库基础与索引',
          path: 'pages/m6/m6-db.html',
          deps: [],
          minutes: 25,
          outline: [
            '关系型 vs 非关系型：表格思维与文档思维的适用场景',
            'SQL 基础：增删改查四类语句与 JOIN 连表查询',
            '索引原理：B+ 树结构与「目录页」加速查询的逻辑',
            '索引的代价与失效场景：为什么有时建了索引也用不上',
            '面试高频：为什么用 B+ 树？哪些字段适合建索引？'
          ],
          analogy: '索引像字典的部首检字表：按页码直达目标页，不必从第一页翻到最后一页；但目录本身也占篇幅（写入变慢），而且像「翻着找」那种模糊查询（前缀模糊 LIKE）目录帮不上忙。'
        },
        {
          id: 'm6-session',
          title: 'Cookie、Session 与鉴权基础',
          path: 'pages/m6/m6-session.html',
          deps: ['m2-storage'],
          minutes: 25,
          outline: [
            'HTTP 无状态的困境：为什么需要「记住用户」的机制',
            'Cookie 传递会话凭证：属性设置与 Secure/HttpOnly 安全选项',
            'Session 机制：服务端存会话数据，Cookie 只存 SessionID',
            '会话管理：过期、续期、登出与分布式 Session 的挑战',
            '面试高频：Cookie 与 Session 的区别与配合关系'
          ],
          analogy: 'Session 像健身房手环系统：前台（服务端）登记你的信息，你只带一枚手环（SessionID）；手环丢了（Cookie 失效）就认不出你，只能重新办卡（重新登录）。'
        },
        {
          id: 'm6-jwt',
          title: 'JWT 与 OAuth 2.0',
          path: 'pages/m6/m6-jwt.html',
          deps: ['m6-session'],
          minutes: 25,
          outline: [
            'JWT 结构拆解：Header、Payload、Signature 三段式',
            '签名防篡改原理：「信息可见，但改不动」的特性',
            'JWT vs Session：无状态带来的扩展性优势与注销难题',
            'OAuth 2.0 授权码模式：第三方登录的完整时序',
            '面试高频：JWT 如何实现注销与续期？认证与授权的区别'
          ],
          analogy: 'JWT 像防伪工牌：信息印在卡上（Payload 谁都能看），但有公司钢印（签名）仿造不了；OAuth 像用酒店房卡刷健身房——你不把房卡交出去，酒店只是确认「这个人可以进」。'
        },
        {
          id: 'm6-deploy',
          title: '部署基础：Nginx 与 Docker',
          path: 'pages/m6/m6-deploy.html',
          deps: [],
          minutes: 25,
          outline: [
            '部署全景：从本地能运行到公网可访问之间的环节',
            'Nginx 三大职责：静态资源服务、反向代理、负载均衡',
            'SPA 部署实战：history 路由刷新 404 的 try_files 兜底',
            'Docker 核心概念：镜像、容器与「一次构建，处处运行」',
            '面试高频：正向代理与反向代理的区别、Docker 解决了什么问题'
          ],
          analogy: 'Nginx 像写字楼前台：访客（请求）先到前台，被指引去对应公司（反向代理），人多时分流到多个窗口（负载均衡）；Docker 像整装集装箱——办公室连家具一起打包，搬到哪都能立刻开业。'
        }
      ]
    },

    /* ==========================================================
     * M7 综合实战与面试 —— 把知识串成能力，从容走完全流程
     * ========================================================== */
    {
      id: 'm7',
      name: '综合实战与面试',
      color: '#64748B',
      summary: '把知识串成能力：学会拆项目、讲设计、写代码、聊沟通，从容应对面试全流程。',
      points: [
        {
          id: 'm7-project',
          title: '项目拆解与亮点提炼',
          path: 'pages/m7/m7-project.html',
          deps: [],
          minutes: 25,
          outline: [
            '项目描述公式：背景 + 难点 + 方案 + 可量化结果',
            '从「做了什么」到「解决了什么」：业务问题的技术化表达',
            '亮点挖掘清单：性能提升、工程提效、稳定性建设、体验优化',
            '数据意识：用秒开率、错误率、耗时等指标证明价值',
            '面试高频：介绍一个你最有成就感的项目'
          ],
          analogy: '讲项目像卖房子：不能只说「三室一厅」（功能罗列），要讲「学区房、采光好、地铁口」（亮点）——买家（面试官）买的是价值，不是面积。'
        },
        {
          id: 'm7-design',
          title: '前端侧系统设计',
          path: 'pages/m7/m7-design.html',
          deps: ['m7-project', 'm6-rest'],
          minutes: 30,
          outline: [
            '答题框架：澄清需求 → 拆解模块 → 技术选型 → 细节与权衡',
            '经典题型演练：无限滚动列表、大文件分片上传、短链接服务',
            '关键维度拆解：性能、容错、扩展性、用户体验',
            '主动暴露权衡：说清「为什么不用另一种方案」比方案本身更加分',
            '面试高频：设计一个组件库/前端监控平台要考虑什么'
          ],
          analogy: '系统设计像装修量房沟通：先问家庭人口与生活习惯（澄清需求），再出平面图（模块拆解），每处选材都给出理由（权衡取舍），而不是上来就报全屋套餐价。'
        },
        {
          id: 'm7-handwrite-basic',
          title: '手写题·JS 基础篇（防抖节流、深拷贝、柯里化）',
          path: 'pages/m7/m7-handwrite-basic.html',
          deps: ['m1-js-scope', 'm4-runtime'],
          minutes: 30,
          outline: [
            '防抖与节流：闭包保存定时器，支持立即执行与取消功能',
            '深拷贝：递归处理引用类型、循环引用（WeakMap）与特殊对象',
            '柯里化：参数收集与递归触发，结合 fn.length 判断是否执行',
            '手写题通用套路：先确认需求边界，再写主干逻辑，最后补防御',
            '面试高频：深拷贝如何处理 Date / RegExp / Map / Set'
          ],
          analogy: '手写题像驾照路考：不看你背交规多熟，看你上路（现场编码）是否先打灯（确认边界）、再平稳起步（主干逻辑）、最后规范靠边（处理异常）。'
        },
        {
          id: 'm7-handwrite-async',
          title: '手写题·异步篇（Promise、并发控制、EventEmitter）',
          path: 'pages/m7/m7-handwrite-async.html',
          deps: ['m1-js-promise'],
          minutes: 30,
          outline: [
            '简化版 Promise：三态流转、then 链式调用与微任务回调',
            '并发控制：limit 个并行槽位，完成一个就补位一个的调度思想',
            '手写 Promise.all / race：计数器统计与提前退出逻辑',
            'EventEmitter：on / off / emit / once 的发布订阅实现',
            '面试高频：并发控制的两种实现（递归 vs 循环）如何取舍'
          ],
          analogy: '并发控制像景区限流：闸机只放 limit 人进园，有人出园（请求完成）就立刻放下一人排队进入，园内（并发数）永远不超员。'
        },
        {
          id: 'm7-handwrite-dom',
          title: '手写题·浏览器篇（事件委托、发布订阅、序列化）',
          path: 'pages/m7/m7-handwrite-dom.html',
          deps: ['m1-js-prototype'],
          minutes: 30,
          outline: [
            '事件委托：利用事件冒泡在父节点统一监听，用 e.target 定位来源',
            '对象序列化进阶：处理循环引用、undefined 与函数的取舍策略',
            '发布订阅与观察者模式：on / emit / off / once 的通用实现',
            '相关考点延伸：手写 Ajax、复刻 getElementsByClassName 等浏览器 API',
            '面试高频：事件委托的优点与局限、发布订阅与观察者模式的区别'
          ],
          analogy: '事件委托像小区快递柜统一收件：快递员（事件）不必挨家挨户送，全部放进柜子（父节点），各家凭取件码（e.target）自行认领，省时省力。'
        },
        {
          id: 'm7-soft',
          title: '面试沟通与反问技巧',
          path: 'pages/m7/m7-soft.html',
          deps: ['m7-project'],
          minutes: 20,
          outline: [
            '结构化表达：回答问题先给结论、再展开论据、最后举例佐证',
            '不会答怎么办：诚实承认 + 展示思考路径的正确姿势',
            '高质量反问清单：业务方向、团队分工、成长机制',
            '流程管理：面试复盘、多家公司节奏的统筹安排',
            '面试高频：「你有什么想问我们的？」以及千万别说的反问'
          ],
          analogy: '面试沟通像相亲聊天：光有内才不够，还要会表达（结构化）、会倾听（理解问题意图）、会提问（反问见诚意）——尬聊的人最容易出局。'
        }
      ]
    }
  ]
};
