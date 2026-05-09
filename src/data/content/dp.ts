import type { ChartCase, ExamQuestion, GlossaryEntry, LessonUnit } from "./types";

export const dpChartCases: ChartCase[] = [
  {
    id: "case-dp-long",
    title: "标准 DP 做多：双底后确认反转",
    kind: "valid",
    difficulty: 2,
    setup: "DP long",
    context: "下跌后测试同一区域两次，第二次下破失败并在 EMA 附近出现强阳确认。",
    learnerTask: "判断这里为什么是 double bottom pullback，而不是 W1P 或 fBO。",
    verdict: "可训练。双测底部失败后反转，属于标准 DP 做多。",
    detailedRead: [
      "先看市场是否已经从单边趋势减速，开始出现支撑测试。",
      "两个低点测试同一区域，第二次下破没有 follow-through。",
      "强阳信号 K 说明第二次测试失败，多头接管。",
      "DP 不要求三推 wedge，而强调双测和失败确认。"
    ],
    bars: [
      { open: 132, high: 133, low: 121, close: 123, label: "down" },
      { open: 123, high: 124, low: 113, close: 115, label: "down" },
      { open: 115, high: 117, low: 106, close: 108, label: "L1" },
      { open: 108, high: 115, low: 107, close: 113, label: "bounce" },
      { open: 113, high: 114, low: 108, close: 109, label: "pb" },
      { open: 109, high: 110, low: 105, close: 106, label: "L2" },
      { open: 106, high: 116, low: 105, close: 114, label: "DP", signal: true },
      { open: 114, high: 123, low: 113, close: 121, label: "go" },
      { open: 121, high: 128, low: 119, close: 126, label: "target" },
      { open: 126, high: 130, low: 123, close: 128, label: "up" }
    ],
    ema: [136, 131, 126, 121, 118, 115, 114, 115, 118, 121],
    annotations: [
      { barIndex: 2, price: 108, label: "1", text: "第一次测试低点形成参考支撑。", tone: "info" },
      { barIndex: 5, price: 106, label: "2", text: "第二次测试未能持续下破，是 DP 的核心。", tone: "good" },
      { barIndex: 6, price: 114, label: "3", text: "强阳信号 K 提供反转确认。", tone: "good" }
    ]
  },
  {
    id: "case-dp-short",
    title: "标准 DP 做空：双顶后确认反转",
    kind: "valid",
    difficulty: 2,
    setup: "DP short",
    context: "上涨后测试同一高位两次，第二次上破失败并给出强阴信号 K。",
    learnerTask: "说明双顶确认为什么适合 DP 做空。",
    verdict: "可训练。双顶二次测试失败后反转，属于标准 DP 做空。",
    detailedRead: [
      "DP short 是 long 的镜像：双顶、上破失败、空头确认。",
      "重点不是第二次一定完全等高，而是同一高区再次测试失败。",
      "强阴信号 K 定义 sell stop 和失效点。",
      "若第二次测试强势突破并持续，就不再是 DP。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "up" },
      { open: 109, high: 121, low: 108, close: 119, label: "up" },
      { open: 119, high: 130, low: 117, close: 128, label: "H1" },
      { open: 128, high: 124, low: 121, close: 123, label: "pb" },
      { open: 123, high: 128, low: 122, close: 127, label: "bounce" },
      { open: 127, high: 131, low: 126, close: 130, label: "H2" },
      { open: 130, high: 131, low: 120, close: 121, label: "DP", signal: true },
      { open: 121, high: 122, low: 112, close: 114, label: "go" },
      { open: 114, high: 116, low: 106, close: 108, label: "target" },
      { open: 108, high: 110, low: 102, close: 104, label: "down" }
    ],
    ema: [96, 100, 105, 109, 113, 117, 119, 118, 115, 111],
    annotations: [
      { barIndex: 2, price: 128, label: "1", text: "第一次测试高位形成 DP 参照。", tone: "info" },
      { barIndex: 5, price: 130, label: "2", text: "第二次测试未获 follow-through。", tone: "good" },
      { barIndex: 6, price: 121, label: "3", text: "强阴确认后才进入执行。", tone: "good" }
    ]
  },
  {
    id: "case-dp-midrange-trap",
    title: "区间中部伪 DP：双测存在但位置错误",
    kind: "skip",
    difficulty: 2,
    setup: "False DP",
    context: "交易区间中部来回测试两次，看起来像双底，但并不靠近边界。",
    learnerTask: "解释为什么双测本身不够，位置同样重要。",
    verdict: "跳过。区间中部的随机双测没有明显 edge。",
    detailedRead: [
      "DP 最有价值的地方通常在边界、前高/前低或关键支撑阻力测试。",
      "如果双测发生在区间中部，只是在噪音中数形状。",
      "即使有强信号 K，也容易被上下两端重新吸回。",
      "训练动作是等待边界测试、突破失败或成功后的新结构。"
    ],
    bars: [
      { open: 108, high: 114, low: 104, close: 110, label: "TR" },
      { open: 110, high: 115, low: 106, close: 109, label: "TR" },
      { open: 109, high: 113, low: 105, close: 107, label: "L1" },
      { open: 107, high: 112, low: 106, close: 110, label: "bounce" },
      { open: 110, high: 114, low: 107, close: 108, label: "mid" },
      { open: 108, high: 111, low: 105, close: 106, label: "L2" },
      { open: 106, high: 114, low: 105, close: 113, label: "DP?", signal: true },
      { open: 113, high: 115, low: 108, close: 109, label: "fade" },
      { open: 109, high: 112, low: 106, close: 110, label: "TR" },
      { open: 110, high: 116, low: 108, close: 111, label: "TR" }
    ],
    ema: [109, 109, 109, 109, 109, 109, 109, 109, 109, 110],
    annotations: [
      { barIndex: 2, price: 107, label: "1", text: "双测出现在区间中部，不靠近关键边界。", tone: "bad" },
      { barIndex: 6, price: 113, label: "2", text: "强信号也难改变中部噪音属性。", tone: "warn" },
      { barIndex: 7, price: 109, label: "3", text: "很快又被吸回区间，说明 edge 不足。", tone: "bad" }
    ]
  },
  {
    id: "case-dp-breakout-continuation",
    title: "二测后直接突破延续：这不是 DP",
    kind: "wait",
    difficulty: 3,
    setup: "DP vs continuation",
    context: "第二次测试高位后，价格没有反转，反而强势突破并连续收在高位。",
    learnerTask: "判断为什么这里不能抢做 DP short。",
    verdict: "等待。二测后若突破延续成功，结构更接近 breakout continuation。",
    detailedRead: [
      "DP 需要第二次测试失败后出现反转确认。",
      "如果第二次测试本身就是强突破并持续，说明市场没有把它当 double top。",
      "此时逆势抢 DP short 只是主观猜顶。",
      "正确动作是等待突破回调、失败突破或更清楚的新结构。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "up" },
      { open: 109, high: 121, low: 108, close: 119, label: "up" },
      { open: 119, high: 129, low: 118, close: 127, label: "H1" },
      { open: 127, high: 124, low: 120, close: 122, label: "pb" },
      { open: 122, high: 126, low: 121, close: 125, label: "hold" },
      { open: 125, high: 131, low: 124, close: 130, label: "H2" },
      { open: 130, high: 138, low: 129, close: 137, label: "BO" , signal: true },
      { open: 137, high: 144, low: 135, close: 142, label: "follow" },
      { open: 142, high: 147, low: 140, close: 145, label: "trend" },
      { open: 145, high: 149, low: 143, close: 148, label: "up" }
    ],
    ema: [97, 101, 105, 109, 112, 116, 121, 126, 131, 136],
    annotations: [
      { barIndex: 5, price: 130, label: "1", text: "这里是二测候选，但尚未失败。", tone: "info" },
      { barIndex: 6, price: 137, label: "2", text: "强势上破并收在高位，市场在延续而不是反转。", tone: "bad" },
      { barIndex: 7, price: 142, label: "3", text: "follow-through 出现后，抢做 DP short 没有优势。", tone: "warn" }
    ]
  }
];

