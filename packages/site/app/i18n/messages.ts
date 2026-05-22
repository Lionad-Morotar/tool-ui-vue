export const siteZhCN = {
  site: {
    title: 'tool-ui-vue',
    description: '让 Agent 的每一次回复都赏心悦目。专为工具调用场景打造的 Vue 组件库。'
  },
  header: {
    docs: '文档',
    github: 'GitHub',
    toggleDark: '切换到深色模式',
    toggleLight: '切换到浅色模式'
  },
  hero: {
    h1: '使用交互式组件',
    h1SubMain: '增强 UX & AX',
    h1SubNote: '( Agent Experience )',
    description: '让 Agent 的每一次回复都赏心悦目。专为工具调用场景打造的 Vue 组件，提升用户体验只需5分钟。',
    ctaDocs: '查看文档',
    ctaGithub: 'GitHub'
  },
  demo: {
    tabRestaurant: '餐厅预订',
    tabTravel: '旅行规划',
    tabCode: '代码审查',
    tabContact: '联系卡片',
    tabArticle: '文章展示',
    addressBar: 'chat.example.com'
  },
  demoRestaurant: {
    userIntro: '今晚想找个有氛围的地方吃饭，最好是有点节日气息的。',
    agentIntro: '今天是平安夜呢，为您找到 3 家氛围感满满的圣诞主题餐厅，挑选一家喜欢的吧：',
    carouselTitle: '圣诞餐厅推荐',
    userSelect: '就选「{name}」吧，看起来氛围很不错。',
    agentPanel: '已为您锁定「{name}」，今晚 19:00 还有位置。请确认偏好，我帮您完成预订：',
    panelTitle: '预订偏好',
    sectionAmbience: '氛围与服务',
    labelMusic: '现场爵士乐演奏',
    labelWine: '配餐红酒',
    sectionPackage: '套餐',
    packageStandard: '标准套餐 ¥298/人',
    packagePremium: '尊享套餐 ¥498/人',
    actionConfirm: '确认预订',
    actionCancel: '取消',
    agentDone: '预订成功！已为您预留 2 人位，今晚 19:00 见，祝您圣诞快乐。',
    userDone: '好的，谢谢！'
  },
  demoTravel: {
    userIntro: '周末想去杭州走走，西湖和灵隐寺都要去，帮我安排一个轻松的两日游。',
    agentMap: '没问题，这条路线兼顾了湖光山色和禅意清幽，节奏也比较舒缓。先看一下路线：',
    mapTitle: '杭州两日游路线',
    markerWestLake: '西湖',
    markerWestLakeDesc: '断桥残雪、苏堤春晓',
    markerLingyin: '灵隐寺',
    markerLingyinDesc: '千年古刹，禅意清幽',
    routeDay1: 'Day 1 路线',
    userAskPlan: '路线看起来不错，具体行程怎么安排？希望能详细一点。',
    agentPlan: '好的，我为您整理了一份轻松惬意的两日游行程：',
    planTitle: '杭州周末行程',
    planDesc: '轻松惬意的两日游',
    todo1: '周六上午 · 西湖游船',
    todo1Desc: '手划船体验，约 1.5 小时',
    todo2: '周六下午 · 断桥漫步',
    todo2Desc: '欣赏湖光山色，拍照打卡',
    todo3: '周日上午 · 灵隐寺祈福',
    todo3Desc: '参观飞来峰造像',
    todo4: '周日下午 · 龙井问茶',
    todo4Desc: '茶园品茶，采购伴手礼',
    actionAddTodo: '帮我加入待办',
    userAddTodo: '帮我加入待办吧，这样就不会忘记了。',
    agentDone: '已为您添加到待办清单，并设置了周六早上 8:00 的出发提醒。祝您旅途愉快！'
  },
  demoCode: {
    userIntro: '帮我 review 一下这个 PR 里的日期格式化代码，总觉得时区处理有问题。',
    agentReview: '我检查了 {file} 的改动，发现一处潜在问题：{fn} 在未指定时区的情况下会跟随用户本地环境，对于需要固定展示北京时间的业务场景可能导致不一致。建议如下修改：',
    actionApply: '应用修改',
    userApplied: '已经按照建议修改并提交了，再看看还有没有其他问题？',
    agentConfirm: '修改后的代码看起来很好，时区问题已经解决。整体改动简洁，没有引入额外风险。PR 可以合并了。',
    actionMerge: '合并 PR',
    userMerged: '已合并，谢谢 review！',
    agentDone: '不客气，有问题随时找我。'
  }
} as const

