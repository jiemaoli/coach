import type { ChartCase, ExamQuestion, GlossaryEntry, LessonUnit } from "./types";

export const w1pChartCases: ChartCase[] = [
  {
    id: "case-w1p-long",
    title: "标准 W1P 做多：趋势首个楔形回调后反转",
    kind: "valid",
    difficulty: 2,
    setup: "W1P long",
    context: "上升趋势推进后，价格以三推下跌方式回到 EMA 附近，第三推力度减弱。",
    learnerTask: "判断最后一根强阳是否可作为 W1P 做多信号，并说明为什么这不是普通 A2。",
    verdict: "可训练。三推回调后的 first pullback 反转，属于标准 W1P 做多。",
    detailedRead: [
      "先看背景：前面是清楚上升趋势，不是在交易区间中部乱走。",
      "再看回调结构：下跌不是两腿，而是三次向下推进，第三推接近 EMA 时力度最弱。",
      "第三推后出现强阳信号 K，说明楔形回调结束，趋势方重新接管。",
      "执行上仍是信号 K 高点上方 1 tick 触发，止损放在信号 K 低点下方。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "up" },
      { open: 109, high: 121, low: 108, close: 119, label: "up" },
      { open: 119, high: 130, low: 117, close: 128, label: "HH" },
      { open: 128, high: 136, low: 126, close: 134, label: "HH" },
      { open: 134, high: 135, low: 126, close: 128, label: "W1" },
      { open: 128, high: 131, low: 123, close: 125, label: "pb" },
      { open: 125, high: 129, low: 124, close: 128, label: "pause" },
      { open: 128, high: 129, low: 120, close: 122, label: "W2" },
      { open: 122, high: 126, low: 121, close: 125, label: "pause" },
      { open: 125, high: 126, low: 117, close: 119, label: "W3" },
      { open: 119, high: 129, low: 118, close: 127, label: "W1P", signal: true },
      { open: 127, high: 136, low: 126, close: 134, label: "go" }
    ],
    ema: [97, 101, 106, 111, 115, 118, 120, 121, 121, 121, 122, 125],
    annotations: [
      { barIndex: 7, price: 122, label: "1", text: "第二推后未能持续，说明回调在减速。", tone: "info" },
      { barIndex: 9, price: 119, label: "2", text: "第三推到 EMA 附近但 follow-through 弱，楔形条件更完整。", tone: "good" },
      { barIndex: 10, price: 127, label: "3", text: "强阳信号 K 给出 first pullback reversal 触发。", tone: "good" }
    ]
  },
  {
    id: "case-w1p-short",
    title: "标准 W1P 做空：下降趋势首个楔形反弹失败",
    kind: "valid",
    difficulty: 2,
    setup: "W1P short",
    context: "下降趋势中，价格以三推上行反弹到 EMA，第三推上攻无力。",
    learnerTask: "判断空头信号 K 是否合格，并指出为什么这里是 W1P 而不是 DP。",
    verdict: "可训练。三推反弹后的 first pullback reversal，适合 W1P 做空训练。",
    detailedRead: [
      "背景先要是下降趋势，不能在区间底部勉强做空。",
      "反弹分三推上行，每次推高都缩短，第三推接近 EMA 时没有清楚突破优势。",
      "强阴信号 K 表示第三次向上尝试失败。",
      "执行镜像多头：低点下方 1 tick Sell Stop，高点上方 1 tick initial stop。"
    ],
    bars: [
      { open: 140, high: 142, low: 129, close: 131, label: "down" },
      { open: 131, high: 133, low: 121, close: 123, label: "down" },
      { open: 123, high: 125, low: 113, close: 115, label: "LL" },
      { open: 115, high: 122, low: 114, close: 121, label: "W1" },
      { open: 121, high: 126, low: 120, close: 124, label: "push" },
      { open: 124, high: 125, low: 118, close: 119, label: "pause" },
      { open: 119, high: 127, low: 118, close: 126, label: "W2" },
      { open: 126, high: 127, low: 120, close: 121, label: "pause" },
      { open: 121, high: 129, low: 120, close: 128, label: "W3" },
      { open: 128, high: 129, low: 119, close: 120, label: "W1P", signal: true },
      { open: 120, high: 121, low: 111, close: 113, label: "go" },
      { open: 113, high: 115, low: 105, close: 107, label: "target" }
    ],
    ema: [145, 140, 135, 131, 128, 126, 125, 124, 124, 123, 120, 116],
    annotations: [
      { barIndex: 6, price: 126, label: "1", text: "第二推虽创新高，但没有真正改变下降背景。", tone: "info" },
      { barIndex: 8, price: 128, label: "2", text: "第三推贴近 EMA 且力度减弱，是 W1P 关键位置。", tone: "good" },
      { barIndex: 9, price: 120, label: "3", text: "强阴信号 K 定义 sell stop 与失效点。", tone: "good" }
    ]
  },
  {
    id: "case-w1p-false-reversal",
    title: "假反转误判：只有一根强 K，不足以构成 W1P",
    kind: "skip",
    difficulty: 2,
    setup: "False W1P",
    context: "趋势中出现一次急跌后立刻强反弹，但此前没有完整三推楔形。",
    learnerTask: "解释为什么强反转 K 不能自动命名为 W1P。",
    verdict: "跳过。这里只有单次深回调后的反弹，没有清楚的 wedge pullback。",
    detailedRead: [
      "W1P 的关键不是反转 K 漂亮，而是先有三推回调。",
      "本图前面只有一次深跌和一次反弹，没有 W1/W2/W3 节奏。",
      "强阳线可以是别的反转线索，但不属于可复盘的 W1P 训练样本。",
      "新手要先保证 setup 分类准确，再考虑结果是否上涨。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "up" },
      { open: 109, high: 121, low: 108, close: 119, label: "up" },
      { open: 119, high: 130, low: 117, close: 128, label: "HH" },
      { open: 128, high: 129, low: 117, close: 119, label: "drop" },
      { open: 119, high: 121, low: 112, close: 114, label: "deep" },
      { open: 114, high: 125, low: 113, close: 123, label: "reversal", signal: true },
      { open: 123, high: 131, low: 121, close: 129, label: "go" },
      { open: 129, high: 133, low: 126, close: 131, label: "up" },
      { open: 131, high: 137, low: 129, close: 135, label: "up" },
      { open: 135, high: 139, low: 132, close: 136, label: "done" }
    ],
    ema: [97, 101, 106, 110, 112, 114, 117, 120, 123, 126],
    annotations: [
      { barIndex: 4, price: 114, label: "1", text: "只有一次主要下跌，没有三推 wedge 节奏。", tone: "bad" },
      { barIndex: 5, price: 123, label: "2", text: "强阳线不能替代 setup 结构。", tone: "warn" },
      { barIndex: 6, price: 129, label: "3", text: "结果上涨也不能倒推它是 W1P。", tone: "info" }
    ]
  },
  {
    id: "case-w1p-second-pullback",
    title: "第一回调还是第二回调？第二次楔形不再是 W1P",
    kind: "wait",
    difficulty: 3,
    setup: "W1P timing filter",
    context: "趋势中已经出现过一次清楚 pullback reversal，随后再次形成三推回调。",
    learnerTask: "判断第二次三推回调为什么不能继续叫 W1P。",
    verdict: "等待或按其他 setup 评估。W1P 强调 first pullback reversal，不是所有 wedge 都叫 W1P。",
    detailedRead: [
      "W1P 的 W 是 wedge，P 是 pullback，但它同时强调 first pullback reversal。",
      "本图左侧第一次回调已经完成一次 reversal 交易，后面再来的三推回调不属于 first。",
      "第二次回调也许仍能交易，但要按趋势环境和其他规则重新评估，不能继续用 W1P 概念偷懒。",
      "训练阶段最好把这类样本标注为 timing filter。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "up" },
      { open: 109, high: 121, low: 108, close: 119, label: "up" },
      { open: 119, high: 130, low: 118, close: 128, label: "HH" },
      { open: 128, high: 129, low: 122, close: 123, label: "W1" },
      { open: 123, high: 127, low: 122, close: 126, label: "W2" },
      { open: 126, high: 127, low: 120, close: 121, label: "W3" },
      { open: 121, high: 131, low: 120, close: 129, label: "1st", signal: true },
      { open: 129, high: 138, low: 128, close: 136, label: "trend" },
      { open: 136, high: 137, low: 130, close: 131, label: "W1" },
      { open: 131, high: 134, low: 129, close: 133, label: "W2" },
      { open: 133, high: 134, low: 127, close: 128, label: "W3" },
      { open: 128, high: 137, low: 127, close: 135, label: "2nd?", signal: true }
    ],
    ema: [97, 101, 106, 110, 112, 113, 115, 119, 122, 124, 125, 126],
    annotations: [
      { barIndex: 6, price: 129, label: "1", text: "左侧已完成 first pullback reversal。", tone: "good" },
      { barIndex: 10, price: 128, label: "2", text: "右侧虽然也像 wedge，但已经不是 first pullback。", tone: "warn" },
      { barIndex: 11, price: 135, label: "3", text: "可研究其他 with-trend entry，但不再命名为 W1P。", tone: "info" }
    ]
  }
];

