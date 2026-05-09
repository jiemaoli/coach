import type { ChartCase, ExamQuestion, GlossaryEntry, LessonUnit } from "./types";

export const fboChartCases: ChartCase[] = [
  {
    id: "case-fbo-short",
    title: "上破失败后做空：标准 fBO short",
    kind: "valid",
    difficulty: 2,
    setup: "fBO short",
    context: "交易区间顶部上破后没有 follow-through，迅速回到区间内并给出强阴确认。",
    learnerTask: "判断为什么这是 failed breakout，而不是成功突破后的回调。",
    verdict: "可训练。上破失败后回到区间内，形成标准 fBO short。",
    detailedRead: [
      "先有清楚边界和 breakout 尝试。",
      "突破 bar 没有得到后续承诺，价格很快收回区间。",
      "回到区间内后的强阴信号 K，说明 breakout side 被困。",
      "fBO 的逻辑是 trapped traders，不是一般 pullback。"
    ],
    bars: [
      { open: 106, high: 112, low: 103, close: 109, label: "TR" },
      { open: 109, high: 114, low: 105, close: 110, label: "TR" },
      { open: 110, high: 115, low: 106, close: 111, label: "TR top" },
      { open: 111, high: 119, low: 110, close: 118, label: "BO" },
      { open: 118, high: 120, low: 112, close: 113, label: "fail" },
      { open: 113, high: 114, low: 105, close: 106, label: "fBO", signal: true },
      { open: 106, high: 107, low: 98, close: 100, label: "go" },
      { open: 100, high: 102, low: 94, close: 96, label: "target" },
      { open: 96, high: 99, low: 92, close: 94, label: "down" },
      { open: 94, high: 97, low: 90, close: 92, label: "down" }
    ],
    ema: [107, 108, 109, 111, 111, 110, 107, 103, 99, 96],
    annotations: [
      { barIndex: 3, price: 118, label: "1", text: "这是 breakout 候选，但还不是成功突破。", tone: "info" },
      { barIndex: 4, price: 113, label: "2", text: "价格迅速收回区间，说明上破被否定。", tone: "good" },
      { barIndex: 5, price: 106, label: "3", text: "强阴确认 trapped longs，形成 fBO short。", tone: "good" }
    ]
  },
  {
    id: "case-fbo-long",
    title: "下破失败后做多：标准 fBO long",
    kind: "valid",
    difficulty: 2,
    setup: "fBO long",
    context: "区间下边界被刺破后没有延续，价格迅速回区间并给出强阳确认。",
    learnerTask: "说明为什么这里不是 DP，而是 failed breakout long。",
    verdict: "可训练。下破失败回区间后形成 fBO long。",
    detailedRead: [
      "fBO long 的核心是下破先发生，再被否定。",
      "如果只是双底测试，没有明显 breakout 刺破，结构更偏 DP。",
      "这里先有下破、再回收、再确认，多头交易的是 trapped shorts。",
      "执行仍是信号 K 外侧触发。"
    ],
    bars: [
      { open: 118, high: 122, low: 113, close: 116, label: "TR" },
      { open: 116, high: 121, low: 112, close: 115, label: "TR" },
      { open: 115, high: 119, low: 110, close: 112, label: "TR bot" },
      { open: 112, high: 113, low: 104, close: 105, label: "BO" },
      { open: 105, high: 111, low: 103, close: 110, label: "back" },
      { open: 110, high: 119, low: 109, close: 118, label: "fBO", signal: true },
      { open: 118, high: 126, low: 117, close: 124, label: "go" },
      { open: 124, high: 131, low: 122, close: 129, label: "target" },
      { open: 129, high: 134, low: 126, close: 132, label: "up" },
      { open: 132, high: 137, low: 129, close: 135, label: "up" }
    ],
    ema: [119, 118, 116, 113, 112, 113, 116, 120, 124, 128],
    annotations: [
      { barIndex: 3, price: 105, label: "1", text: "先有真实下破，shorts 被吸引进场。", tone: "info" },
      { barIndex: 4, price: 110, label: "2", text: "下一根迅速回区间，说明 breakout 失败。", tone: "good" },
      { barIndex: 5, price: 118, label: "3", text: "强阳确认 trapped shorts，形成 fBO long。", tone: "good" }
    ]
  },
  {
    id: "case-fbo-unconfirmed",
    title: "只有回踩、没有失败确认：尚不能叫 fBO",
    kind: "wait",
    difficulty: 2,
    setup: "Unconfirmed fBO",
    context: "价格短暂上破后回落到边界附近，但并未明确收回区间，也没有强反向确认。",
    learnerTask: "解释为什么这里还只能 wait。",
    verdict: "等待。只有回踩或犹豫，不等于 breakout 已失败。",
    detailedRead: [
      "fBO 不是看到 breakout 回踩就自动反向。",
      "必须看到 breakout side 被明确否定，例如重新收回区间、反向强收盘和 follow-through。",
      "如果价格还在边界附近犹豫，新手最容易过早猜失败。",
      "正确动作是继续等待成功突破或失败确认二选一。"
    ],
    bars: [
      { open: 106, high: 112, low: 103, close: 109, label: "TR" },
      { open: 109, high: 114, low: 105, close: 110, label: "TR" },
      { open: 110, high: 115, low: 106, close: 111, label: "TR top" },
      { open: 111, high: 119, low: 110, close: 118, label: "BO" },
      { open: 118, high: 119, low: 113, close: 114, label: "test" },
      { open: 114, high: 116, low: 112, close: 115, label: "hold" , signal: true },
      { open: 115, high: 120, low: 114, close: 119, label: "?" },
      { open: 119, high: 123, low: 117, close: 121, label: "up" },
      { open: 121, high: 125, low: 119, close: 124, label: "up" },
      { open: 124, high: 128, low: 122, close: 127, label: "trend" }
    ],
    ema: [107, 108, 109, 111, 112, 113, 115, 117, 120, 123],
    annotations: [
      { barIndex: 3, price: 118, label: "1", text: "有 breakout 尝试，但尚未被否定。", tone: "info" },
      { barIndex: 5, price: 115, label: "2", text: "这里只是犹豫，不是明确 failed breakout。", tone: "warn" },
      { barIndex: 6, price: 119, label: "3", text: "后续重新走高，过早做空会变成主观猜顶。", tone: "bad" }
    ]
  },
  {
    id: "case-fbo-chop-trap",
    title: "TTR 中连续乱突破：不要把每次刺破都叫 fBO",
    kind: "skip",
    difficulty: 3,
    setup: "Chop false breakouts",
    context: "极窄区间中上下两侧连续刺破，几乎每根都像 breakout failure。",
    learnerTask: "解释为什么这里不是高质量 fBO，而是应整体跳过。",
    verdict: "跳过。TTR 中的频繁刺破只是噪音，不是可训练的 fBO。",
    detailedRead: [
      "fBO 最有价值的环境是市场真有 breakout 意图，但失败后反向。",
      "TTR 中上下两侧都不断刺破，说明根本没有一边拥有优势。",
      "把每个刺破都做成 fBO，只会把噪音训练成习惯。",
      "正确动作是等待真正离开 TTR 的 breakout 或全天不做。"
    ],
    bars: [
      { open: 108, high: 111, low: 105, close: 109, label: "TTR" },
      { open: 109, high: 112, low: 106, close: 108, label: "TTR" },
      { open: 108, high: 113, low: 107, close: 110, label: "up fake" },
      { open: 110, high: 111, low: 105, close: 107, label: "down fake" },
      { open: 107, high: 112, low: 106, close: 109, label: "up fake" },
      { open: 109, high: 110, low: 104, close: 106, label: "down fake" },
      { open: 106, high: 111, low: 105, close: 108, label: "fake" , signal: true },
      { open: 108, high: 112, low: 106, close: 109, label: "fake" },
      { open: 109, high: 113, low: 107, close: 110, label: "fake" },
      { open: 110, high: 114, low: 108, close: 111, label: "noise" }
    ],
    ema: [108, 108, 108, 108, 108, 108, 108, 109, 109, 110],
    annotations: [
      { barIndex: 2, price: 110, label: "1", text: "上下两侧频繁刺破，不是真 breakout campaign。", tone: "bad" },
      { barIndex: 6, price: 108, label: "2", text: "每根都像 fBO 候选，恰恰说明不该做。", tone: "bad" },
      { barIndex: 9, price: 111, label: "3", text: "TTR 环境整体跳过，比逐根解释更重要。", tone: "warn" }
    ]
  }
];