export const siteEn = {
  site: {
    title: 'tool-ui-vue',
    description: 'Make every Agent response delightful. Vue components purpose-built for tool-call scenarios.'
  },
  header: {
    docs: 'Docs',
    github: 'GitHub',
    toggleDark: 'Switch to dark mode',
    toggleLight: 'Switch to light mode'
  },
  hero: {
    h1: 'Interactive components',
    h1SubMain: 'for UX & AX',
    h1SubNote: '( Agent Experience )',
    description: 'Make every Agent response delightful. Vue components purpose-built for tool-call scenarios. Upgrade your UX in 5 minutes.',
    ctaDocs: 'View Docs',
    ctaGithub: 'GitHub'
  },
  demo: {
    tabRestaurant: 'Restaurant',
    tabTravel: 'Travel',
    tabCode: 'Code Review',
    tabContact: 'Contact Card',
    tabArticle: 'Article',
    addressBar: 'chat.example.com'
  },
  demoRestaurant: {
    userIntro: 'I want a nice place for dinner tonight, preferably with a festive vibe.',
    agentIntro: 'It\'s Christmas Eve! Here are 3 cozy Christmas-themed restaurants. Pick your favorite:',
    carouselTitle: 'Christmas Restaurants',
    userSelect: 'Let\'s go with "{name}". The atmosphere looks great.',
    agentPanel: 'Locked in "{name}" for you. There\'s still availability at 19:00 tonight. Please confirm your preferences to complete the booking:',
    panelTitle: 'Booking Preferences',
    sectionAmbience: 'Ambience & Service',
    labelMusic: 'Live jazz performance',
    labelWine: 'Wine pairing',
    sectionPackage: 'Set Menu',
    packageStandard: 'Standard ¥298/person',
    packagePremium: 'Premium ¥498/person',
    actionConfirm: 'Confirm Booking',
    actionCancel: 'Cancel',
    agentDone: 'Booking confirmed! A table for 2 is reserved at 19:00 tonight. Merry Christmas!',
    userDone: 'Great, thanks!'
  },
  demoTravel: {
    userIntro: 'I want to visit Hangzhou this weekend, covering West Lake and Lingyin Temple. Help me plan a relaxed two-day trip.',
    agentMap: 'No problem. This route balances lakeside scenery and Zen serenity. Here\'s the route:',
    mapTitle: 'Hangzhou 2-Day Trip',
    markerWestLake: 'West Lake',
    markerWestLakeDesc: 'Broken Bridge, Su Causeway',
    markerLingyin: 'Lingyin Temple',
    markerLingyinDesc: 'Ancient temple, peaceful Zen',
    routeDay1: 'Day 1 Route',
    userAskPlan: 'The route looks good. Can you give me a detailed itinerary?',
    agentPlan: 'Sure, here\'s a relaxed two-day itinerary for you:',
    planTitle: 'Hangzhou Weekend',
    planDesc: 'A relaxed two-day trip',
    todo1: 'Sat AM · West Lake Boat Tour',
    todo1Desc: 'Hand-rowed boat, ~1.5 hours',
    todo2: 'Sat PM · Broken Bridge Stroll',
    todo2Desc: 'Enjoy the lake view, take photos',
    todo3: 'Sun AM · Lingyin Temple Blessing',
    todo3Desc: 'Visit the Feilai Feng grottoes',
    todo4: 'Sun PM · Longjing Tea Tasting',
    todo4Desc: 'Tea garden tasting, buy souvenirs',
    actionAddTodo: 'Add to Todos',
    userAddTodo: 'Please add this to my todo list so I won\'t forget.',
    agentDone: 'Added to your todo list with a departure reminder at 8:00 AM Saturday. Have a great trip!'
  },
  demoCode: {
    userIntro: 'Please review the date formatting code in this PR. I suspect there\'s a timezone issue.',
    agentReview: 'I checked {file} and found a potential issue: {fn} follows the user\'s local environment when no timezone is specified, which may cause inconsistency for business scenarios that need fixed Beijing time. Suggested fix:',
    actionApply: 'Apply Fix',
    userApplied: 'I\'ve applied the fix and committed. Anything else?',
    agentConfirm: 'The updated code looks good. The timezone issue is resolved, and the change is clean with no extra risk. PR is ready to merge.',
    actionMerge: 'Merge PR',
    userMerged: 'Merged. Thanks for the review!',
    agentDone: 'You\'re welcome. Reach out anytime.'
  }
} as const

export type SiteMessages = typeof siteZhCN