export const w1pLessons: LessonUnit[] = [
  {
    id: "w1p-core",
    module: "w1p",
    title: "W1P 定义：楔形回调后的 first pullback reversal",
    subtitle: "先认清三推回调，再谈反转信号",
    masteryGoal: "能区分 W1P 与普通 A2，知道 W1/W2/W3 与 first pullback reversal 的含义。",
    whyItMatters: "很多人把任何强反转 K 都叫 W1P，结果把 setup 训练成情绪反应。",
    explanation: [
      "W1P 的核心不是一根强反转 K，而是趋势中先出现三推楔形回调，然后在关键位置发生 first pullback reversal。",
      "它和 A2 的区别在于结构节奏：A2 更强调两次失败反转，W1P 更强调三推衰竭后的 reversal。",
      "W1P 仍然需要趋势背景、关键位置和可执行信号 K，不能脱离上下文独立存在。"
    ],
    decisionChecklist: [
      "是否先有清楚趋势，而不是区间中部？",
      "回调是否能数出三推，而不是两腿或一次急跌？",
      "第三推是否接近 EMA、趋势线或突破位？",
      "强反转 K 是否能清楚定义 entry 与 stop？"
    ],
    commonTraps: [
      "把任何漂亮反转 K 都叫 W1P。",
      "在没有趋势背景的交易区间里硬找 W1P。",
      "只数到两推就提前命名 wedge。"
    ],
    sourceNote: "基于 wedge pullback / first pullback reversal 训练语境：三推衰竭后才研究 reversal。",
    caseIds: ["case-w1p-long", "case-w1p-false-reversal"],
    examIds: ["exam-w1p-1", "exam-w1p-2"]
  },
  {
    id: "w1p-confirmation",
    module: "w1p",
    title: "W1P 确认：第三推衰竭 + 反转信号 K",
    subtitle: "Wedge 本身不是入场，确认才是入场",
    masteryGoal: "能说明第三推衰竭与信号 K 确认为什么必须一起出现。",
    whyItMatters: "没有确认的 wedge 经常继续演化成 channel、深回调或更大区间。",
    explanation: [
      "第三推只是候选位置，不是自动入场。真正的执行来自反转信号 K。",
      "确认信号通常表现为第三推后出现强反向收盘、少重叠，并且最好有后续突破触发。",
      "如果第三推结束后只是 Doji、长影线或继续重叠，新手默认等待。"
    ],
    decisionChecklist: [
      "第三推是否出现力度衰减或尾部失败？",
      "信号 K 是否强收盘并定义合理风险？",
      "下一根是否需要外侧 1 tick 确认？",
      "若无确认，是否能等 A22 或新结构？"
    ],
    commonTraps: [
      "第三推一到位就提前抄底/摸顶。",
      "把 Doji 反转当确认。",
      "因为 wedge 结构漂亮就忽视 stop 过宽。"
    ],
    sourceNote: "训练重点在 wedge 结束后的 reversal confirmation，而不是楔形外观本身。",
    caseIds: ["case-w1p-long", "case-w1p-short"],
    examIds: ["exam-w1p-3", "exam-w1p-4", "exam-w1p-5"]
  },
  {
    id: "w1p-first-pullback",
    module: "w1p",
    title: "First pullback 边界：为什么第二次回调不再叫 W1P",
    subtitle: "setup 名称里最容易被忽视的单词就是 first",
    masteryGoal: "能判断某个 wedge reversal 是否仍属于 first pullback。",
    whyItMatters: "如果忽略 first，W1P 会无限扩张成“任何三推反转”。",
    explanation: [
      "W1P 的 first 指的是趋势建立后首个值得研究的 pullback reversal。",
      "一旦第一次回调已经发生并完成 reversal，后续再出现三推回调，就不再属于 first pullback。",
      "第二次、第三次三推也许能交易，但需要按其他环境与风险重新评估。"
    ],
    decisionChecklist: [
      "前面是否已经出现过一次清楚的 reversal pullback？",
      "当前三推回调是不是趋势建立后的第一个主要回调？",
      "若不是 first，是否应改用更中性的结构判断？",
      "是否避免为了方便而仍沿用 W1P 命名？"
    ],
    commonTraps: [
      "忽略 first，只看 wedge 形状。",
      "把趋势中任何第三次回调都当 W1P。",
      "用 setup 名称掩盖环境质量下降。"
    ],
    sourceNote: "W1P 的训练价值来自 first pullback reversal，不是任意 wedge reversal。",
    caseIds: ["case-w1p-second-pullback"],
    examIds: ["exam-w1p-6", "exam-w1p-7"]
  },
  {
    id: "w1p-filters",
    module: "w1p",
    title: "W1P 过滤与失败：假 wedge、区间背景、未确认反转",
    subtitle: "W1P 最怕的是把结果好坏误当定义",
    masteryGoal: "能识别不应做的 W1P 候选，并解释 whyWrong。",
    whyItMatters: "W1P 属于更容易诱发主观抄底/摸顶的 setup，过滤项比外观更重要。",
    explanation: [
      "没有三推、没有趋势、没有确认、处在区间中部，都会让 W1P 降级。",
      "即使最终价格按预期走出，也不代表 setup 定义正确。",
      "训练阶段要把假 wedge、未确认 wedge、第二次 wedge 全部单独记录。"
    ],
    decisionChecklist: [
      "是否真的是三推，而不是一次急跌或两腿回调？",
      "是否在区间中部、BW/TTR 中？",
      "是否已有 first pullback 被使用过？",
      "信号 K 与 risk/reward 是否合格？"
    ],
    commonTraps: [
      "结果上涨就说是 W1P。",
      "在横盘中对着每个三推乱反转。",
      "把未确认 wedge 强行做成 reversal trade。"
    ],
    sourceNote: "W1P 的训练核心是 setup 边界清楚，先过滤，再执行。",
    caseIds: ["case-w1p-false-reversal", "case-w1p-second-pullback"],
    examIds: ["exam-w1p-8", "exam-w1p-9"]
  }
];