export const dpLessons: LessonUnit[] = [
  {
    id: "dp-core",
    module: "dp",
    title: "DP 定义：double test 后的反转确认",
    subtitle: "双测边界，不是双测形状",
    masteryGoal: "能识别 DP 的双底/双顶结构，并区分它与普通反弹。",
    whyItMatters: "如果只会数“两个低点/高点”，就会在交易区间中部反复误判。",
    explanation: [
      "DP 的核心是市场两次测试同一区域后，第二次测试失败，并给出反转确认。",
      "它可以表现为 double bottom pullback 或 double top pullback，本质是同一边界被重复检验。",
      "DP 与 W1P 的区别在于 W1P 更强调三推 wedge，DP 更强调双测边界。"
    ],
    decisionChecklist: [
      "是否有清楚第一次测试形成参考边界？",
      "第二次测试是否发生在同一区域？",
      "第二次测试后是否出现失败确认？",
      "这次双测是否发生在真正有意义的位置？"
    ],
    commonTraps: [
      "只要有两个低点就叫 DP。",
      "忽略双测发生在区间中部。",
      "第二次测试尚未失败就提前反向。"
    ],
    sourceNote: "DP 训练重点在 repeated test + failure confirmation，而不是机械几何形状。",
    caseIds: ["case-dp-long", "case-dp-short"],
    examIds: ["exam-dp-1", "exam-dp-2"]
  },
  {
    id: "dp-confirmation",
    module: "dp",
    title: "DP 确认：第二次测试失败后才进入执行",
    subtitle: "二测只是候选，失败确认才是 setup",
    masteryGoal: "能说明什么叫二测失败，什么叫二测后延续。",
    whyItMatters: "很多 DP 亏损都来自第二次测试还没失败就抢反向。",
    explanation: [
      "第二次测试只是结构候选。只有当第二次测试不能持续，并给出反向强信号，DP 才成立。",
      "如果第二次测试本身就是强突破并持续，就说明市场在 continuation，不是在 reversal。",
      "确认阶段要同时看 follow-through、收盘位置和重叠情况。"
    ],
    decisionChecklist: [
      "第二次测试后是否马上失去 follow-through？",
      "是否出现强反向信号 K？",
      "突破是失败还是正在成功？",
      "entry/stop 是否仍然合理？"
    ],
    commonTraps: [
      "第二次碰到高低点就提前下单。",
      "突破已经成功仍坚持叫 DP。",
      "只看形状，不看收盘与跟随。"
    ],
    sourceNote: "DP 的交易价值来自 second test failure，而不是 test 本身。",
    caseIds: ["case-dp-breakout-continuation", "case-dp-long"],
    examIds: ["exam-dp-3", "exam-dp-4", "exam-dp-5"]
  },
  {
    id: "dp-pullback-entry",
    module: "dp",
    title: "DP 入场：边界测试后的 trigger、stop 与 target",
    subtitle: "DP 也要回到预定义风险",
    masteryGoal: "能写出 DP long/short 的触发、初始止损与最小目标。",
    whyItMatters: "把 DP 当成主观反转，会直接跳过风险定义。",
    explanation: [
      "DP 和其他 setup 一样，执行依赖信号 K 外侧触发，不是看到双底双顶就市价进场。",
      "long 通常在强阳信号 K 高点上方 1 tick 触发，short 则镜像处理。",
      "如果信号 K 太大、位置太中间或 stop 大于 target，DP 也必须跳过。"
    ],
    decisionChecklist: [
      "触发是否在信号 K 外侧 1 tick？",
      "止损是否在信号 K 另一端外侧？",
      "前方是否有 room for profit？",
      "是否把 execution 写清楚而不是靠感觉反转？"
    ],
    commonTraps: [
      "双底一出现就立刻抄底。",
      "只因为看起来像 reversal 就取消 stop。",
      "把边界反转交易做成情绪交易。"
    ],
    sourceNote: "DP 不是例外 setup；它同样需要 trigger、stop、target 的完整闭环。",
    caseIds: ["case-dp-long", "case-dp-short"],
    examIds: ["exam-dp-6", "exam-dp-7"]
  },
  {
    id: "dp-filters",
    module: "dp",
    title: "DP 过滤与失败：中部双测、成功突破、setup 混淆",
    subtitle: "边界感比图形感更重要",
    masteryGoal: "能识别伪 DP，并说明为何应等待或跳过。",
    whyItMatters: "DP 容易和 fBO、继续突破、区间噪音混淆，过滤是主课。",
    explanation: [
      "中部双测不是 edge，只有边界双测才更有训练价值。",
      "第二次测试后若直接突破延续，说明市场没有把它当 reversal。",
      "若双测后出现的是 failed breakout 语境，也可能更接近 fBO 而非标准 DP。"
    ],
    decisionChecklist: [
      "双测是否靠近区间边界/前高前低？",
      "第二次测试后是失败还是成功突破？",
      "这里更像 DP，还是更像 fBO / continuation？",
      "如果模糊，是否愿意先 wait 而不是命名硬套？"
    ],
    commonTraps: [
      "区间中部乱做双底双顶。",
      "第二次测试刚开始就反向。",
      "不区分 DP 与 fBO。"
    ],
    sourceNote: "DP 的难点不在识别两个点，而在识别测试是否发生在有意义的位置。",
    caseIds: ["case-dp-midrange-trap", "case-dp-breakout-continuation"],
    examIds: ["exam-dp-8", "exam-dp-9"]
  }
];