export const fboLessons: LessonUnit[] = [
  {
    id: "fbo-core",
    module: "fbo",
    title: "fBO 定义：突破先发生，再被市场否定",
    subtitle: "不是反转长得像，而是 breakout 确实失败",
    masteryGoal: "能识别 failed breakout 的先后顺序：breakout、回收、确认。",
    whyItMatters: "很多人把任何边界反转都叫 fBO，结果混淆了 DP、普通反弹和噪音。",
    explanation: [
      "fBO 的逻辑是 breakout traders 被困。先要有突破尝试，再有回收否定，最后才有反向确认。",
      "如果根本没有清楚 breakout，就更可能是 DP 或普通边界反弹。",
      "fBO 最有价值的地方，是市场先吸引一边进场，然后立刻打脸。"
    ],
    decisionChecklist: [
      "是否先有真实 breakout 尝试？",
      "价格是否重新回到关键边界/区间内？",
      "是否出现反向确认信号？",
      "这里是不是 trapped traders 的语境？"
    ],
    commonTraps: [
      "没有 breakout 先行也硬叫 fBO。",
      "只看边界反转，不看是谁被困。",
      "把 DP 与 fBO 混成同一件事。"
    ],
    sourceNote: "fBO 的关键词是 failed breakout，不是 generic reversal。",
    caseIds: ["case-fbo-short", "case-fbo-long"],
    examIds: ["exam-fbo-1", "exam-fbo-2"]
  },
  {
    id: "fbo-confirmation",
    module: "fbo",
    title: "突破 vs 失败：回踩不是失败，确认才是失败",
    subtitle: "最容易犯的错是过早猜失败",
    masteryGoal: "能区分正常 breakout pullback 与真正 failed breakout。",
    whyItMatters: "过早猜 fBO 会直接做在成功突破的起点。",
    explanation: [
      "成功 breakout 后回踩边界是正常现象，不等于 breakout 已失败。",
      "fBO 需要更强的否定证据：收回区间、反向强收盘、follow-through。",
      "如果价格只是犹豫，新手默认不预判，等待市场自己给答案。"
    ],
    decisionChecklist: [
      "价格是否明确收回原区间/边界内？",
      "是否出现强反向信号和 follow-through？",
      "当前更像 BP 还是 fBO？",
      "如果只是回踩，是否能保持 wait？"
    ],
    commonTraps: [
      "一回踩就抢反向。",
      "把 breakout pullback 错当 failed breakout。",
      "没有 follow-through 也强做。"
    ],
    sourceNote: "failed breakout 需要明确 failure confirmation，不是普通 retest。",
    caseIds: ["case-fbo-unconfirmed", "case-fbo-short"],
    examIds: ["exam-fbo-3", "exam-fbo-4", "exam-fbo-5"]
  },
  {
    id: "fbo-entry",
    module: "fbo",
    title: "fBO 入场与目标：交易被困的一边",
    subtitle: "反向确认后才定义 trigger、stop 与 room for profit",
    masteryGoal: "能写出 fBO long/short 的触发、止损和最小目标逻辑。",
    whyItMatters: "fBO 因为带有“失败”故事，最容易让人忽略具体执行。",
    explanation: [
      "fBO 依旧使用信号 K 外侧触发，而不是凭故事直接市价反向。",
      "止损通常放在确认信号 K 的另一端；若 stop 太大或空间不足，故事再好也跳过。",
      "目标可先看回到区间另一侧、区间中轴或最近 swing extreme。"
    ],
    decisionChecklist: [
      "确认信号 K 是否能外侧触发？",
      "stop 是否清楚且不大于目标？",
      "回到区间后的 room for profit 是否足够？",
      "是否把 execution 写成规则而非 narrative？"
    ],
    commonTraps: [
      "因为“trapped traders”就市价冲进去。",
      "stop 放在随意位置。",
      "忽略区间中轴或对侧边界的阻力支撑。"
    ],
    sourceNote: "fBO 的故事要落回 trigger/stop/target 才能成为可复盘交易。",
    caseIds: ["case-fbo-short", "case-fbo-long"],
    examIds: ["exam-fbo-6", "exam-fbo-7"]
  },
  {
    id: "fbo-filters",
    module: "fbo",
    title: "fBO 过滤与失败：TTR 乱刺破、未确认失败、再次转回突破",
    subtitle: "不是每个假突破都值得交易",
    masteryGoal: "能识别低质量 fBO 环境并知道何时完全跳过。",
    whyItMatters: "fBO 很容易在 chop 中过度交易，过滤项比 setup 名称更重要。",
    explanation: [
      "TTR 中上下两侧乱刺破，不是真 breakout attempt，而是噪音。",
      "没有收回区间和强确认时，不能把 retest 强行解释成失败。",
      "有些 breakout 先假失败，后面又重新回到原突破方向，这时过早反向会很危险。"
    ],
    decisionChecklist: [
      "这里是真 breakout attempt 还是 TTR 噪音？",
      "是否已有明确 failure confirmation？",
      "如果失败后没有 follow-through，是否还要 wait？",
      "自己是不是把每个刺破都过度解读？"
    ],
    commonTraps: [
      "在 TTR 中连续做 fBO。",
      "未确认先抢失败。",
      "把市场犹豫误判成 trapped traders。"
    ],
    sourceNote: "fBO 只在 breakout 确实失败时有训练价值；chop 与未确认一律降级。",
    caseIds: ["case-fbo-unconfirmed", "case-fbo-chop-trap"],
    examIds: ["exam-fbo-8", "exam-fbo-9"]
  }
];