export const w1pExams: ExamQuestion[] = [
  {
    id: "exam-w1p-1",
    mode: "concept",
    lessonId: "w1p-core",
    prompt: "W1P 最准确的结构定义是什么？",
    options: ["趋势中的三推回调后 first pullback reversal", "趋势中任意回调到 EMA 后的强反转", "第一次出现的任何强反转 K 线", "趋势中两腿回调后的 A2 延续入场"],
    answer: "趋势中的三推回调后 first pullback reversal",
    explanation: "W1P 强调 wedge pullback 与 first pullback reversal 的组合，不是单根 K。",
    whyWrong: {
      "趋势中任意回调到 EMA 后的强反转": "W1P 要求三推 wedge 结构，不是任意回调到 EMA。",
      "第一次出现的任何强反转 K 线": "W1P 的 first 指 first pullback，不是第一根强 K 线。",
      "趋势中两腿回调后的 A2 延续入场": "两腿回调更接近 A2 定义，W1P 强调三推楔形衰竭。"
    }
  },
  {
    id: "exam-w1p-2",
    mode: "case",
    lessonId: "w1p-core",
    chartCaseId: "case-w1p-false-reversal",
    prompt: "为什么图中不能把强阳反转直接归类为 W1P？",
    options: ["因为没有完整三推 wedge", "因为阳线不能做多", "因为 W1P 不需要趋势", "因为 EMA 太近"],
    answer: "因为没有完整三推 wedge",
    explanation: "W1P 的关键缺失是结构，不是信号 K 颜色。",
    whyWrong: {
      "因为阳线不能做多": "做多正需要牛信号，问题不在阳线。",
      "因为 W1P 不需要趋势": "W1P 必须有趋势背景。",
      "因为 EMA 太近": "靠近 EMA 通常是加分，不是主问题。"
    }
  },
  {
    id: "exam-w1p-3",
    mode: "case",
    lessonId: "w1p-confirmation",
    chartCaseId: "case-w1p-long",
    prompt: "W1P long 的真正执行触发来自哪里？",
    options: ["第三推一到位立刻市价买入", "第三推后强阳信号 K 高点上方 1 tick", "第二推结束就提前挂单", "EMA 被触碰就自动入场"],
    answer: "第三推后强阳信号 K 高点上方 1 tick",
    explanation: "Wedge 只是候选位置，执行必须等确认信号。",
    whyWrong: {
      "第三推一到位立刻市价买入": "这是提前抄底，没有确认。",
      "第二推结束就提前挂单": "W1P 需要第三推完成。",
      "EMA 被触碰就自动入场": "位置不能替代确认。"
    }
  },
  {
    id: "exam-w1p-4",
    mode: "execution",
    lessonId: "w1p-confirmation",
    chartCaseId: "case-w1p-short",
    prompt: "标准 W1P short 的触发与初始止损是什么？",
    options: ["信号 K 低点下方 Sell Stop，高点上方止损", "信号 K 收盘后市价做空", "信号 K 高点上方 Buy Stop", "等盈利后再设 stop"],
    answer: "信号 K 低点下方 Sell Stop，高点上方止损",
    explanation: "W1P 的执行规则和其他信号类 setup 一样，先定义触发和失效。",
    whyWrong: {
      "信号 K 收盘后市价做空": "缺少 breakout trigger。",
      "信号 K 高点上方 Buy Stop": "方向错了。",
      "等盈利后再设 stop": "入场前必须定义风险。"
    }
  },
  {
    id: "exam-w1p-5",
    mode: "concept",
    lessonId: "w1p-confirmation",
    prompt: "为什么第三推本身不能自动等于 W1P 入场？",
    options: ["因为还要看反转确认和风险定义", "因为三推结构完成就意味着 setup 已触发", "因为第三推到位后价格一定会立刻反转", "因为三推衰竭本身已经定义了止损和目标"],
    answer: "因为还要看反转确认和风险定义",
    explanation: "第三推只是 setup 候选，信号 K 与 entry/stop 才把它变成交易。",
    whyWrong: {
      "因为三推结构完成就意味着 setup 已触发": "结构完成只是候选位置，还需要信号 K 确认和触发。",
      "因为第三推到位后价格一定会立刻反转": "第三推后可能继续延伸或进入 channel，不一定反转。",
      "因为三推衰竭本身已经定义了止损和目标": "止损和目标必须由信号 K 的高低点定义，不是由 wedge 外观定义。"
    }
  },
  {
    id: "exam-w1p-6",
    mode: "case",
    lessonId: "w1p-first-pullback",
    chartCaseId: "case-w1p-second-pullback",
    prompt: "为什么右侧第二次三推回调不能继续叫 W1P？",
    options: ["因为已经不是 first pullback", "因为三推数量不够", "因为趋势已经不存在", "因为必须改叫 A2"],
    answer: "因为已经不是 first pullback",
    explanation: "W1P 名称中的 first 是定义的一部分。",
    whyWrong: {
      "因为三推数量不够": "右侧仍有三推外观。",
      "因为趋势已经不存在": "题目重点不是趋势缺失。",
      "因为必须改叫 A2": "它也未必自动变成 A2。"
    }
  },
  {
    id: "exam-w1p-7",
    mode: "concept",
    lessonId: "w1p-first-pullback",
    prompt: "W1P 中的 first 主要在提醒你什么？",
    options: ["不是所有 wedge reversal 都属于同一 setup，first 限制 setup 边界", "趋势中的第一根反转 K 比后续的更可靠", "first pullback 的胜率比后续 pullback 一定更高", "应该在第一个 wedge 出现时就立刻入场不等确认"],
    answer: "不是所有 wedge reversal 都属于同一 setup，first 限制 setup 边界",
    explanation: "first 用来限制 setup 边界，防止无限泛化。",
    whyWrong: {
      "趋势中的第一根反转 K 比后续的更可靠": "first 指 first pullback reversal，不是第一根 K 线。",
      "first pullback 的胜率比后续 pullback 一定更高": "胜率不是 first 的含义，first 是用来防止 setup 无限泛化。",
      "应该在第一个 wedge 出现时就立刻入场不等确认": "first 是定义边界，不是催促提前入场。"
    }
  },
  {
    id: "exam-w1p-8",
    mode: "concept",
    lessonId: "w1p-filters",
    prompt: "哪种环境最不适合训练 W1P？",
    options: ["BW/TTR 中部的三推乱反转", "趋势中第三推到 EMA 附近", "第三推后强反转确认", "趋势中的第一组主要回调"],
    answer: "BW/TTR 中部的三推乱反转",
    explanation: "区间中部没有方向优势，三推只会变成主观猜底摸顶。",
    whyWrong: {
      "趋势中第三推到 EMA 附近": "这反而可能构成标准候选。",
      "第三推后强反转确认": "这是确认条件，不是过滤项。",
      "趋势中的第一组主要回调": "这正是 W1P 候选环境。"
    }
  },
  {
    id: "exam-w1p-9",
    mode: "execution",
    lessonId: "w1p-filters",
    prompt: "如果第三推结束后只出现 Doji 且重叠明显，训练阶段最合理动作是什么？",
    options: ["wait，等待更强确认或放弃", "立刻市价进场", "放宽止损强做", "因为是 wedge 所以必须做"],
    answer: "wait，等待更强确认或放弃",
    explanation: "W1P 的执行依赖确认信号，Doji/重叠说明确认不足。",
    whyWrong: {
      "立刻市价进场": "没有确认会降低可复盘性。",
      "放宽止损强做": "放宽止损不能创造优势。",
      "因为是 wedge 所以必须做": "结构候选不等于强制交易。"
    }
  },

  // Multi-condition scenario
  {
    id: "exam-w1p-scenario-1",
    mode: "execution",
    lessonId: "w1p-confirmation",
    prompt: "上升趋势中出现三推回调到 EMA，第三推出现强阳信号 K，但止损宽度 10 ticks 而前方最近阻力只有 7 ticks。你应该？",
    options: ["跳过：止损大于 target 空间，即使 wedge 结构正确也不做", "做多因为三推 wedge 很标准不能浪费", "缩小止损到信号 K 中部让风险收益合格", "把目标设到更远结构位忽略近处阻力"],
    answer: "跳过：止损大于 target 空间，即使 wedge 结构正确也不做",
    explanation: "W1P 也要满足风险收益要求。结构正确但数学不合格的交易仍需跳过。",
    whyWrong: {
      "做多因为三推 wedge 很标准不能浪费": "结构好不能弥补风险收益不合格。",
      "缩小止损到信号 K 中部让风险收益合格": "随机缩小止损破坏 setup 失效定义。",
      "把目标设到更远结构位忽略近处阻力": "近处阻力可能拦截价格，目标应基于最近结构位。"
    }
  },

  // "不做" training
  {
    id: "exam-w1p-skip-1",
    mode: "execution",
    lessonId: "w1p-filters",
    prompt: "交易区间中部出现三推下跌后强阳反转，看起来像 W1P。但市场没有清楚的上升趋势背景。训练阶段应该？",
    options: ["跳过：没有趋势背景的三推反转不属于 W1P 训练样本", "做多因为三推 wedge 结构完整", "区间中部的三推比趋势中的更可靠", "只要强阳出现就可以做多不管背景"],
    answer: "跳过：没有趋势背景的三推反转不属于 W1P 训练样本",
    explanation: "W1P 要求趋势背景中的 first pullback，区间中部的三推只是噪音中数形状。",
    whyWrong: {
      "做多因为三推 wedge 结构完整": "结构完整但背景不对，缺少趋势支持。",
      "区间中部的三推比趋势中的更可靠": "区间中部没有方向优势，上下两端都会拦截。",
      "只要强阳出现就可以做多不管背景": "强 K 不能替代正确的 setup 语境。"
    }
  },

  // Setup confusion: W1P vs A2
  {
    id: "exam-w1p-boundary-1",
    mode: "concept",
    lessonId: "w1p-core",
    prompt: "趋势中回调到 EMA，但只有两腿而非三推。你应该按 W1P 还是 A2 来评估？",
    options: ["按 A2 评估：两腿回调是 A2 定义而非 W1P", "按 W1P 评估因为两者没有区别", "两腿也可以叫 W1P 只要在 EMA 附近", "都不做因为两腿不够三推不够"],
    answer: "按 A2 评估：两腿回调是 A2 定义而非 W1P",
    explanation: "A2 和 W1P 的关键区分在于回调结构：两腿 = A2，三推 wedge = W1P。分类不同影响确认逻辑。",
    whyWrong: {
      "按 W1P 评估因为两者没有区别": "结构节奏不同导致确认和失效条件不同。",
      "两腿也可以叫 W1P 只要在 EMA 附近": "W1P 的定义要求三推楔形，不是任意 EMA 附近回调。",
      "都不做因为两腿不够三推不够": "两腿回调正是 A2 的候选结构，可以评估是否合格。"
    }
  }
];

export const w1pGlossary: GlossaryEntry[] = [
  {
    id: "w1p",
    term: "W1P",
    chinese: "楔形第一回调反转",
    category: "setup",
    short: "趋势中的三推 wedge pullback 结束后出现的 first pullback reversal。",
    detail: "它不是任意反转 K，而是先有三推回调，再有确认信号和可定义风险。",
    example: "上升趋势中三推下跌到 EMA，第三推后强阳突破，形成 W1P long。"
  },
  {
    id: "wedge-pullback",
    term: "Wedge Pullback",
    chinese: "楔形回调",
    category: "structure",
    short: "趋势中的三推回调结构，常作为 W1P 的前提。",
    detail: "楔形不是自动入场点；它只是提示回调可能衰竭，仍需 reversal confirmation。",
    example: "三次向下推进回到 EMA，但只有第三推后强反转 K 才可研究做多。"
  }
];