export const dpExams: ExamQuestion[] = [
  {
    id: "exam-dp-1",
    mode: "concept",
    lessonId: "dp-core",
    prompt: "DP 的核心机制最准确的是哪一个？",
    options: ["市场两次测试同一区域，第二次失败后反转确认", "市场在同一区域出现两个低点就自动形成 DP", "第一次测试后的强反弹说明 DP 已经成立", "价格到达 EMA 并出现任意反向 K 就是 DP"],
    answer: "市场两次测试同一区域，第二次失败后反转确认",
    explanation: "DP 强调 double test + failure confirmation。",
    whyWrong: {
      "市场在同一区域出现两个低点就自动形成 DP": "两个低点只是形状，还需要位置有意义和第二次测试失败确认。",
      "第一次测试后的强反弹说明 DP 已经成立": "DP 需要第二次测试，一次反弹可能只是普通 bounce。",
      "价格到达 EMA 并出现任意反向 K 就是 DP": "DP 强调双测边界，不是简单的 EMA 反弹。"
    }
  },
  {
    id: "exam-dp-2",
    mode: "case",
    lessonId: "dp-core",
    chartCaseId: "case-dp-long",
    prompt: "图中为什么是 DP long，而不是普通随机反弹？",
    options: ["因为有第一次低点参照和第二次测试失败", "因为所有强阳都能做", "因为第二次低点越低越一定涨", "因为无需确认"],
    answer: "因为有第一次低点参照和第二次测试失败",
    explanation: "DP 的 edge 来自重复测试失败，而不是单根强阳。",
    whyWrong: {
      "因为所有强阳都能做": "强阳不能代替结构。",
      "因为第二次低点越低越一定涨": "深破位也可能是 continuation。",
      "因为无需确认": "确认是 DP 成立的关键。"
    }
  },
  {
    id: "exam-dp-3",
    mode: "case",
    lessonId: "dp-confirmation",
    chartCaseId: "case-dp-breakout-continuation",
    prompt: "为什么这里不能抢做 DP short？",
    options: ["因为第二次测试后是强突破延续，不是失败确认", "因为双顶永远不能做空", "因为 EMA 上行就必须只做多", "因为第二次测试不存在"],
    answer: "因为第二次测试后是强突破延续，不是失败确认",
    explanation: "DP 需要 second test failure；这里反而是 continuation。",
    whyWrong: {
      "因为双顶永远不能做空": "标准 DP short 正是双顶失败后的做空。",
      "因为 EMA 上行就必须只做多": "关键是测试是否失败，不是只看 EMA。",
      "因为第二次测试不存在": "这里有第二次测试候选。"
    }
  },
  {
    id: "exam-dp-4",
    mode: "concept",
    lessonId: "dp-confirmation",
    prompt: "第二次测试后，哪种信息最支持 DP 已成立？",
    options: ["测试无法持续并出现强反向信号", "测试强势突破并连续收在高位", "只有一根 Doji", "把 stop 放大"],
    answer: "测试无法持续并出现强反向信号",
    explanation: "DP 交易的是 second test failure，而不是 test continuation。",
    whyWrong: {
      "测试强势突破并连续收在高位": "这是 continuation 语境。",
      "只有一根 Doji": "Doji 本身不等于确认。",
      "把 stop 放大": "风险放大不是确认。"
    }
  },
  {
    id: "exam-dp-5",
    mode: "execution",
    lessonId: "dp-confirmation",
    prompt: "DP 候选出现后，最稳妥的入场原则是什么？",
    options: ["只在确认信号 K 外侧 1 tick 触发", "看到双测就市价进场", "先入场后找 stop", "因为是 reversal 所以不用 target"],
    answer: "只在确认信号 K 外侧 1 tick 触发",
    explanation: "DP 也需要 breakout trigger 与预定义风险。",
    whyWrong: {
      "看到双测就市价进场": "缺少确认。",
      "先入场后找 stop": "违背风险定义。",
      "因为是 reversal 所以不用 target": "所有交易都要有目标或结构计划。"
    }
  },
  {
    id: "exam-dp-6",
    mode: "execution",
    lessonId: "dp-pullback-entry",
    chartCaseId: "case-dp-short",
    prompt: "标准 DP short 的触发和初始止损是什么？",
    options: ["信号 K 低点下方 Sell Stop，高点上方止损", "信号 K 收盘后市价做空", "低点上方 Buy Stop", "盈利后再设止损"],
    answer: "信号 K 低点下方 Sell Stop，高点上方止损",
    explanation: "DP short 的执行和其他做空 setup 一样，先定义触发与失效。",
    whyWrong: {
      "信号 K 收盘后市价做空": "缺少触发确认。",
      "低点上方 Buy Stop": "方向错误。",
      "盈利后再设止损": "入场前必须定义 stop。"
    }
  },
  {
    id: "exam-dp-7",
    mode: "concept",
    lessonId: "dp-pullback-entry",
    prompt: "如果 DP 信号 K 太大导致 stop 大于 target，应怎么办？",
    options: ["跳过或等待更好信号", "缩到随机小 stop", "必须做因为双底很强", "取消 target"],
    answer: "跳过或等待更好信号",
    explanation: "DP 不是例外 setup，risk/reward 仍然要过关。",
    whyWrong: {
      "缩到随机小 stop": "随机 stop 破坏 setup 失效定义。",
      "必须做因为双底很强": "强感觉不能替代数学。",
      "取消 target": "没有 target 无法评估 EV。"
    }
  },
  {
    id: "exam-dp-8",
    mode: "case",
    lessonId: "dp-filters",
    chartCaseId: "case-dp-midrange-trap",
    prompt: "图中最核心的跳过原因是什么？",
    options: ["双测发生在区间中部，没有边界优势", "因为不能做多", "因为双测次数太少", "因为 EMA 一定要斜率很大"],
    answer: "双测发生在区间中部，没有边界优势",
    explanation: "DP 的价值来自边界测试，不是中部形状。",
    whyWrong: {
      "因为不能做多": "DP long 在合适位置当然可以做。",
      "因为双测次数太少": "两次测试本来就够，但位置错。",
      "因为 EMA 一定要斜率很大": "主问题不是 EMA。"
    }
  },
  {
    id: "exam-dp-9",
    mode: "concept",
    lessonId: "dp-filters",
    prompt: "DP 与 fBO 最容易混淆的地方是什么？",
    options: ["都可能出现在边界测试失败后，但一个强调双测，一个强调突破失败", "两个完全一样", "DP 只做多，fBO 只做空", "它们都不需要确认"],
    answer: "都可能出现在边界测试失败后，但一个强调双测，一个强调突破失败",
    explanation: "两者都可出现在边界，但结构重点不同。",
    whyWrong: {
      "两个完全一样": "setup 逻辑不同。",
      "DP 只做多，fBO 只做空": "两者都可双向。",
      "它们都不需要确认": "两者都需要确认。"
    }
  },

  // Multi-condition scenario
  {
    id: "exam-dp-scenario-1",
    mode: "execution",
    lessonId: "dp-confirmation",
    prompt: "区间底部第二次测试出现强阳信号 K，但前面有 3 根 Doji 高度重叠，且止损需 8 ticks 而到区间上沿只有 6 ticks。你应该？",
    options: ["跳过：重叠环境 + 风险收益不合格，虽然结构像 DP", "做多因为双底结构标准且信号 K 很强", "缩小止损让数学合格再做", "把目标设到区间外面忽略上沿阻力"],
    answer: "跳过：重叠环境 + 风险收益不合格，虽然结构像 DP",
    explanation: "DP 也要综合评估信号环境和风险收益。重叠 + stop > target 是两个独立的否决因素。",
    whyWrong: {
      "做多因为双底结构标准且信号 K 很强": "结构正确但数学和信号环境都不合格。",
      "缩小止损让数学合格再做": "随机缩小止损破坏 setup 失效定义。",
      "把目标设到区间外面忽略上沿阻力": "区间上沿是真实阻力，不能假设价格会穿越。"
    }
  },

  // "不做" training
  {
    id: "exam-dp-skip-1",
    mode: "case",
    lessonId: "dp-filters",
    chartCaseId: "case-dp-midrange-trap",
    prompt: "图中的双测发生在区间中部而非边界，即使出现强信号 K，训练阶段为什么仍应跳过？",
    options: ["因为中部双测没有边界优势，价格容易被上下两端重新吸回", "因为双测次数不够多应该等第三次", "因为只有 DP long 不允许在中部做", "因为必须等三推才能做任何 setup"],
    answer: "因为中部双测没有边界优势，价格容易被上下两端重新吸回",
    explanation: "DP 的价值来自边界测试失败，区间中部的双测只是噪音中数形状。",
    whyWrong: {
      "因为双测次数不够多应该等第三次": "两次测试本来就是 DP 的定义，次数不是问题而是位置。",
      "因为只有 DP long 不允许在中部做": "DP 可以双向，问题不是方向而是位置没有 edge。",
      "因为必须等三推才能做任何 setup": "三推是 W1P 的要求，不是 DP 的要求。"
    }
  },

  // Setup confusion: DP vs fBO
  {
    id: "exam-dp-boundary-1",
    mode: "concept",
    lessonId: "dp-filters",
    prompt: "区间底部先有明显下破刺穿、再收回区间、然后强阳确认。这更像 DP 还是 fBO？",
    options: ["更像 fBO：先有 breakout 尝试再失败，而非简单双测", "更像 DP 因为都是在底部反转", "两者完全一样可以互换使用", "既不是 DP 也不是 fBO 因为底部不能做多"],
    answer: "更像 fBO：先有 breakout 尝试再失败，而非简单双测",
    explanation: "关键是有没有 breakout 先行：先下破再回收是 fBO 语境，没有下破只是双测是 DP 语境。",
    whyWrong: {
      "更像 DP 因为都是在底部反转": "位置相同但结构不同：先有 breakout 是 fBO，没有 breakout 是 DP。",
      "两者完全一样可以互换使用": "两者的交易逻辑不同，fBO 交易 trapped traders，DP 交易双测失败。",
      "既不是 DP 也不是 fBO 因为底部不能做多": "两个 setup 都可以在边界做多做空。"
    }
  }
];

export const dpGlossary: GlossaryEntry[] = [
  {
    id: "dp",
    term: "DP",
    chinese: "双测回调反转",
    category: "setup",
    short: "市场两次测试同一区域后，第二次测试失败并给出反转确认的 setup。",
    detail: "DP 可表现为双底做多或双顶做空，重点在 second test failure，不只是两个点长得像。",
    example: "前低附近第二次下探失败后强阳反转，形成 DP long。"
  },
  {
    id: "double-test",
    term: "Double Test",
    chinese: "双重测试",
    category: "structure",
    short: "价格对同一边界或区域进行两次检验。",
    detail: "Double test 只有在关键边界附近才更有意义；区间中部的双测常只是噪音。",
    example: "区间底部第一次探底后反弹，再次回测失败，才值得研究 DP。"
  }
];