export const fboExams: ExamQuestion[] = [
  {
    id: "exam-fbo-1",
    mode: "concept",
    lessonId: "fbo-core",
    prompt: "fBO 的定义关键是什么？",
    options: ["先有 breakout，再有 failure confirmation", "价格在边界附近出现反向 K 就是 fBO", "任何双测边界失败后的反转都属于 fBO", "breakout 后第一根回踩就确认失败可以反向"],
    answer: "先有 breakout，再有 failure confirmation",
    explanation: "没有 breakout 先行，就更可能不是 fBO。",
    whyWrong: {
      "价格在边界附近出现反向 K 就是 fBO": "没有 breakout 先行，边界反向 K 可能是 DP 或普通反弹。",
      "任何双测边界失败后的反转都属于 fBO": "双测失败更接近 DP 语境，fBO 强调先有突破再失败。",
      "breakout 后第一根回踩就确认失败可以反向": "回踩不等于失败，可能只是 breakout pullback，需要更强否定证据。"
    }
  },
  {
    id: "exam-fbo-2",
    mode: "case",
    lessonId: "fbo-core",
    chartCaseId: "case-fbo-long",
    prompt: "为什么图中更适合叫 fBO long，而不是 DP long？",
    options: ["因为先有清楚下破，再回区间确认失败", "因为所有双底都是 fBO", "因为没有任何 breakout", "因为强阳线一定是 fBO"],
    answer: "因为先有清楚下破，再回区间确认失败",
    explanation: "fBO 更强调 breakout 被否定，而不是单纯双测。",
    whyWrong: {
      "因为所有双底都是 fBO": "双底很多时候属于 DP。",
      "因为没有任何 breakout": "这里恰恰先有下破。",
      "因为强阳线一定是 fBO": "强阳不能代替结构。"
    }
  },
  {
    id: "exam-fbo-3",
    mode: "case",
    lessonId: "fbo-confirmation",
    chartCaseId: "case-fbo-unconfirmed",
    prompt: "为什么这里还不能叫 fBO short？",
    options: ["因为只有回踩和犹豫，没有明确失败确认", "因为 breakout 一定成功", "因为所有上破都不能失败", "因为只能做多"],
    answer: "因为只有回踩和犹豫，没有明确失败确认",
    explanation: "回踩不是 failed breakout，同样可能只是 breakout pullback。",
    whyWrong: {
      "因为 breakout 一定成功": "breakout 当然也会失败。",
      "因为所有上破都不能失败": "fBO short 就是上破失败后的做空。",
      "因为只能做多": "fBO 可双向。"
    }
  },
  {
    id: "exam-fbo-4",
    mode: "concept",
    lessonId: "fbo-confirmation",
    prompt: "哪种现象最支持 breakout 已失败？",
    options: ["价格重新回到区间内并出现强反向收盘", "价格在区间外小幅回踩", "只有一根 Doji", "EMA 继续同向"],
    answer: "价格重新回到区间内并出现强反向收盘",
    explanation: "收回区间并给出反向确认，才更像 breakout 被否定。",
    whyWrong: {
      "价格在区间外小幅回踩": "这更像 breakout pullback。",
      "只有一根 Doji": "Doji 本身不足以确认失败。",
      "EMA 继续同向": "EMA 不是 failure confirmation 本身。"
    }
  },
  {
    id: "exam-fbo-5",
    mode: "execution",
    lessonId: "fbo-confirmation",
    prompt: "面对未确认的 breakout failure 候选，训练阶段最合理动作是什么？",
    options: ["wait，等成功突破或失败确认二选一", "直接市价反向", "先取消 stop 再猜", "因为靠近边界就必须做"],
    answer: "wait，等成功突破或失败确认二选一",
    explanation: "fBO 最怕过早预判；wait 是核心纪律。",
    whyWrong: {
      "直接市价反向": "没有确认会经常做在成功突破的起点。",
      "先取消 stop 再猜": "没有 stop 就不是计划交易。",
      "因为靠近边界就必须做": "边界只是背景，不是自动触发。"
    }
  },
  {
    id: "exam-fbo-6",
    mode: "execution",
    lessonId: "fbo-entry",
    chartCaseId: "case-fbo-short",
    prompt: "标准 fBO short 的触发与初始止损是什么？",
    options: ["确认信号 K 低点下方 Sell Stop，高点上方止损", "上破时直接市价做空", "确认信号 K 高点上方 Buy Stop", "等 target 到了再设 stop"],
    answer: "确认信号 K 低点下方 Sell Stop，高点上方止损",
    explanation: "fBO 的故事必须落成具体触发和失效点。",
    whyWrong: {
      "上破时直接市价做空": "那是在预判失败。",
      "确认信号 K 高点上方 Buy Stop": "方向相反。",
      "等 target 到了再设 stop": "入场前必须定义 stop。"
    }
  },
  {
    id: "exam-fbo-7",
    mode: "concept",
    lessonId: "fbo-entry",
    prompt: "fBO 的第一目标最常见参考应来自哪里？",
    options: ["回到区间内部的结构位，如中轴或另一侧边界", "固定永远 100 ticks", "完全不设目标", "只看自己想赚多少"],
    answer: "回到区间内部的结构位，如中轴或另一侧边界",
    explanation: "fBO 往往交易的是回归区间或反向 swing，目标应来自结构。",
    whyWrong: {
      "固定永远 100 ticks": "脱离结构。",
      "完全不设目标": "没有目标就无法评估 room for profit。",
      "只看自己想赚多少": "欲望不是目标。"
    }
  },
  {
    id: "exam-fbo-8",
    mode: "case",
    lessonId: "fbo-filters",
    chartCaseId: "case-fbo-chop-trap",
    prompt: "图中为什么应整体跳过，而不是逐根寻找 fBO？",
    options: ["因为 TTR 中上下两侧连续刺破只是噪音", "因为 fBO 永远不能交易", "因为没有任何边界", "因为只允许做 breakout 不允许做失败"],
    answer: "因为 TTR 中上下两侧连续刺破只是噪音",
    explanation: "在 chop 中每根都像 fBO，恰恰说明 setup 质量过低。",
    whyWrong: {
      "因为 fBO 永远不能交易": "标准 fBO 当然可训练。",
      "因为没有任何边界": "题目里恰恰有窄边界。",
      "因为只允许做 breakout 不允许做失败": "失败突破本身就是 setup。"
    }
  },
  {
    id: "exam-fbo-9",
    mode: "concept",
    lessonId: "fbo-filters",
    prompt: "fBO 与 BP 最关键的差别是什么？",
    options: ["BP 是成功突破后的回调，fBO 是突破被否定后的反向", "两者完全一样", "BP 只做空，fBO 只做多", "两者都不需要确认"],
    answer: "BP 是成功突破后的回调，fBO 是突破被否定后的反向",
    explanation: "两者都围绕边界展开，但一个交易 continuation，一个交易 failure。",
    whyWrong: {
      "两者完全一样": "结构逻辑相反。",
      "BP 只做空，fBO 只做多": "都可双向。",
      "两者都不需要确认": "两者都需要确认。"
    }
  },

  // Multi-condition scenario
  {
    id: "exam-fbo-scenario-1",
    mode: "execution",
    lessonId: "fbo-entry",
    prompt: "区间上破后迅速回收，出现强阴信号 K 形成 fBO short 候选。但信号 K 止损（高点 +1t）距离 14 ticks，而回到区间中轴只有 10 ticks。你应该？",
    options: ["跳过或等更好信号：止损大于目标不符合风险收益要求", "做空因为 fBO 故事清楚 trapped longs 一定跑", "缩小止损到信号 K 中部让数学合格", "把目标延伸到区间另一侧忽略中轴阻力"],
    answer: "跳过或等更好信号：止损大于目标不符合风险收益要求",
    explanation: "fBO 故事再好，也必须落回 trigger/stop/target 的数学。stop > target 就不做。",
    whyWrong: {
      "做空因为 fBO 故事清楚 trapped longs 一定跑": "故事好不等于数学好，风险收益不合格的交易仍需跳过。",
      "缩小止损到信号 K 中部让数学合格": "随机止损不再代表 setup 失效点，被正常波动扫掉的概率大增。",
      "把目标延伸到区间另一侧忽略中轴阻力": "中轴是真实结构位，价格可能在此受阻，目标应基于最近可达位。"
    }
  },

  // "不做" training
  {
    id: "exam-fbo-skip-1",
    mode: "execution",
    lessonId: "fbo-filters",
    prompt: "价格上破区间后回踩到边界附近出现一根小阴线，但没有明确收回区间内部，也没有强反向 follow-through。训练阶段应该？",
    options: ["等待：回踩不等于失败，需要更强否定证据才能叫 fBO", "做空因为价格回踩了就是 fBO", "在小阴线低点下方挂 Sell Stop 试试", "因为上破过所以一定会失败应该做空"],
    answer: "等待：回踩不等于失败，需要更强否定证据才能叫 fBO",
    explanation: "fBO 需要明确收回区间 + 强反向确认。只是回踩可能只是 breakout pullback。",
    whyWrong: {
      "做空因为价格回踩了就是 fBO": "回踩是正常 breakout 行为，不等于 breakout 已失败。",
      "在小阴线低点下方挂 Sell Stop 试试": "小阴线不是强确认信号，用弱信号做 fBO 的复盘价值很低。",
      "因为上破过所以一定会失败应该做空": "breakout 可能成功也可能失败，不能预判结果。"
    }
  },

  // Setup confusion: fBO vs BP
  {
    id: "exam-fbo-boundary-1",
    mode: "concept",
    lessonId: "fbo-confirmation",
    prompt: "价格突破区间上沿后回踩但不重新进入区间，然后在区间上沿附近出现阳线。这更接近 fBO short 还是 BP long？",
    options: ["更接近 BP long：突破后回踩但未收回区间，偏 breakout pullback", "更接近 fBO short 因为回踩了边界", "两者没有区别都是在边界附近做", "应该做空因为回踩边界一定是假突破"],
    answer: "更接近 BP long：突破后回踩但未收回区间，偏 breakout pullback",
    explanation: "fBO 要求价格明确收回区间并有强反向确认。未收回区间 + 顺突破方向信号更接近 BP。",
    whyWrong: {
      "更接近 fBO short 因为回踩了边界": "回踩不等于失败，价格未收回区间说明 breakout 可能仍有效。",
      "两者没有区别都是在边界附近做": "一个是顺突破方向延续，一个是反突破方向反转，逻辑相反。",
      "应该做空因为回踩边界一定是假突破": "回踩是正常 breakout pullback，不能预判一定失败。"
    }
  }
];

export const fboGlossary: GlossaryEntry[] = [
  {
    id: "fbo",
    term: "fBO",
    chinese: "失败突破",
    category: "setup",
    short: "先有 breakout 尝试，再被市场否定并给出反向确认的 setup。",
    detail: "fBO 交易的是 trapped breakout traders，因此必须先有真实 breakout，再有回收与确认。",
    example: "区间上破后下一根收回区间，再出现强阴确认，形成 fBO short。"
  },
  {
    id: "failed-breakout",
    term: "Failed Breakout",
    chinese: "突破失败",
    category: "structure",
    short: "价格短暂突破边界后，无法延续并迅速回到原结构内。",
    detail: "不是所有 retest 都是 failed breakout；关键在于是否有明确 failure confirmation。",
    example: "下破区间后马上收回区间，并由强阳信号 K 触发反向做多。"
  }
];
