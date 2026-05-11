import type { ChartCase, ExamQuestion, GlossaryEntry, LessonUnit, SourceAnchor } from "./types";

const sourceAnchors = {
  signalBarSelection: {
    id: "SRC-SIGNAL-BAR-SELECTION",
    label: "Signal bar selection",
    source: "ninetrans_book.txt",
    location: "line 246",
    rule: "Price Action 学习的第一步是先筛选信号 K；顺势、强收盘、少重叠、能定义风险，比单根形状更重要。",
    pdfQuote: "The very first thing to learn about price action trading is signal bar selection."
  },
  a2Definition: {
    id: "SRC-A2-DEFINITION",
    label: "A2 definition",
    source: "ninetrans_book.txt",
    location: "lines 83-93, 181",
    rule: "A2 是趋势中回调接近 EMA 后，第二次结束回调/反转尝试失败形成的延续信号。",
    pdfQuote: "A2 is a 2 legged pullback to the ema."
  },
  a2FarFromEma: {
    id: "SRC-A2-FAR-FROM-EMA",
    label: "Far from EMA downgrade",
    source: "ninetrans_book.txt",
    location: "lines 181, 251",
    rule: "A2 入场点若离 EMA/趋势线太远，应降级等待；它可能继续发展成第三推或更深的回调。",
    pdfQuote: "if your A2 entry is very far from the ema, you may get a 3rd push"
  },
  a22SecondEntry: {
    id: "SRC-A22-SECOND-ENTRY",
    label: "A22 second entry",
    source: "ninetrans_book.txt",
    location: "lines 91-93, 394",
    rule: "A22 是第一 A2 信号弱、重叠、止损过大或未触发后，用新的更清楚信号重新定义风险的第二入场。",
    pdfQuote: "A second entry for an A2"
  },
  h1L1Mirror: {
    id: "SRC-H1-L1-MIRROR",
    label: "H1/L1 mirror sequence",
    source: "ninetrans_book.txt",
    location: "lines 97-113",
    rule: "下降趋势中的 H1/fH1/H2 与上升趋势中的 L1/fL1/L2 是镜像序列，做空 A2 必须完整镜像做多流程。",
    pdfQuote: "L1,fL1,L2 Inverse of H1,fH1,H2 in an up move."
  },
  ttrBwSkip: {
    id: "SRC-TTR-BW-SKIP",
    label: "TTR/BW skip filter",
    source: "ninetrans_book.txt",
    location: "lines 150-151, 434, 2014",
    rule: "TTR/BW/OL 是方向优势不足的状态，多数内部信号应跳过，优先等待突破失败或成功后的 BP。",
    pdfQuote: "Most trades in BW/OL are likely to fail."
  },
  breakoutPullback: {
    id: "SRC-BREAKOUT-PULLBACK",
    label: "Breakout pullback",
    source: "ninetrans_book.txt",
    location: "lines 193-195, 289",
    rule: "区间内部不把小二腿当普通 A2；有效突破后，二腿回调才可能成为 BP A2，并可参考 measured move。",
    pdfQuote: "A 2 legged pullback after a breakout... is possibly the first A2"
  },
  trendTermination: {
    id: "SRC-TREND-TERMINATION",
    label: "Trend termination",
    source: "ninetrans_book.txt",
    location: "lines 211, 320, 1998-1999, 2080",
    rule: "双顶/双底、TTR、弱反转后弱 A2、fRev + fA2 都提示趋势可能终结；此处 A2 应降级为退出或停手线索。",
    pdfQuote: "After this point, there may be no more A2s."
  },
  openingFirstTwoLeggedPullback: {
    id: "SRC-OPENING-FIRST-2L-PB",
    label: "Opening first 2L pullback",
    source: "ninetrans_book.txt",
    location: "lines 256, 279, 320",
    rule: "开盘、gap、1Rev/1PB 语境复杂；保守学习者可等待第一个清楚的 two-legged pullback，而不是抢开盘信号。",
    pdfQuote: "a conservative trader may simply wait for the first 2 legged pullback"
  },
  marketStructureFilter: {
    id: "SRC-MARKET-STRUCTURE-FILTER",
    label: "Market structure filter",
    source: "ninetrans_book.txt",
    location: "lines 168, 211, 2309",
    rule: "市场结构是总过滤器；先判断 normal trend、hard trend、soft trend、channel 或 TR，再决定 A2 标准是否适用。",
    pdfQuote: "Market structure is your filter and overall guide"
  },
  hardSoftTrendExceptions: {
    id: "SRC-HARD-SOFT-TREND",
    label: "Hard/soft trend exceptions",
    source: "ninetrans_book.txt",
    location: "lines 181, 325-335, 2117",
    rule: "Hard trend 中 H1/L1 可能有效，soft trend 中 fL2 可能频繁有效；但 PDF 明确建议新手先只做 A2。",
    pdfQuote: "new traders should just stick to A2"
  },
  fa2Failure: {
    id: "SRC-FA2-FAILURE",
    label: "Failed A2",
    source: "ninetrans_book.txt",
    location: "lines 209, 1998-1999, 2211",
    rule: "fA2 是趋势延续尝试失败的信息，可能提示趋势终结或新方向两腿，但不等于新手可以立刻报复性反手。",
    pdfQuote: "Failed Reversal followed by failed A2"
  },
  twoStrikes: {
    id: "SRC-TWO-STRIKES",
    label: "2/5 discipline",
    source: "ninetrans_book.txt",
    location: "line 220",
    rule: "两笔亏损或总计五笔交易后当日停止，用低频、主要转折和强信号训练一致性。",
    pdfQuote: "If you lose two trades, you are done for the day."
  },
  tradePlanExecution: {
    id: "SRC-TRADE-PLAN-EXECUTION",
    label: "Entry/stop/target",
    source: "ninetrans_book.txt",
    location: "lines 220, 226, 294, 2270",
    rule: "A2 交易必须在入场前定义 entry、initial stop、target、first target、breakeven stop 和 swing 管理。",
    pdfQuote: "your entries, exits and stops are very well defined"
  },
  tickExecution: {
    id: "SRC-TICK-EXECUTION",
    label: "Tick execution",
    source: "ninetrans_book.txt",
    location: "line 226",
    rule: "做多 entry 在信号 K 高点上方 1 tick，stop 在低点下方 1 tick，target 至少 4 ticks or more；做空镜像。",
    pdfQuote: "long entry is 1 tick above the signal bar"
  },
  orderDiscipline: {
    id: "SRC-ORDER-DISCIPLINE",
    label: "No trigger, no trade",
    source: "ninetrans_book.txt",
    location: "lines 351, 433-435",
    rule: "新手应消除 limit entries；强信号 K 若没有触发就放弃，不能把未触发、追价和新信号混成同一笔 A2。",
    pdfQuote: "If your strong signal bar does not trigger, let it go."
  },
  simRule10: {
    id: "SRC-SIM-RULE-10",
    label: "SIM and Rule of 10",
    source: "ninetrans_book.txt",
    location: "lines 226, 229-237",
    rule: "先在 SIM 只做 A2，满足 Rule of 10 后再考虑扩展；知识网站只能帮助学习，不替代执行证据。",
    pdfQuote: "The first thing you do is to trade for a while on a simulator"
  },
  exitManagement: {
    id: "SRC-EXIT-MANAGEMENT",
    label: "Exit management",
    source: "ninetrans_book.txt",
    location: "lines 2186, 2216, 2270",
    rule: "离场不是随意落袋；first target、breakeven stop、TTR/Doji/climax/trendline break 等趋势终结线索要分开处理。",
    pdfQuote: "If you see three or more dojis in a pullback, its best to exit"
  },
  riskMathMae: {
    id: "SRC-RISK-MATH-MAE",
    label: "Risk math and MAE",
    source: "ninetrans_book.txt",
    location: "lines 220, 2270-2281, 2312",
    rule: "stop 不应大于 target；MAE 用来区分触发后立刻走远的高质量 entry 与深回撤的低质量 swing。",
    pdfQuote: "trades with wider stops should have a very large EV"
  },
  channelFilter: {
    id: "SRC-CHANNEL-FILTER",
    label: "Channel filter",
    source: "ninetrans_book.txt",
    location: "lines 2317-2326, 2239",
    rule: "Channel 是有方向的重叠漂移；普通 signal-bar breakout 和 fixed stop 会变弱，应切换为等待 breakout 或不再重叠的 pullback。",
    pdfQuote: "Never make mid-bar decisions, especially in a channel."
  },
  barByBarPractice: {
    id: "SRC-BAR-BY-BAR-PRACTICE",
    label: "Bar-by-bar practice",
    source: "ninetrans_book.txt",
    location: "lines 226, 351, 394",
    rule: "逐 K 标注要把 setup、entry、stop、target、skip reason 和纪律证据写清楚，避免把临场感觉当成 A2 知识。",
    pdfQuote: "only trade proven setups such as A2"
  }
} satisfies Record<string, SourceAnchor>;

type SourceAnchorKey = keyof typeof sourceAnchors;

function anchors(...ids: SourceAnchorKey[]): SourceAnchor[] {
  return ids.map((id) => sourceAnchors[id]);
}

export const chartCases: ChartCase[] = [
  {
    id: "case-clean-a2-long",
    title: "标准 A2 做多：趋势清晰，二腿回调到 EMA",
    kind: "valid",
    difficulty: 1,
    setup: "A2 long",
    context: "E-mini 5 分钟图形成 HH-HL，上升 EMA，价格从新高回调两腿后触及 EMA。",
    learnerTask: "判断 b10 是否是可以训练的 A2 做多信号，并指出入场、止损和目标思路。",
    verdict: "可作为 well formed A2 训练样本。",
    detailedRead: [
      "第一眼先看结构：b1-b4 推出新高，b5-b7 是第一腿回调，b8 反弹失败，b9-b10 是第二腿。",
      "第二眼看位置：b10 的低点贴近 EMA，符合 A2 必须接近 EMA 或趋势线的要求。",
      "第三眼看信号 K：b10 是强阳线，收盘靠近高点，和前一根重叠不大。",
      "执行上不追收盘价，而是在 b10 高点上方 1 tick 挂 Buy Stop，止损放在 b10 低点下方 1 tick。"
    ],
    bars: [
      { open: 104, high: 112, low: 101, close: 110, label: "b1" },
      { open: 110, high: 121, low: 108, close: 119, label: "b2" },
      { open: 119, high: 126, low: 116, close: 124, label: "b3" },
      { open: 124, high: 132, low: 122, close: 130, label: "b4" },
      { open: 130, high: 131, low: 121, close: 123, label: "L1" },
      { open: 123, high: 126, low: 116, close: 118, label: "leg1" },
      { open: 118, high: 124, low: 117, close: 122, label: "fL1" },
      { open: 122, high: 123, low: 114, close: 116, label: "leg2" },
      { open: 116, high: 118, low: 111, close: 113, label: "L2" },
      { open: 113, high: 123, low: 112, close: 122, label: "A2", signal: true },
      { open: 122, high: 132, low: 121, close: 130, label: "entry" },
      { open: 130, high: 138, low: 128, close: 136, label: "target" }
    ],
    ema: [97, 101, 105, 109, 112, 114, 115, 115, 114, 115, 118, 122],
    annotations: [
      { barIndex: 8, price: 113, label: "1", text: "第二腿低点贴近 EMA，位置合格。", tone: "info" },
      { barIndex: 9, price: 123, label: "2", text: "信号 K 强收盘，突破高点才触发。", tone: "good" },
      { barIndex: 10, price: 130, label: "3", text: "下一根 K 突破确认，A2 进入执行阶段。", tone: "good" }
    ]
  },
  {
    id: "case-doji-overlap",
    title: "结构像 A2，但信号 K 是 Doji + 重叠",
    kind: "wait",
    difficulty: 2,
    setup: "Weak A2 / A22 candidate",
    context: "趋势方向没问题，两腿也能数出来，但第二腿末端的信号 K 没有方向。",
    learnerTask: "判断是否立刻挂单，还是等待 A22 或放弃。",
    verdict: "等待 A22 或跳过。结构通过，信号 K 不通过。",
    detailedRead: [
      "很多新手只要看到两腿回调到 EMA 就想做，这会把 A2 误解成位置交易。",
      "b10 是 Doji，实体很小，上下影线明显，说明这一根没有多头控制。",
      "b8-b10 与前面 K 线重叠明显，突破后 1tf 或 5tf 的风险高。",
      "正确训练动作是等待更强的第二入场 A22，或者把这张图记录为弱信号样本。"
    ],
    bars: [
      { open: 101, high: 111, low: 99, close: 109, label: "b1" },
      { open: 109, high: 118, low: 106, close: 116, label: "b2" },
      { open: 116, high: 124, low: 114, close: 122, label: "b3" },
      { open: 122, high: 127, low: 118, close: 125, label: "b4" },
      { open: 125, high: 126, low: 116, close: 119, label: "L1" },
      { open: 119, high: 122, low: 114, close: 116, label: "leg1" },
      { open: 116, high: 123, low: 115, close: 120, label: "fL1" },
      { open: 120, high: 122, low: 113, close: 115, label: "leg2" },
      { open: 115, high: 119, low: 112, close: 114, label: "L2" },
      { open: 114, high: 119, low: 111, close: 115, label: "Doji", signal: true },
      { open: 115, high: 118, low: 110, close: 112, label: "1tf" },
      { open: 112, high: 122, low: 111, close: 120, label: "A22?" }
    ],
    ema: [96, 100, 104, 108, 111, 113, 114, 114, 113, 113, 113, 115],
    annotations: [
      { barIndex: 9, price: 119, label: "1", text: "高亮信号是 Doji，上下影线和小实体显示方向不清。", tone: "warn" },
      { barIndex: 10, price: 110, label: "2", text: "弱信号触发后容易 1tf 或直接失败。", tone: "bad" },
      { barIndex: 11, price: 122, label: "3", text: "等待后续强 K，才可能形成 A22。", tone: "info" }
    ]
  },
  {
    id: "case-bw-trap",
    title: "BW/OL 陷阱：看似信号，实际应该停手",
    kind: "skip",
    difficulty: 2,
    setup: "No trade",
    context: "价格在 EMA 附近横向重叠，多根 K 线都有长影线和小实体。",
    learnerTask: "判断这里是否能做 A2，还是应该等待突破后的 BP。",
    verdict: "跳过。BW/OL 区域中的多数信号没有优势。",
    detailedRead: [
      "BW 是三根以上横向 K 线，至少一根 Doji，互相重叠明显。",
      "这里的问题不是方向看不懂，而是市场本身没有给出方向。",
      "在 BW 内部做 A2，止损常被上下两端反复扫掉。",
      "正确动作是等待 BW 一侧突破，再观察突破是否成功，成功后找 BP，失败后才考虑 fBO。"
    ],
    bars: [
      { open: 101, high: 108, low: 96, close: 105, label: "b1" },
      { open: 105, high: 109, low: 99, close: 102, label: "b2" },
      { open: 102, high: 107, low: 98, close: 104, label: "b3" },
      { open: 104, high: 108, low: 97, close: 101, label: "b4" },
      { open: 101, high: 106, low: 98, close: 103, label: "b5" },
      { open: 103, high: 109, low: 99, close: 102, label: "Doji", signal: true },
      { open: 102, high: 107, low: 97, close: 104, label: "b7" },
      { open: 104, high: 108, low: 98, close: 101, label: "b8" },
      { open: 101, high: 107, low: 97, close: 103, label: "b9" },
      { open: 103, high: 109, low: 99, close: 102, label: "b10" },
      { open: 102, high: 112, low: 101, close: 111, label: "BO" },
      { open: 111, high: 114, low: 106, close: 108, label: "BP?" }
    ],
    ema: [100, 101, 102, 102, 102, 102, 102, 102, 102, 103, 104, 106],
    annotations: [
      { barIndex: 5, price: 109, label: "1", text: "连续重叠且有 Doji，属于 BW/OL 区域。", tone: "bad" },
      { barIndex: 10, price: 112, label: "2", text: "先等一侧突破，不在 BW 内部猜方向。", tone: "info" },
      { barIndex: 11, price: 108, label: "3", text: "突破后再评估 BP，而不是追第一根突破。", tone: "info" }
    ]
  },
  {
    id: "case-far-from-ema",
    title: "远离 EMA 的假 A2：可能还有第三推",
    kind: "wait",
    difficulty: 2,
    setup: "Too far from EMA",
    context: "上升趋势很强，回调浅，第二次尝试结束回调的位置离 EMA 仍很远。",
    learnerTask: "判断是否因为趋势强就接受这个 A2。",
    verdict: "等待。位置离 EMA 太远，不符合新手 A2 训练标准。",
    detailedRead: [
      "A2 的优势来自趋势延续和回调到均线附近的组合。",
      "如果第二腿结束处离 EMA 很远，价格可能还会走第三推，变成 W pullback。",
      "强趋势中 H1/L1 有时有效，但书中建议新手先只做 A2。",
      "正确动作是记录为浅回调样本，等待更靠近 EMA 的二腿或三推完成。"
    ],
    bars: [
      { open: 101, high: 114, low: 99, close: 112, label: "b1" },
      { open: 112, high: 128, low: 111, close: 126, label: "b2" },
      { open: 126, high: 141, low: 124, close: 139, label: "b3" },
      { open: 139, high: 152, low: 137, close: 150, label: "b4" },
      { open: 150, high: 151, low: 142, close: 144, label: "L1" },
      { open: 144, high: 149, low: 141, close: 148, label: "fL1" },
      { open: 148, high: 150, low: 140, close: 143, label: "L2" },
      { open: 143, high: 154, low: 142, close: 152, label: "far", signal: true },
      { open: 152, high: 155, low: 137, close: 140, label: "3rd?" },
      { open: 140, high: 145, low: 132, close: 135, label: "EMA" },
      { open: 135, high: 146, low: 133, close: 144, label: "better" },
      { open: 144, high: 154, low: 143, close: 152, label: "go" }
    ],
    ema: [96, 101, 108, 116, 122, 127, 131, 134, 136, 137, 138, 141],
    annotations: [
      { barIndex: 7, price: 152, label: "1", text: "候选 A2 离 EMA 仍太远，位置不合格。", tone: "warn" },
      { barIndex: 8, price: 140, label: "2", text: "远离 EMA 的 A2 可能继续走第三推。", tone: "bad" },
      { barIndex: 10, price: 144, label: "3", text: "更深回调靠近 EMA 后，位置质量才改善。", tone: "good" }
    ]
  },
  {
    id: "case-one-leg-not-a2",
    title: "单腿回调不是 A2：强信号也要先排除",
    kind: "skip",
    difficulty: 1,
    setup: "Not A2",
    context: "上升趋势后只出现一腿下跌，随后立刻出现强阳线。",
    learnerTask: "判断 b7 是否可以叫 A2，还是只是 H1/单腿回调后的顺势信号。",
    verdict: "不是 A2。可以研究为顺势 H1，但不属于新手 A2 训练范围。",
    detailedRead: [
      "A2 的 A 是 second attempt，必须有第一次尝试失败后，第二次尝试也失败。",
      "这张图只有从高点下来的第一腿，缺少 fL1 后的第二腿。",
      "b7 是强阳线，但强信号 K 不能弥补序列缺失。",
      "新手训练阶段应该把它标成“非 A2”，避免把所有顺势强 K 都塞进 A2 分类。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "b1" },
      { open: 109, high: 120, low: 107, close: 118, label: "b2" },
      { open: 118, high: 128, low: 116, close: 126, label: "HH" },
      { open: 126, high: 127, low: 119, close: 121, label: "pb" },
      { open: 121, high: 123, low: 115, close: 117, label: "L1" },
      { open: 117, high: 119, low: 113, close: 115, label: "leg1" },
      { open: 115, high: 126, low: 114, close: 124, label: "H1", signal: true },
      { open: 124, high: 132, low: 123, close: 130, label: "go" },
      { open: 130, high: 134, low: 126, close: 128, label: "pb" },
      { open: 128, high: 136, low: 127, close: 134, label: "HH" },
      { open: 134, high: 138, low: 131, close: 136, label: "b11" },
      { open: 136, high: 141, low: 134, close: 139, label: "b12" }
    ],
    ema: [96, 100, 104, 108, 111, 113, 115, 118, 121, 124, 127, 130],
    annotations: [
      { barIndex: 4, price: 115, label: "1", text: "只有第一腿回调，还没有 fL1 后的第二腿。", tone: "bad" },
      { barIndex: 6, price: 126, label: "2", text: "强阳线可以是顺势信号，但不能自动命名为 A2。", tone: "warn" },
      { barIndex: 7, price: 130, label: "3", text: "结果上涨不代表分类正确；训练时先保证 setup 定义准确。", tone: "info" }
    ]
  },
  {
    id: "case-fa2",
    title: "fA2：止损后不是马上反手",
    kind: "reversal-risk",
    difficulty: 3,
    setup: "Failed A2",
    context: "趋势后期出现 A2 做多，但触发后马上跌破信号 K 低点。",
    learnerTask: "判断止损后应该立刻做空，还是等待两个摆动再评估。",
    verdict: "新手默认等待两个摆动；只有强反向结构清晰时才考虑反向机会。",
    detailedRead: [
      "fA2 是重要信息：原趋势延续尝试失败，市场可能进入 TR 或新方向两腿。",
      "但它不是报复性反手的理由。你需要观察失败后是否有强反向 K 和后续跟随。",
      "如果失败区域继续重叠，就是 TTR/BW，应该停手。",
      "训练动作是把 fA2 标出来，等待两个摆动完成后重新判断市场结构。"
    ],
    bars: [
      { open: 101, high: 114, low: 99, close: 112, label: "trend" },
      { open: 112, high: 125, low: 110, close: 123, label: "HH" },
      { open: 123, high: 126, low: 116, close: 118, label: "L1" },
      { open: 118, high: 124, low: 117, close: 122, label: "fL1" },
      { open: 122, high: 123, low: 113, close: 115, label: "L2" },
      { open: 115, high: 124, low: 114, close: 123, label: "A2", signal: true },
      { open: 123, high: 125, low: 112, close: 113, label: "fail" },
      { open: 113, high: 116, low: 103, close: 106, label: "leg1" },
      { open: 106, high: 112, low: 105, close: 110, label: "pb" },
      { open: 110, high: 111, low: 99, close: 101, label: "leg2" },
      { open: 101, high: 107, low: 98, close: 104, label: "wait" },
      { open: 104, high: 106, low: 100, close: 102, label: "eval" }
    ],
    ema: [97, 102, 106, 109, 111, 113, 113, 111, 109, 106, 104, 103],
    annotations: [
      { barIndex: 5, price: 124, label: "1", text: "A2 信号触发，但还需要后续跟随。", tone: "good" },
      { barIndex: 6, price: 112, label: "2", text: "下一根跌破信号 K 低点，形成 fA2。", tone: "bad" },
      { barIndex: 9, price: 101, label: "3", text: "新手默认等待两个摆动后再重新评估。", tone: "info" }
    ]
  },
  {
    id: "case-breakout-pullback",
    title: "TR 突破后的 BP A2：区间外才重新找入场",
    kind: "valid",
    difficulty: 3,
    setup: "Breakout pullback A2",
    context: "前半段是交易区间，强突破后没有立即失败，随后两腿回调到突破位上方。",
    learnerTask: "区分区间内部 A2 和突破后的 BP A2。",
    verdict: "突破成功后的回调可以训练；区间内部的 A2 不做。",
    detailedRead: [
      "区间内部的每个小趋势都可能只是区间噪音，A2 没有足够优势。",
      "b7-b8 强突破并连续收在区间外，失败尝试不强，突破更可信。",
      "b9-b11 回调两腿回到突破位附近，但没有重新收回区间。",
      "这不是普通趋势 A2，而是 BP A2，目标可参考区间高度的 measured move。"
    ],
    bars: [
      { open: 101, high: 109, low: 98, close: 106, label: "TR" },
      { open: 106, high: 110, low: 100, close: 103, label: "TR" },
      { open: 103, high: 108, low: 99, close: 105, label: "TR" },
      { open: 105, high: 111, low: 100, close: 102, label: "TR" },
      { open: 102, high: 108, low: 98, close: 104, label: "TR" },
      { open: 104, high: 112, low: 103, close: 111, label: "test" },
      { open: 111, high: 126, low: 110, close: 124, label: "BO" },
      { open: 124, high: 132, low: 122, close: 130, label: "BO2" },
      { open: 130, high: 131, low: 121, close: 123, label: "L1" },
      { open: 123, high: 127, low: 120, close: 126, label: "fL1" },
      { open: 126, high: 127, low: 118, close: 121, label: "L2" },
      { open: 121, high: 132, low: 120, close: 130, label: "BP", signal: true }
    ],
    ema: [101, 102, 103, 103, 103, 104, 108, 113, 117, 119, 120, 122],
    annotations: [
      { barIndex: 2, price: 108, label: "1", text: "区间内部的小趋势不按 A2 训练。", tone: "bad" },
      { barIndex: 7, price: 130, label: "2", text: "连续强突破并收在区间外，结构开始改变。", tone: "good" },
      { barIndex: 11, price: 130, label: "3", text: "突破后的两腿回调形成 BP A2。", tone: "good" }
    ]
  },
  {
    id: "case-a2-trade-management",
    title: "A2 完整交易：entry、stop、target、breakeven stop 与 swing",
    kind: "valid",
    difficulty: 2,
    setup: "A2 lifecycle",
    context: "标准 A2 做多触发后，价格先到固定 target，再继续发展成 swing。",
    learnerTask: "指出 entry、initial stop、target、breakeven stop 和 swing portion 的逻辑。",
    verdict: "完整交易闭环：触发后先管理风险，再按目标分批或全出。",
    detailedRead: [
      "b8 是 A2 信号 K，计划入场在 b8 高点上方 1 tick，而不是收盘追价。",
      "初始止损在 b8 低点下方 1 tick；如果这个风险距离大于预期目标，交易直接跳过。",
      "基础 target 按 PDF 写法是 entry 上方 4 ticks or more；后续风险管理章节还讨论过 first target +10t for half size。",
      "如果使用 swing portion，PDF 的写法是在 first target filled 后把 balance 的 stop 移到 entry price，并尝试获得更大的 swing。",
      "如果入场单没有被下一根触发，不能追价；等待新信号或 A22。"
    ],
    bars: [
      { open: 100, high: 110, low: 98, close: 108, label: "b1" },
      { open: 108, high: 119, low: 106, close: 117, label: "b2" },
      { open: 117, high: 126, low: 115, close: 124, label: "HH" },
      { open: 124, high: 125, low: 116, close: 118, label: "L1" },
      { open: 118, high: 122, low: 113, close: 115, label: "leg1" },
      { open: 115, high: 121, low: 114, close: 119, label: "fL1" },
      { open: 119, high: 120, low: 111, close: 113, label: "L2" },
      { open: 113, high: 122, low: 112, close: 121, label: "A2", signal: true },
      { open: 121, high: 129, low: 120, close: 127, label: "entry" },
      { open: 127, high: 134, low: 126, close: 132, label: "target" },
      { open: 132, high: 137, low: 130, close: 135, label: "BE" },
      { open: 135, high: 142, low: 134, close: 140, label: "swing" }
    ],
    ema: [96, 100, 104, 108, 111, 113, 114, 115, 118, 122, 126, 130],
    annotations: [
      { barIndex: 7, price: 122, label: "1", text: "A2 信号 K：高点上方 1 tick 是计划入场，低点下方 1 tick 是初始止损。", tone: "good" },
      { barIndex: 9, price: 134, label: "2", text: "target：PDF 基础规则是 4 ticks or more；Two Strikes 示例用 +2 target。", tone: "info" },
      { barIndex: 10, price: 130, label: "3", text: "breakeven stop：first target filled 后，balance stop 移到 entry price。", tone: "warn" },
      { barIndex: 11, price: 142, label: "4", text: "swing portion：若走势支持，尝试持有到更大的 swing。", tone: "good" }
    ]
  },
  {
    id: "case-classic-a2-trendline-break",
    title: "Classic A2：第二腿先破回调趋势线，再用强信号确认",
    kind: "valid",
    difficulty: 2,
    setup: "Classic A2",
    context: "正常上升趋势中，回调先走出清楚第一腿和反弹，第二腿下破小型回调趋势线后在 EMA 附近失败。",
    learnerTask: "判断这是不是比普通二腿更干净的 classic A2，并说明为什么不是只看 EMA。",
    verdict: "可训练。它同时有趋势、二腿、回调趋势线突破、EMA 附近和强信号 K。",
    detailedRead: [
      "Classic A2 不只是数到第二腿，它要求第二腿的结构足够清楚，最好能看到回调自己的小趋势被打破。",
      "b5-b6 是第一腿，b7 是 fL1，b8-b9 是第二腿，并且第二腿低点靠近 EMA。",
      "b9 先向下刺破回调趋势线但没有获得跟随，b10 强阳收盘说明第二次向下尝试失败。",
      "这种样本比 Doji/重叠 A2 更适合新手，因为它能训练“结构先清楚，信号再执行”。"
    ],
    bars: [
      { open: 101, high: 112, low: 99, close: 110, label: "b1" },
      { open: 110, high: 121, low: 108, close: 119, label: "b2" },
      { open: 119, high: 130, low: 117, close: 128, label: "b3" },
      { open: 128, high: 136, low: 126, close: 134, label: "HH" },
      { open: 134, high: 135, low: 126, close: 128, label: "L1" },
      { open: 128, high: 130, low: 121, close: 123, label: "leg1" },
      { open: 123, high: 130, low: 122, close: 128, label: "fL1" },
      { open: 128, high: 129, low: 120, close: 122, label: "leg2" },
      { open: 122, high: 124, low: 116, close: 118, label: "L2" },
      { open: 118, high: 129, low: 117, close: 127, label: "A2", signal: true },
      { open: 127, high: 136, low: 126, close: 134, label: "entry" },
      { open: 134, high: 141, low: 132, close: 139, label: "target" }
    ],
    ema: [97, 101, 106, 111, 115, 118, 120, 121, 121, 122, 125, 129],
    annotations: [
      { barIndex: 6, price: 128, label: "1", text: "第一腿后反弹失败，fL1 让二腿结构成立。", tone: "info" },
      { barIndex: 8, price: 118, label: "2", text: "第二腿到 EMA 附近，并刺破回调小趋势。", tone: "good" },
      { barIndex: 9, price: 127, label: "3", text: "强阳信号 K 表示第二次向下尝试失败。", tone: "good" }
    ]
  },
  {
    id: "case-a22-second-entry",
    title: "A22：第一信号太弱，第二入场才合格",
    kind: "valid",
    difficulty: 3,
    setup: "A22 long",
    context: "两腿回调到 EMA 后，第一根 A2 信号是小 Doji 且重叠多，没有触发出优势；随后出现更强的第二入场。",
    learnerTask: "说明为什么第一根不做，为什么后面的 A22 可以重新评估。",
    verdict: "A22 可训练。第一信号弱或止损过宽时，等待第二入场比硬做更好。",
    detailedRead: [
      "A22 的前提不是“错过了就补票”，而是第一根 A2 信号质量不足、重叠太多或止损过宽。",
      "b9 的结构位置可以，但 K 线本身是弱信号；如果直接做，风险由弱信号定义，交易质量低。",
      "b10 没有形成强跟随，说明第一入场没有证明自己；b11 强阳线突破前高，才给出第二入场。",
      "A22 仍然必须顺势、靠近 EMA，并且新信号 K 的 stop 不能大于合理目标。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "b1" },
      { open: 109, high: 120, low: 107, close: 118, label: "b2" },
      { open: 118, high: 128, low: 116, close: 126, label: "HH" },
      { open: 126, high: 127, low: 118, close: 120, label: "L1" },
      { open: 120, high: 122, low: 114, close: 116, label: "leg1" },
      { open: 116, high: 123, low: 115, close: 121, label: "fL1" },
      { open: 121, high: 122, low: 113, close: 115, label: "leg2" },
      { open: 115, high: 118, low: 112, close: 114, label: "L2" },
      { open: 114, high: 119, low: 112, close: 115, label: "A2?", signal: true },
      { open: 115, high: 118, low: 111, close: 113, label: "no" },
      { open: 113, high: 123, low: 112, close: 121, label: "A22", signal: true },
      { open: 121, high: 131, low: 120, close: 129, label: "go" }
    ],
    ema: [96, 100, 104, 108, 111, 113, 114, 114, 114, 114, 116, 120],
    annotations: [
      { barIndex: 8, price: 115, label: "1", text: "第一根位置可以，但 Doji/重叠导致信号质量不足。", tone: "warn" },
      { barIndex: 9, price: 113, label: "2", text: "没有强跟随，不追、不补、不降低标准。", tone: "bad" },
      { barIndex: 10, price: 121, label: "3", text: "A22 用更强信号重新定义 entry 与 stop。", tone: "good" }
    ]
  },
  {
    id: "case-clean-a2-short",
    title: "标准 A2 做空：下降趋势中的二腿反弹失败",
    kind: "valid",
    difficulty: 2,
    setup: "A2 short",
    context: "E-mini 5 分钟图形成 LL-LH，EMA 下行，价格反弹两腿到 EMA 附近后出现强阴信号 K。",
    learnerTask: "用做多 A2 的镜像规则，指出 H1、fH1、H2/fH2、Sell Stop、初始止损和 target。",
    verdict: "可训练。做空 A2 是做多 A2 的完整镜像，不是凭感觉反向。",
    detailedRead: [
      "做空 A2 的背景必须是下降趋势：更低低点、更低高点，EMA 下行或价格在 EMA 下方被压制。",
      "从低点反弹，第一次向上反转尝试失败是 fH1，随后第二次向上尝试也失败，才是做空 A2 的机制。",
      "b9 靠近 EMA 后强阴收盘，说明多头第二次推高失败。",
      "执行镜像：在信号 K 低点下方 1 tick 放 Sell Stop，初始止损在信号 K 高点上方 1 tick。"
    ],
    bars: [
      { open: 140, high: 142, low: 128, close: 130, label: "b1" },
      { open: 130, high: 132, low: 118, close: 120, label: "b2" },
      { open: 120, high: 123, low: 110, close: 112, label: "LL" },
      { open: 112, high: 121, low: 111, close: 119, label: "H1" },
      { open: 119, high: 126, low: 118, close: 124, label: "leg1" },
      { open: 124, high: 125, low: 117, close: 119, label: "fH1" },
      { open: 119, high: 128, low: 118, close: 126, label: "leg2" },
      { open: 126, high: 131, low: 124, close: 129, label: "H2" },
      { open: 129, high: 130, low: 119, close: 121, label: "A2", signal: true },
      { open: 121, high: 122, low: 111, close: 113, label: "entry" },
      { open: 113, high: 115, low: 104, close: 106, label: "target" },
      { open: 106, high: 109, low: 99, close: 101, label: "swing" }
    ],
    ema: [146, 141, 136, 132, 130, 128, 127, 127, 126, 123, 119, 114],
    annotations: [
      { barIndex: 5, price: 119, label: "1", text: "第一次向上反转失败，形成 fH1。", tone: "info" },
      { barIndex: 7, price: 129, label: "2", text: "第二腿反弹到 EMA 附近，位置合格。", tone: "good" },
      { barIndex: 8, price: 121, label: "3", text: "强阴信号 K，低点下方 1 tick 才触发做空。", tone: "good" }
    ]
  },
  {
    id: "case-trend-termination-weak-a2",
    title: "趋势终结风险：弱反转后再出现弱 A2 要降级",
    kind: "reversal-risk",
    difficulty: 3,
    setup: "Weak A2 near trend end",
    context: "上升趋势后期出现双顶、强度下降和 TTR，随后给出一个弱 A2 做多候选。",
    learnerTask: "判断它是继续做 A2，还是趋势终结风险下的跳过样本。",
    verdict: "跳过。趋势后期的弱反转 + 弱 A2 是书中提示离场或停手的组合。",
    detailedRead: [
      "A2 是顺势 setup，但前提是趋势仍有优势。趋势后期若出现双顶、强反向 K、TTR 或连续弱信号，要先保护利润。",
      "b4-b7 推高无力，b8 接近前高失败，形成双顶风险。",
      "b9-b11 的 A2 候选出现在重叠区域，信号 K 小且没有清楚控制权。",
      "这种图的训练动作不是硬找入场，而是识别趋势终结风险：已持仓者考虑退出，未持仓者等待新结构。"
    ],
    bars: [
      { open: 100, high: 112, low: 98, close: 110, label: "b1" },
      { open: 110, high: 122, low: 108, close: 120, label: "b2" },
      { open: 120, high: 132, low: 118, close: 130, label: "HH" },
      { open: 130, high: 136, low: 127, close: 134, label: "weak" },
      { open: 134, high: 137, low: 129, close: 132, label: "DT?" },
      { open: 132, high: 135, low: 126, close: 128, label: "sell" },
      { open: 128, high: 133, low: 125, close: 131, label: "pb" },
      { open: 131, high: 136, low: 128, close: 130, label: "DT" },
      { open: 130, high: 132, low: 123, close: 125, label: "L1" },
      { open: 125, high: 129, low: 122, close: 127, label: "fL1" },
      { open: 127, high: 128, low: 121, close: 123, label: "L2" },
      { open: 123, high: 129, low: 122, close: 126, label: "weak", signal: true }
    ],
    ema: [97, 101, 106, 112, 118, 122, 125, 127, 127, 126, 125, 125],
    annotations: [
      { barIndex: 7, price: 130, label: "1", text: "双顶/推高失败提示趋势优势下降。", tone: "warn" },
      { barIndex: 10, price: 123, label: "2", text: "二腿存在，但发生在重叠和弱势环境中。", tone: "bad" },
      { barIndex: 11, price: 126, label: "3", text: "弱信号 A2 不负责延续；训练动作是停手或退出。", tone: "bad" }
    ]
  },
  {
    id: "case-opening-first-a2",
    title: "开盘策略：新手等待第一个两腿回调",
    kind: "valid",
    difficulty: 2,
    setup: "Opening first A2",
    context: "RTH 开盘前几根 K 线方向很乱，随后初始趋势向上建立，第一次两腿回调到 EMA 给出 A2。",
    learnerTask: "说明为什么开盘先按 trading range / opening range 思考，保守交易者等待第一个清楚 2L pullback。",
    verdict: "可训练。新手不抢 1Rev/1PB，等待初始趋势后的第一个二腿回调。",
    detailedRead: [
      "PDF 说 first bar 可以当作 trading range，开盘可能形成 opening range、fBO、BP、1Rev 或 1PB，边界很多。",
      "b1-b4 是 opening range / 观察区：虽然有方向，但还没有足够结构确认，不能因为怕错过而追。",
      "b5-b7 建立初始上升趋势，随后 b8-b11 给出两腿回调到 EMA。",
      "b12 强阳信号 K 才是新手该训练的入场点：entry、stop、target 和 swing plan 都能在入场前写清楚。"
    ],
    bars: [
      { open: 100, high: 106, low: 96, close: 102, label: "open" },
      { open: 102, high: 107, low: 99, close: 101, label: "obs" },
      { open: 101, high: 109, low: 100, close: 108, label: "obs" },
      { open: 108, high: 111, low: 104, close: 106, label: "obs" },
      { open: 106, high: 116, low: 105, close: 114, label: "trend" },
      { open: 114, high: 124, low: 112, close: 122, label: "HH" },
      { open: 122, high: 130, low: 120, close: 128, label: "HH" },
      { open: 128, high: 129, low: 120, close: 122, label: "L1" },
      { open: 122, high: 126, low: 117, close: 119, label: "leg1" },
      { open: 119, high: 126, low: 118, close: 124, label: "fL1" },
      { open: 124, high: 125, low: 116, close: 118, label: "L2" },
      { open: 118, high: 128, low: 117, close: 126, label: "A2", signal: true }
    ],
    ema: [100, 101, 102, 103, 106, 110, 115, 118, 119, 120, 120, 122],
    annotations: [
      { barIndex: 3, price: 106, label: "1", text: "开盘先按 trading range / opening range 思考，不抢复杂 1Rev/1PB。", tone: "warn" },
      { barIndex: 6, price: 128, label: "2", text: "初始趋势建立后，才开始等待第一组两腿回调。", tone: "info" },
      { barIndex: 11, price: 126, label: "3", text: "第一个清楚 A2：新手真正可训练的开盘入场。", tone: "good" }
    ]
  },
  {
    id: "case-fa2-reversal-boundary",
    title: "fA2 反手边界：强反向 K 可以提示新方向两腿，但新手先等",
    kind: "reversal-risk",
    difficulty: 3,
    setup: "fA2 reversal boundary",
    context: "做多 A2 触发后立刻被强阴线止损，后续没有进入 BW，而是形成清楚的新方向两腿。",
    learnerTask: "区分“理解 fA2 可反手”和“新手立刻反手”的边界。",
    verdict: "进阶可研究，新手默认等待。只有强反向 K、无 BW/OL、后续跟随清楚时，才把 fA2 当新方向线索。",
    detailedRead: [
      "fA2 代表原趋势延续尝试失败。它可能给出新方向两腿，但也可能只是进入 TR。",
      "b6 的 A2 做多触发后，b7 强阴跌破信号 K 低点，并且收盘靠近低点，这是比普通止损更强的信息。",
      "关键边界是 b8-b10：如果这里变成 BW/OL，新手继续等待；如果走出清楚两腿，才说明新方向可能成立。",
      "训练规则仍然保守：记录 fA2，等待两个摆动或新方向 A2，而不是止损瞬间报复性反手。"
    ],
    bars: [
      { open: 100, high: 112, low: 98, close: 110, label: "up" },
      { open: 110, high: 122, low: 108, close: 120, label: "HH" },
      { open: 120, high: 123, low: 114, close: 116, label: "L1" },
      { open: 116, high: 121, low: 115, close: 119, label: "fL1" },
      { open: 119, high: 120, low: 112, close: 114, label: "L2" },
      { open: 114, high: 122, low: 113, close: 121, label: "A2", signal: true },
      { open: 121, high: 122, low: 108, close: 110, label: "fA2" },
      { open: 110, high: 112, low: 100, close: 102, label: "leg1" },
      { open: 102, high: 108, low: 101, close: 106, label: "pb" },
      { open: 106, high: 107, low: 96, close: 98, label: "leg2" },
      { open: 98, high: 104, low: 97, close: 101, label: "wait" },
      { open: 101, high: 103, low: 94, close: 96, label: "new?" }
    ],
    ema: [96, 101, 105, 108, 110, 112, 111, 108, 106, 103, 101, 99],
    annotations: [
      { barIndex: 5, price: 121, label: "1", text: "A2 触发不等于安全；仍需后续跟随。", tone: "info" },
      { barIndex: 6, price: 110, label: "2", text: "强阴跌破止损，fA2 给出趋势终结/新方向线索。", tone: "bad" },
      { barIndex: 9, price: 98, label: "3", text: "只有后续走出两腿且无 BW/OL，才研究新方向，不是马上反手。", tone: "warn" }
    ]
  },
  {
    id: "case-hard-soft-trend-filter",
    title: "Hard/Soft Trend：不是所有趋势都按普通 A2 处理",
    kind: "wait",
    difficulty: 3,
    setup: "Trend mode filter",
    context: "左侧是 hard trend，几乎不给二腿；右侧变成 soft trend，重叠增加但 fL2 更常见。",
    learnerTask: "判断新手应该如何处理 hard trend 里的 L1/H1 和 soft trend 里的重叠 A2。",
    verdict: "训练阶段只做清楚 A2。hard trend 的 L1/H1 和 soft trend 的重叠信号都先记录，不降标准。",
    detailedRead: [
      "PDF 说明 hard trend 中可能 H1/L1 就有效，但新手应先只做 A2，因为单腿信号容易让你追在最差位置。",
      "soft trend 中很多 fL2 会有效，但 K 线重叠更多，经验不足时很难区分可交易重叠和 BW 噪音。",
      "本案例的训练目标不是交易更多，而是识别市场模式后保持 A2 标准。",
      "如果模式超出普通 A2，最好的动作是标注、回放、收集样本，而不是实盘试错。"
    ],
    bars: [
      { open: 100, high: 111, low: 99, close: 110, label: "hard" },
      { open: 110, high: 122, low: 109, close: 121, label: "H" },
      { open: 121, high: 133, low: 120, close: 132, label: "H" },
      { open: 132, high: 143, low: 131, close: 142, label: "H" },
      { open: 142, high: 144, low: 137, close: 139, label: "L1" },
      { open: 139, high: 148, low: 138, close: 146, label: "works" },
      { open: 146, high: 151, low: 142, close: 145, label: "soft" },
      { open: 145, high: 150, low: 140, close: 148, label: "OL" },
      { open: 148, high: 151, low: 143, close: 145, label: "L1" },
      { open: 145, high: 149, low: 141, close: 147, label: "fL1" },
      { open: 147, high: 148, low: 140, close: 142, label: "L2" },
      { open: 142, high: 150, low: 141, close: 148, label: "A2?", signal: true }
    ],
    ema: [96, 101, 107, 114, 121, 128, 134, 138, 141, 143, 143, 144],
    annotations: [
      { barIndex: 4, price: 139, label: "1", text: "hard trend 中 L1 可能有效，但不是新手 A2 主训练对象。", tone: "warn" },
      { barIndex: 7, price: 148, label: "2", text: "soft trend 重叠增加，不能把所有 fL2 都当高质量 A2。", tone: "warn" },
      { barIndex: 11, price: 148, label: "3", text: "新手只接受清楚 A2；模式复杂就记录，不实盘试错。", tone: "info" }
    ]
  },
  {
    id: "case-es-tick-calculation",
    title: "Emini 数字执行：entry、stop、target 用书中的 tick 语言算清楚",
    kind: "valid",
    difficulty: 1,
    setup: "Tick execution",
    context: "信号 K 用相对单位表达：高点为 H，低点为 L；PDF 的规则是高点上方 1 tick 入场，低点下方 1 tick 止损。",
    learnerTask: "用书中的 tick / point 语言写出 Buy Stop、初始止损、4 ticks 目标、以及 stop 不能大于目标的判断。",
    verdict: "做多 entry = H + 1t，stop = L - 1t，基础 target 至少 entry + 4t；若 stop 距离大于目标空间则跳过。",
    detailedRead: [
      "PDF 明确使用的是 tick / t / points 的交易语言：long entry 是信号 K 上方 1 tick，stop 是信号 K 下方 1 tick。",
      "书中还给出基础目标语言：target 至少 4 ticks 或更多；Two Strikes 示例使用 -1.5 stop 和 +2 target。",
      "因此 Coach 不应把外部合约规格写成 PDF 内容。这里训练的是相对规则：H + 1t、L - 1t、目标至少 +4t 或按结构/R 计算。",
      "如果 stop 大于目标，PDF 明确说 stop should not be larger than target，这笔交易必须跳过或需要更大 EV 的结构依据。"
    ],
    bars: [
      { open: 16, high: 22, low: 14, close: 21, label: "b1" },
      { open: 21, high: 28, low: 20, close: 27, label: "b2" },
      { open: 27, high: 36, low: 25, close: 34, label: "HH" },
      { open: 34, high: 35, low: 29, close: 30, label: "L1" },
      { open: 30, high: 32, low: 26, close: 28, label: "leg1" },
      { open: 28, high: 32, low: 27, close: 31, label: "fL1" },
      { open: 31, high: 32, low: 28, close: 29, label: "L2" },
      { open: 29, high: 34, low: 28, close: 33, label: "A2 H/L", signal: true },
      { open: 35, high: 42, low: 34, close: 40, label: "entry" },
      { open: 40, high: 44, low: 38, close: 42, label: "+4t" },
      { open: 42, high: 45, low: 39, close: 41, label: "BE" },
      { open: 41, high: 43, low: 36, close: 38, label: "pb" }
    ],
    ema: [13, 16, 20, 23, 25, 27, 28, 29, 32, 35, 37, 38],
    annotations: [
      { barIndex: 7, price: 33, label: "1", text: "信号 K 定义 H 与 L；交易计划先写清楚，不能收盘追价。", tone: "good" },
      { barIndex: 8, price: 40, label: "2", text: "做多触发是 H + 1t；初始止损是 L - 1t。", tone: "warn" },
      { barIndex: 9, price: 42, label: "3", text: "目标至少 +4t；如果 stop 大于 target，必须跳过。", tone: "info" }
    ]
  },
  {
    id: "case-order-not-triggered",
    title: "未触发不是错过：Buy Stop 没成交就不能追价",
    kind: "wait",
    difficulty: 2,
    setup: "Order discipline",
    context: "A2 候选信号 K 位置合格，但下一根没有突破信号 K 高点，随后价格横向重叠。",
    learnerTask: "判断是否能在收盘后市价追入，还是取消订单并等待 A22 或新结构。",
    verdict: "不追价。PDF 的执行是信号 K 外 1 tick 触发；未触发就没有交易。",
    detailedRead: [
      "A2 计划写在信号 K 收盘后：Buy Stop 在信号 K 高点上方 1 tick，initial stop 在低点下方 1 tick。",
      "下一根没有突破高点，说明市场没有确认信号 K 的方向承诺。此时收盘追入会把可复盘规则改成感觉交易。",
      "后续两根 K 与信号 K 重叠，风险已经从 clean A2 退化为 OL/BW。正确动作是取消旧计划。",
      "如果后面出现更清楚的强信号，可以按 A22 重新定义 entry 与 stop；不能沿用旧信号 K 的计划。"
    ],
    bars: [
      { open: 100, high: 111, low: 98, close: 109, label: "b1" },
      { open: 109, high: 121, low: 108, close: 119, label: "b2" },
      { open: 119, high: 130, low: 117, close: 128, label: "HH" },
      { open: 128, high: 129, low: 121, close: 123, label: "L1" },
      { open: 123, high: 126, low: 118, close: 120, label: "leg1" },
      { open: 120, high: 127, low: 119, close: 125, label: "fL1" },
      { open: 125, high: 126, low: 117, close: 119, label: "L2" },
      { open: 119, high: 128, low: 118, close: 126, label: "A2", signal: true },
      { open: 126, high: 127, low: 121, close: 123, label: "no trig" },
      { open: 123, high: 127, low: 120, close: 125, label: "OL" },
      { open: 125, high: 128, low: 121, close: 122, label: "OL" },
      { open: 122, high: 132, low: 121, close: 130, label: "A22?" }
    ],
    ema: [97, 101, 106, 111, 115, 118, 120, 121, 122, 122, 123, 125],
    annotations: [
      { barIndex: 7, price: 126, label: "1", text: "A2 候选只生成计划：高点上方 1t 才触发。", tone: "info" },
      { barIndex: 8, price: 123, label: "2", text: "下一根没有突破信号 K 高点，旧订单不成立。", tone: "warn" },
      { barIndex: 11, price: 130, label: "3", text: "若要交易，只能等待新信号重新定义 entry/stop。", tone: "good" }
    ]
  },
  {
    id: "case-mae-swing-quality",
    title: "MAE 与 swing 质量：触发后深回撤会降低 swing 期望",
    kind: "wait",
    difficulty: 3,
    setup: "MAE / Swing quality",
    context: "A2 做多触发后没有立刻走远，而是大幅回撤接近 entry，随后才勉强反弹。",
    learnerTask: "判断这是否仍是高质量 swing，还是应该按 MAE 与 breakeven stop 逻辑降级。",
    verdict: "降级。PDF 的 MAE 统计提示：大 swing 入口通常触发后回撤很小，超过 4t 的回撤质量明显下降。",
    detailedRead: [
      "PDF 的 MAE 章节不是把 4t 当机械止损，而是用数据说明：真正能 swing 的 entry 通常触发后不会深度回撤。",
      "本图 A2 触发后，价格没有快速远离 entry，而是回撤接近入场价，说明 entry bar 没有强 follow-through。",
      "如果 first target 已经填单，balance stop 移到 entry price；如果还没到 first target，则不能随意放宽止损。",
      "训练重点是记录触发后最大不利波动：0t-4t 与超过 4t 的后续表现要分开统计。"
    ],
    bars: [
      { open: 100, high: 111, low: 99, close: 109, label: "b1" },
      { open: 109, high: 121, low: 108, close: 119, label: "b2" },
      { open: 119, high: 130, low: 117, close: 128, label: "HH" },
      { open: 128, high: 129, low: 121, close: 123, label: "L1" },
      { open: 123, high: 126, low: 118, close: 120, label: "leg1" },
      { open: 120, high: 127, low: 119, close: 125, label: "fL1" },
      { open: 125, high: 126, low: 117, close: 119, label: "L2" },
      { open: 119, high: 128, low: 118, close: 127, label: "A2", signal: true },
      { open: 128, high: 132, low: 124, close: 126, label: "entry" },
      { open: 126, high: 129, low: 122, close: 124, label: "MAE" },
      { open: 124, high: 131, low: 123, close: 129, label: "weak" },
      { open: 129, high: 133, low: 126, close: 128, label: "chop" }
    ],
    ema: [97, 101, 106, 111, 115, 118, 120, 121, 123, 124, 125, 126],
    annotations: [
      { barIndex: 8, price: 126, label: "1", text: "触发后没有快速远离 entry，follow-through 弱。", tone: "warn" },
      { barIndex: 9, price: 124, label: "2", text: "记录 MAE；深回撤会降低 swing 质量。", tone: "bad" },
      { barIndex: 10, price: 129, label: "3", text: "后续反弹不等于原始 entry 是高质量 swing。", tone: "info" }
    ]
  },
  {
    id: "case-channel-vs-a2",
    title: "Channel / Sloping BW：有方向不等于适合普通 A2",
    kind: "skip",
    difficulty: 3,
    setup: "Channel filter",
    context: "价格整体向上漂移，但每根 K 都重叠、有长影线，信号 K 与 entry bar 继续重叠。",
    learnerTask: "判断这是正常趋势 A2，还是 channel / sloping BW，需要等待清楚突破后再做。",
    verdict: "跳过普通 A2。PDF 把 channel 视为高度重叠的漂移结构，固定止损和信号 K 突破会失去优势。",
    detailedRead: [
      "Channel 与普通 trend 的区别不在是否有方向，而在 inter-bar overlap 是否严重。这里每个 swing 只推进一点，回撤却足够深。",
      "PDF 说当 signal bar、entry bar 和后续两根重叠时，要警惕已经进入 channel mode。",
      "在 channel 中，普通 A2 触发很容易被深 pullback 扫掉；新手训练阶段应把它标为结构过滤，而不是硬做。",
      "正确动作是等待 channel break 后，出现不再重叠的 pullback，再评估 with-trend entry。"
    ],
    bars: [
      { open: 100, high: 108, low: 98, close: 105, label: "ch" },
      { open: 105, high: 111, low: 101, close: 107, label: "OL" },
      { open: 107, high: 113, low: 103, close: 110, label: "OL" },
      { open: 110, high: 115, low: 106, close: 108, label: "L1" },
      { open: 108, high: 116, low: 105, close: 112, label: "fL1" },
      { open: 112, high: 117, low: 107, close: 109, label: "L2" },
      { open: 109, high: 118, low: 108, close: 114, label: "A2?", signal: true },
      { open: 114, high: 119, low: 111, close: 113, label: "OL" },
      { open: 113, high: 120, low: 110, close: 116, label: "OL" },
      { open: 116, high: 121, low: 112, close: 115, label: "OL" },
      { open: 115, high: 126, low: 114, close: 124, label: "BO" },
      { open: 124, high: 128, low: 120, close: 126, label: "wait" }
    ],
    ema: [99, 101, 103, 105, 107, 109, 111, 112, 114, 115, 117, 120],
    annotations: [
      { barIndex: 2, price: 110, label: "1", text: "整体有方向，但 K 线之间高度重叠。", tone: "warn" },
      { barIndex: 6, price: 114, label: "2", text: "A2 外观存在，但处在 channel / sloping BW 中。", tone: "bad" },
      { barIndex: 10, price: 124, label: "3", text: "等待 channel break 后的新 pullback，而不是在重叠中硬做。", tone: "info" }
    ]
  },
  {
    id: "case-exit-signals",
    title: "A2 持仓离场：target 之外还要识别趋势终结",
    kind: "reversal-risk",
    difficulty: 3,
    setup: "Exit management",
    context: "A2 做多成功到达 first target 后，剩余仓位继续持有，但后面出现连续 Doji、climax bar 和 TTR。",
    learnerTask: "判断 swing portion 是否还能机械死拿，还是应根据趋势终结信号退出或收紧。",
    verdict: "不能死拿。PDF 提到 TTR、连续 Doji、trendline break、climax/undeserved gain 都是退出线索。",
    detailedRead: [
      "A2 成功到 first target 后，balance stop 可移到 entry price，剩余仓位尝试 swing。",
      "但 swing 不是无条件持有。PDF 的退出章节强调：趋势变弱、连续 Doji、TTR、趋势线被明显突破、climax/undeserved gain 都可能是退出信号。",
      "本图后半段 K 线变小、重叠增加，并出现一根突然的强推 climax；这类意外收益常是候选离场区域。",
      "新手训练动作：把 fixed target、breakeven stop、trend termination exit 分开记录，不能把没有离场计划的死拿叫 swing。"
    ],
    bars: [
      { open: 100, high: 110, low: 98, close: 108, label: "b1" },
      { open: 108, high: 119, low: 106, close: 117, label: "b2" },
      { open: 117, high: 128, low: 115, close: 126, label: "HH" },
      { open: 126, high: 127, low: 118, close: 120, label: "L1" },
      { open: 120, high: 123, low: 115, close: 117, label: "leg1" },
      { open: 117, high: 124, low: 116, close: 122, label: "fL1" },
      { open: 122, high: 123, low: 114, close: 116, label: "L2" },
      { open: 116, high: 126, low: 115, close: 124, label: "A2", signal: true },
      { open: 124, high: 132, low: 123, close: 130, label: "entry" },
      { open: 130, high: 138, low: 129, close: 136, label: "target" },
      { open: 136, high: 142, low: 135, close: 140, label: "swing" },
      { open: 140, high: 144, low: 138, close: 141, label: "doji" },
      { open: 141, high: 151, low: 140, close: 150, label: "climax" },
      { open: 150, high: 152, low: 145, close: 146, label: "TTR" }
    ],
    ema: [96, 100, 105, 109, 112, 115, 116, 118, 122, 127, 132, 136, 140, 143],
    annotations: [
      { barIndex: 9, price: 136, label: "1", text: "first target 后，balance stop 可移到 entry price。", tone: "good" },
      { barIndex: 11, price: 141, label: "2", text: "K 线变小和 Doji 增多，趋势质量下降。", tone: "warn" },
      { barIndex: 12, price: 150, label: "3", text: "climax / undeserved gain 是候选退出线索。", tone: "bad" }
    ]
  }
];

export const lessons: LessonUnit[] = [
  {
    id: "signal-bar",
    module: "bar",
    title: "信号 K 线不是形状，是上下文里的承诺",
    subtitle: "为什么同样是阳线，有的可以入场，有的必须跳过",
    masteryGoal: "看到一根候选信号 K 时，能用 5 个维度判断它是否有资格触发交易。",
    whyItMatters: "新手最常见的亏损不是方向完全错，而是用弱 K 线进入了正确方向，结果被 1tf 或 5tf 扫掉。",
    explanation: [
      "信号 K 线的作用是给你一个可以定义风险的触发点。它必须让你知道：如果下一根突破它，说明一方真的接管了短期控制。",
      "强信号 K 通常有明确实体、收盘靠近高低点、与前一根重叠少，并且出现在 EMA、趋势线、区间边界等有意义的位置。",
      "Doji、长影线、重叠多、实体过大或过小，都说明这根 K 不能清楚表达控制权。它也许会成功，但不适合新手训练。",
      "书中说顺势 Doji 有时有效，这不是让你随便做 Doji，而是提醒你：上下文能提高信号质量，但不能替代信号质量。"
    ],
    decisionChecklist: [
      "这根 K 的收盘是否靠近入场方向的极端？",
      "它与前一到两根 K 的重叠是否很少？",
      "如果按另一端止损，风险是否小于或等于目标？",
      "它是否出现在 EMA、趋势线、突破位等有意义位置？",
      "它是否在 TTR/BW 中？如果是，默认跳过。"
    ],
    commonTraps: [
      "把大 K 线误认为强信号，忽略止损过宽。",
      "看到阳线就做多，没看它是否收在高点附近。",
      "在 BW 中挑一根稍强的 K 当信号。",
      "用市价追入，而不是等高低点外 1 tick 触发。"
    ],
    sourceNote: "来自 Price Action Basics I：bar selection 是第一课，well formed bars 和 context 必须一起看。",
    sourceAnchors: anchors("signalBarSelection", "ttrBwSkip", "orderDiscipline"),
    caseIds: ["case-doji-overlap", "case-bw-trap"],
    examIds: ["exam-signal-1", "exam-signal-2"]
  },
  {
    id: "a2-core",
    module: "a2",
    title: "A2 是两次失败反转，不是“碰到 EMA 就买”",
    subtitle: "把 A2 从名词拆成可执行的识别流程",
    masteryGoal: "能在图上指出 Leg1、fL1、Leg2、fL2、信号 K、入场位和失效点。",
    whyItMatters: "A2 是 Cadaver 建议新手最先只练的 setup，因为它训练你顺势、等待和定义风险。",
    explanation: [
      "做多 A2 的背景必须是上升趋势。价格从高点回落，第一次试图向下反转失败，随后第二次试图向下反转也失败，这就是趋势延续的依据。",
      "“二腿回调到 EMA”只是外观描述；“两次失败的反转尝试”才是机制描述。你要训练的是读懂为什么空头没有接管。",
      "合格 A2 同时满足四层：趋势清楚、两腿能数、信号 K 合格、没有自动过滤条件。",
      "必要条件只有四个：趋势背景、两腿回调、靠近 EMA/趋势线、可执行信号 K。更高时间级别同向、强趋势 K、无重叠、目标空间大是加分项，不是定义本身。",
      "A2 的执行很机械：做多在信号 K 高点上方 1 tick，止损在低点下方 1 tick。机械执行让你复盘时能判断 setup，而不是判断临场感觉。",
      "识别顺序必须固定：先问是不是趋势，再问是不是两腿，再问是不是靠近 EMA，最后才看信号 K。顺序反过来，新手会被漂亮 K 线骗进去。"
    ],
    decisionChecklist: [
      "1. 先判市场状态：是否是趋势，而不是 TR/TTR？",
      "2. 再数序列：是否能标出 Leg1、fL1、Leg2、fL2？只有一腿则不是 A2。",
      "3. 再看位置：第二腿末端是否靠近 EMA/趋势线？离太远则等待。",
      "4. 再看信号 K：是否强收盘、重叠少、止损合理？",
      "5. 最后排除过滤项：BW/OL、超大 K、开盘噪音、连续 fA2、收盘前低流动性。"
    ],
    commonTraps: [
      "单腿回调后看到强 K 就当 A2，这是分类错误。",
      "只要碰 EMA 就入场，不确认两腿和趋势。",
      "A2 离 EMA 很远还追，忽略第三推风险。",
      "先看信号 K 再反推结构，容易把任何漂亮 K 都叫 A2。",
      "做空 A2 时没有完整镜像规则，只凭感觉反向。"
    ],
    sourceNote: "来自 Glossary 与 Four trades off nine transitions：A2 是 near EMA 的第二次回调结束尝试。",
    sourceAnchors: anchors("a2Definition", "a2FarFromEma", "tickExecution", "hardSoftTrendExceptions"),
    caseIds: ["case-clean-a2-long", "case-one-leg-not-a2", "case-far-from-ema"],
    examIds: ["exam-a2-1", "exam-a2-2", "exam-a2-3", "exam-execution-1"]
  },
  {
    id: "ttr-bw",
    module: "structure",
    title: "TTR/BW 的核心动作是停手",
    subtitle: "不是每个图表都值得交易，识别不交易状态本身就是能力",
    masteryGoal: "能区分趋势回调和横向重叠，并知道何时等待突破或 BP。",
    whyItMatters: "TTR/BW 会让几乎所有信号看起来都快要成功，却反复扫两端止损。",
    explanation: [
      "TTR 是极窄交易区间，价格在小范围内来回反转。BW 是局部形态，三根以上重叠横向 K，至少一根 Doji。",
      "它们共同表达的是：市场没有给出方向优势。此时你的任务不是找最像信号的那根 K，而是承认没有信号。",
      "区间内部的小 A2 经常失败，因为区间边界会拦截延续。有效突破后，回调形成的 BP 才重新有训练价值。",
      "等待不是消极，它是在避免把随机波动训练成坏习惯。"
    ],
    decisionChecklist: [
      "最近多根 K 是否高度重叠并来回反转？",
      "是否有多个 Doji 和长影线？",
      "突破是否连续收在区间外，还是马上回到区间内？",
      "如果突破成功，是否出现回调但不重新进入区间？",
      "如果没有明确突破，是否能接受今天不做 A2？"
    ],
    commonTraps: [
      "在 BW 中挑一根最强 K 入场。",
      "把区间内部的小趋势当趋势日。",
      "突破第一根就追，不等失败或 BP。",
      "连续亏损后仍认为下一次一定突破。"
    ],
    sourceNote: "来自 Setup Chart 与 Trading ranges：TR 内部优先等突破失败或成功后的 BP。",
    sourceAnchors: anchors("ttrBwSkip", "breakoutPullback", "marketStructureFilter"),
    caseIds: ["case-bw-trap", "case-breakout-pullback"],
    examIds: ["exam-structure-1", "exam-structure-2"]
  },
  {
    id: "a2-quality-filter",
    module: "a2",
    title: "A2 质量过滤：clean A2、软趋势例外和必须跳过的样本",
    subtitle: "学会拒绝模糊 A2，比多记一个形态更重要",
    masteryGoal: "能区分 clean A2、可等待 A22 的弱 A2、远离 EMA 的假 A2、BW/TTR 内部的无优势 A2。",
    whyItMatters: "PDF 中反复强调，很多 A2 失败不是概念错，而是信号发生在错误质量区：Doji、重叠、离 EMA 太远或趋势已经衰竭。",
    explanation: [
      "Clean A2 的核心是清楚：趋势清楚、二腿清楚、第二腿靠近 EMA/趋势线、信号 K 清楚。只要其中一个维度模糊，新手就应该降级。",
      "Classic A2 常见特征是第二腿能突破或刺破回调小趋势线，说明 pullback 自己的方向已经走到末端，然后强信号 K 表示回调方向失败。",
      "Doji/重叠 A2 不是永远不能成功，但它不适合训练。书中提到软趋势日可能每个重叠小信号都像 A2，这是经验交易者语境；新手默认等待更清楚的信号。",
      "远离 EMA 的第二次尝试也要小心：它可能只是强趋势里的浅回调，后面还有第三推或 W pullback。A2 训练阶段，位置不合格就等待。",
      "质量过滤的目标不是预测哪笔会赚钱，而是让你的样本库只包含可复盘、可重复、风险明确的交易。"
    ],
    decisionChecklist: [
      "二腿是否清楚到不用事后解释？",
      "第二腿是否靠近 EMA、趋势线或突破位？",
      "是否能看到回调小趋势线被突破或失效？",
      "信号 K 是否不是 Doji、重叠不大、止损不过宽？",
      "如果这是软趋势日，自己是否已经有足够经验处理重叠信号？没有则跳过。"
    ],
    commonTraps: [
      "把所有二腿都当 clean A2，不区分信号质量。",
      "用“书中说 Doji 有时有效”给低质量入场找理由。",
      "远离 EMA 也硬做，结果被第三推扫掉。",
      "看到结果上涨后倒推说它一定是好 A2。"
    ],
    sourceNote: "来自 Classic A2、Price Action Basics II 与 continuation signal：A2 要 near EMA；模糊、重叠、Doji 样本通常跳过或等确认。",
    sourceAnchors: anchors("a2Definition", "a2FarFromEma", "signalBarSelection", "a22SecondEntry", "hardSoftTrendExceptions"),
    caseIds: ["case-classic-a2-trendline-break", "case-doji-overlap", "case-far-from-ema"],
    examIds: ["exam-quality-1", "exam-quality-2", "exam-quality-3"]
  },
  {
    id: "a22-second-entry",
    module: "a2",
    title: "A22：不是追单，而是弱第一信号后的重新定义风险",
    subtitle: "第一根 A2 不合格时，如何等待第二入场",
    masteryGoal: "能说明 A22 出现的条件、入场触发、止损重算、以及什么时候 A22 也要放弃。",
    whyItMatters: "A22 是 PDF 中 A2 训练的重要补充：当第一信号需要过大止损或重叠太多时，第二入场能避免新手被弱信号拖进场。",
    explanation: [
      "A22 只在第一根 A2 候选不够好时有意义：Doji、重叠、止损过宽、没有跟随，或者第一触发后只走一点就失去动力。",
      "A22 不是因为错过 A2 后害怕错过行情。它必须重新出现一个更好的信号 K，让 entry、stop 和 target 重新变得合理。",
      "判断 A22 时，不沿用第一根弱信号的止损。你要用新的 A22 信号 K 重新定义触发价和失效价。",
      "如果第二信号仍在 BW/TTR 内，或者 A22 信号 K 过大导致止损超过目标，仍然跳过。",
      "A22 的价值是让等待变成规则：第一信号不够好，就等市场证明自己，而不是降低标准。"
    ],
    decisionChecklist: [
      "第一 A2 候选为什么不合格：Doji、重叠、止损过宽还是未触发？",
      "A22 是否仍然处在原趋势方向，而不是已经进入 TR？",
      "新的信号 K 是否比第一根更强、更少重叠？",
      "是否用 A22 自己的高低点重新计算 entry 和 stop？",
      "如果 A22 仍不清楚，是否能继续跳过？"
    ],
    commonTraps: [
      "把 A22 当作错过第一笔后的追单借口。",
      "第一信号已失败进入 TR，还硬叫 A22。",
      "沿用第一信号止损，导致风险定义混乱。",
      "第二信号仍然是 Doji，却因为等过一次就降低标准。"
    ],
    sourceNote: "来自 Glossary：A22 是 A2 的第二入场，常用于第一信号止损过大或重叠较多时。",
    sourceAnchors: anchors("a22SecondEntry", "orderDiscipline", "signalBarSelection"),
    caseIds: ["case-a22-second-entry", "case-doji-overlap"],
    examIds: ["exam-a22-1", "exam-a22-2"]
  },
  {
    id: "a2-short-mirror",
    module: "a2",
    title: "做空 A2 镜像：H1、fH1、H2/fH2 与 Sell Stop",
    subtitle: "不能只会做多，下降趋势中的 A2 必须完整镜像",
    masteryGoal: "能在下降趋势中标出 Leg1、H1、fH1、Leg2、H2/fH2，并按 Sell Stop 规则执行。",
    whyItMatters: "只学做多 A2 会导致识别偏差。E-mini 盘中经常出现快速下跌，做空 A2 的规则必须像做多一样机械。",
    explanation: [
      "做空 A2 的市场背景是下降趋势：更低低点、更低高点，EMA 下行或价格反复在 EMA 下方失败。",
      "做空时，pullback 的方向是向上。H1 是第一次向上突破前 K 高点，fH1 是第一次向上反转失败，H2/fH2 是第二次向上尝试失败。",
      "信号 K 必须是空头信号 K：收盘靠近低点、实体清楚、重叠少，并出现在 EMA/趋势线附近。",
      "执行完全镜像：做空在信号 K 低点下方 1 tick 放 Sell Stop，初始止损在信号 K 高点上方 1 tick。",
      "目标和管理也镜像：target 可以按 4 ticks or more、first target 或 measured move 语境理解；first target filled 后可把 balance stop 移到 entry price。"
    ],
    decisionChecklist: [
      "是否是下降趋势，而不是区间底部？",
      "能否标出 H1、fH1、H2/fH2？",
      "第二腿是否反弹到 EMA/趋势线附近？",
      "信号 K 是否是强阴线并能定义合理止损？",
      "Sell Stop、initial stop、target、swing plan 是否入场前写好？"
    ],
    commonTraps: [
      "看到强阴线就做空，但它不是二腿反弹后的 A2。",
      "在区间底部做空 A2，直接卖到支撑上。",
      "做空时忘记镜像，把 Buy Stop/Sell Stop 混淆。",
      "没有前低空间，还硬设远端 swing 目标。"
    ],
    sourceNote: "来自 A2 定义的镜像规则：上升趋势用 L1/fL1/L2，下降趋势用 H1/fH1/H2。",
    sourceAnchors: anchors("h1L1Mirror", "a2Definition", "tickExecution", "marketStructureFilter"),
    caseIds: ["case-clean-a2-short"],
    examIds: ["exam-short-1", "exam-short-2"]
  },
  {
    id: "bp-a2",
    module: "structure",
    title: "BP A2：交易区间内部不做，强突破后才重新训练 A2",
    subtitle: "把区间噪音和突破回调 A2 分开",
    masteryGoal: "能判断区间内部小 A2 为什么跳过，以及成功突破后的二腿回调何时变成 BP A2。",
    whyItMatters: "PDF 中多次强调区间内部的信号优势低。真正值得训练的是市场从 TR 转为趋势后的 breakout pullback。",
    explanation: [
      "TR 内部的每个方向都可能出现小二腿，但上下边界会限制延续，所以它不是新手 A2 的主战场。",
      "有效突破至少要看到强突破 K、连续收在区间外、失败尝试弱，或者回调没有重新进入区间。",
      "BP A2 的重点是“突破后回调”：价格离开区间后，回调两腿到突破位/EMA/趋势线附近，并出现顺突破方向的信号 K。",
      "BP A2 的 target 可以参考区间高度的 measured move，但前提是突破没有快速失败。",
      "如果突破后马上回到区间内，不能硬叫 BP A2；它更可能是 fBO 或继续 TR。"
    ],
    decisionChecklist: [
      "前面是否是 TR/BW，而不是清楚趋势？",
      "突破是否强，是否连续收在区间外？",
      "回调是否两腿，但没有重新进入区间？",
      "信号 K 是否顺突破方向，止损是否合理？",
      "target 是否能用区间高度或前方结构解释？"
    ],
    commonTraps: [
      "在区间内部提前把小二腿当 BP A2。",
      "突破第一根追入，没有等回调和信号。",
      "突破失败回区间后仍按趋势处理。",
      "用 measured move 目标，却没有有效突破依据。"
    ],
    sourceNote: "来自 Setup Chart 与 breakout pullback A2：区间内部不训练普通 A2，强突破后的二腿回调可按 BP A2 处理。",
    sourceAnchors: anchors("breakoutPullback", "ttrBwSkip", "marketStructureFilter"),
    caseIds: ["case-breakout-pullback", "case-bw-trap"],
    examIds: ["exam-bp-1", "exam-bp-2"]
  },
  {
    id: "a2-trend-termination",
    module: "structure",
    title: "趋势终结处的弱 A2：它常常是退出信号，不是新入场信号",
    subtitle: "双顶/双底、TTR、弱反转和 fA2 出现时，A2 要降级",
    masteryGoal: "能识别趋势后期 A2 的失效环境，并知道持仓者退出、空仓者停手、止损者等待的不同动作。",
    whyItMatters: "A2 最危险的误用，是在趋势已经失去优势时继续把每个二腿都当延续机会。",
    explanation: [
      "A2 是趋势延续信号，但市场会从趋势进入交易区间或反转。趋势后期若出现双顶/双底、强反向 K、连续重叠、TTR 或弱 A2，延续概率下降。",
      "书中的 setup chart 把 weak reversal followed by weak A2、double top/bottom、TTR 等列为趋势终结或停手机制。新手要把这些当过滤器。",
      "如果你已经持有趋势仓位，弱 A2 失败或趋势终结信号可以是退出理由，而不是继续加仓理由。",
      "如果你空仓，趋势末端的弱 A2 默认跳过。你要等待新的 TR 边界、breakout pullback，或反向结构完成。",
      "如果 A2 已触发后失败，就是 fA2。训练默认动作不是马上反手，而是 wait two swings 或等价格离开 choppy action。"
    ],
    decisionChecklist: [
      "是否已经出现双顶/双底或推高/推低失败？",
      "最近 K 线是否进入 TTR/BW/高度重叠？",
      "候选 A2 是否信号弱、跟随弱或止损过宽？",
      "自己是持仓、空仓还是刚止损？对应动作是否不同？",
      "是否需要等待两个摆动或突破后 BP，而不是立刻新开仓？"
    ],
    commonTraps: [
      "把趋势末端每个二腿都当便宜入场。",
      "持仓已有利润，却用弱 A2 给自己不退出找理由。",
      "A2 失败后马上反手，没有等待新结构。",
      "忽略双顶/双底和 TTR，只盯着 EMA。"
    ],
    sourceNote: "来自 Setup Chart：double top/bottom、TTR、weak reversal followed by weak A2、fRev + fA2 都是趋势终结/停手线索。",
    sourceAnchors: anchors("trendTermination", "fa2Failure", "ttrBwSkip", "exitManagement"),
    caseIds: ["case-trend-termination-weak-a2", "case-fa2"],
    examIds: ["exam-termination-1", "exam-termination-2"]
  },
  {
    id: "opening-first-a2",
    module: "structure",
    title: "开盘新手策略：不抢 1Rev/1PB，等待第一个 A2",
    subtitle: "把开盘混乱期从交易区变成观察区",
    masteryGoal: "能在 RTH 开盘后先识别观察区、初始趋势、第一次两腿回调，再决定是否有 A2。",
    whyItMatters: "PDF 明确说开盘和 gap 是复杂主题。新手若直接抢 1Rev、1PB 或开盘突破，最容易把噪音当方向。",
    explanation: [
      "开盘后的前几根 K 线同时制造当日新高、新低、gap 测试、突破失败和方向试探。它们信息量大，但不是新手最好的入场位置。",
      "保守的新手策略是：先判断 first bar / opening range 的突破或失败，等初始趋势更清楚后，再等待第一个两腿回调。",
      "第一个 A2 的优势是结构完整：你能看到趋势、pullback、fL1/fH1、第二腿、EMA 位置和信号 K，而不是凭第一波冲动追单。",
      "如果开盘持续高度重叠、tiny bars、dojis，今天很可能是 TTR/TR 日。此时 A2 训练动作是降低期望，等待强突破后的 BP A2，或者全天不做。",
      "错过上午第一段行情不是错误。新手的第一目标不是抓满波段，而是只交易自己能解释、能复盘、能定义风险的 setup。"
    ],
    decisionChecklist: [
      "first bar / opening range 是否已经给出清楚突破、失败或 BP 语境？若没有，只观察不入场。",
      "是否有 3 根以上同向趋势 K、EMA 明确斜率或新 HOD/LOD？",
      "初始趋势后是否出现清楚两腿回调，而不是单腿小回撤？",
      "第二腿是否靠近 EMA/趋势线，并出现强信号 K？",
      "如果开盘形成 BW/TTR，是否能等待 BP A2 或接受不交易？"
    ],
    commonTraps: [
      "开盘第一根 K 方向很强就追。",
      "把复杂 1Rev/1PB 当成 A2 来交易。",
      "开盘 BW 中挑一根稍强 K 入场。",
      "因为错过第一波，就降低第一个 A2 的质量标准。"
    ],
    sourceNote: "来自开盘章节与 Trading Guide：1Rev/1PB 复杂；保守交易者可等待第一个 two-legged pullback。",
    sourceAnchors: anchors("openingFirstTwoLeggedPullback", "breakoutPullback", "ttrBwSkip", "signalBarSelection"),
    caseIds: ["case-opening-first-a2", "case-bw-trap"],
    examIds: ["exam-opening-1", "exam-opening-2"]
  },
  {
    id: "trend-mode-filter",
    module: "structure",
    title: "Hard trend / Soft trend：市场模式决定 A2 标准能不能放宽",
    subtitle: "知道进阶例外，但新手不能用例外破坏规则",
    masteryGoal: "能解释 hard trend、soft trend、normal trend 中 A2、H1/L1、重叠 fL2 的不同处理方式。",
    whyItMatters: "PDF 提到 hard trend 里 H1/L1 可能有效，soft trend 中 fL2 频繁出现；如果不讲清楚，新手会把例外当常规。",
    explanation: [
      "Normal trend 是 A2 新手训练的主场：趋势清楚，但仍给出足够深的两腿回调到 EMA/趋势线。",
      "Hard trend 回调很浅，常常没有标准 A2，L1/H1 也可能顺势成功。但这要求快速判断趋势强度和风险空间，新手默认记录，不作为实盘主策略。",
      "Soft trend 经常有重叠、浅回调、多个 fL2/fH2。经验交易者可能顺势买每个 fL2，但新手必须继续使用 BW/OL 和信号 K 过滤。",
      "模式切换本身就是知识点：当普通趋势变成 TTR、channel、soft trend 或 hard trend，A2 的可交易性也改变。",
      "训练规则：你可以学会识别例外，但实盘前只交易 clean A2。例外进入样本库，不进入订单。"
    ],
    decisionChecklist: [
      "这是 normal trend、hard trend、soft trend、channel 还是 TR？",
      "如果是 hard trend，是否因为没有两腿而想交易 L1/H1？新手默认跳过。",
      "如果是 soft trend，信号是否虽然重叠但仍清楚靠近 EMA/趋势线？",
      "是否进入 channel/TTR，导致信号 bar breakout 失去优势？",
      "当前样本是实盘 A2，还是只应记录到例外样本库？"
    ],
    commonTraps: [
      "听到 hard trend 可做 L1/H1，就把所有单腿都拿来交易。",
      "听到 soft trend 可做 fL2，就忽略 BW/OL。",
      "市场从趋势变成 channel 后，仍按普通 A2 管理。",
      "把进阶例外提前用于实盘。"
    ],
    sourceNote: "来自 Setup Chart、Market Structure 与 Direction sections：normal trend 找 A2，hard trend 可有 H1/L1，soft trend 有更多 fL2，但新手先只做 A2。",
    sourceAnchors: anchors("marketStructureFilter", "hardSoftTrendExceptions", "a2Definition", "channelFilter"),
    caseIds: ["case-hard-soft-trend-filter", "case-one-leg-not-a2"],
    examIds: ["exam-mode-1", "exam-mode-2"]
  },
  {
    id: "fa2-discipline",
    module: "risk",
    title: "fA2 是信息，不是情绪按钮",
    subtitle: "止损后如何避免把一个错误变成一天的错误",
    masteryGoal: "A2 失败后能等待两个摆动或等价格离开 choppy action，并重新评估趋势、TR 或反向两腿。",
    whyItMatters: "Cadaver 反复强调新手止损后最容易马上找下一笔，这通常是亏损扩大器。",
    explanation: [
      "fA2 表示原本的趋势延续尝试失败。它可能提示趋势终结，也可能只是进入 TR，或者是更深回调。",
      "经验交易者有时能反向利用 fA2，但前提是失败后有强反向 K 和清楚跟随。新手默认不反手。",
      "可反手的 fA2 必须同时满足更高门槛：A2 已真实触发后失败、失败 K 是强反向趋势 K、没有进入 BW/OL、后续至少能看出新方向两腿或清楚跟随。",
      "如果 fA2 后价格横向重叠，最常见结果不是趋势反转，而是 TTR/TR。此时 wait two swings 比预测方向更重要。",
      "等待两个摆动的意义是让市场先给出新结构，而不是让你的情绪替市场做决定。",
      "2/5 规则和 Rule of 10 是训练系统的一部分：它们把交易从临场冲动变成可复盘的行为。"
    ],
    decisionChecklist: [
      "A2 是否真实触发后失败，还是根本没触发？",
      "失败 K 是否强，是否有后续跟随？",
      "失败区域是否进入 BW/OL？",
      "两个摆动是否完成？",
      "今天是否已经两亏或五笔？"
    ],
    commonTraps: [
      "止损后立刻反手，实际是在报复。",
      "把所有 fA2 都当趋势反转。",
      "止损后马上找同方向下一根 K 继续做。",
      "忘记记录 fA2，复盘时只记得亏损情绪。"
    ],
    sourceNote: "来自 Two strikes 与 fA2 补充：止损后等待，防止 emotionally distressed state。",
    sourceAnchors: anchors("fa2Failure", "twoStrikes", "orderDiscipline", "trendTermination"),
    caseIds: ["case-fa2", "case-fa2-reversal-boundary"],
    examIds: ["exam-fa2-1", "exam-risk-1", "exam-fa2-2"]
  },
  {
    id: "a2-management",
    module: "risk",
    title: "A2 的完整交易闭环：计划、触发、止损、target 和 swing",
    subtitle: "识别 A2 只是第一步，真正的熟练是知道每一种后续该怎么办",
    masteryGoal: "能在入场前写出 entry、initial stop、target、swing plan、无触发、触发失败、first target 后的管理规则。",
    whyItMatters: "很多新手能认出 A2，却在触发、止损或获利后临场乱处理，结果把好 setup 做成坏交易。",
    explanation: [
      "A2 交易必须在入场前完成计划：触发价、失效价、最小目标、是否分批、什么情况下提前退出。没有计划的 A2 只是看图猜方向。",
      "入场逻辑：做多在信号 K 高点上方 1 tick 挂 Buy Stop。这样只有下一根 K 真的突破信号 K，交易才触发。做空完全镜像。",
      "未触发逻辑：如果下一根没有突破信号 K，不追价，不把信号 K 收盘当入场。可以等待 A22 或新结构。",
      "止损逻辑：默认止损在信号 K 另一端外 1 tick。若信号 K 太大导致止损大于目标，跳过。若触发后跌破止损，就是 fA2，要等待两个摆动重新评估。",
      "获利逻辑：PDF 的基础写法是 target 4 ticks or more；风险管理章节还讨论 first target +10t for half size。",
      "Swing 逻辑：first target filled 后，把 balance stop 移到 entry price，并尝试让 swing portion 运行；如果出现 BW/OL 或趋势终结，也要考虑退出。"
    ],
    decisionChecklist: [
      "入场前是否已经写下 entry、stop、target、swing plan？",
      "做多是否只在信号 K 高点 +1 tick 触发？做空是否镜像？",
      "如果没有触发，是否能做到不追价？",
      "如果止损距离过大，是否能跳过而不是缩小止损？",
      "first target 后是全出，还是 half size + breakeven stop？这个规则是否入场前就确定？",
      "swing plan 是否来自结构目标，而不是随意想赚更多？"
    ],
    commonTraps: [
      "信号 K 收盘后直接市价入场，失去触发确认。",
      "看到价格快到 target 就提前乱出，复盘无法评估 setup。",
      "first target filled 后不按计划处理 balance stop。",
      "把 swing 目标设得太远，没有任何前高、通道或 measured move 依据。",
      "止损后立刻重进或反手，没有 wait two swings。"
    ],
    sourceNote: "来自 Trading Guide 与 Two Strikes：入场、止损、目标必须预先定义；止损不能大于目标，亏损后要限制继续交易。",
    sourceAnchors: anchors("tradePlanExecution", "tickExecution", "twoStrikes", "exitManagement"),
    caseIds: ["case-a2-trade-management", "case-fa2"],
    examIds: ["exam-management-1", "exam-management-2", "exam-management-3"]
  },
  {
    id: "tick-risk-sim-readiness",
    module: "risk",
    title: "从知识到 SIM：tick 语言、交易日志、Rule of 10 和实盘闸门",
    subtitle: "能识别 A2 不等于能下单，必须先证明执行稳定",
    masteryGoal: "能用 PDF 的 tick / point 语言表达 entry、stop、target，并按训练闸门判断自己是否只允许 SIM 或可进入实盘。",
    whyItMatters: "PDF 的 Trading Guide 明确要求先只做 A2、单图训练、Rule of 10 后再扩展。没有执行统计，知识会在实盘压力下失效。",
    explanation: [
      "PDF 没有在正文里把 E-mini 的 tick 定义成某个小数点价格单位；它使用的是 1 tick、4 ticks、8 ticks、1.5 points、2 points 这样的相对交易语言。",
      "Coach 的规则必须复刻 PDF：做多 entry = 信号 K 高点 +1t；stop = 信号 K 低点 -1t。做空完全镜像。",
      "每笔交易入场前必须计算风险点数、target 和 room for profit。如果 stop 大于 target，不能靠缩小止损硬做，只能跳过或等待更好信号。",
      "SIM 第一阶段不是为了赚钱，而是学习下单、移动止损、避免买卖方向/数量等低级错误，并只做 A2。",
      "Rule of 10 是实盘前证明技术正确的条件；之后仍可能因为情绪在真实资金中亏损。",
      "实盘前还必须确认合约规模、滑点、手续费、数据延迟、最大日亏和平台操作。知识覆盖完整只解决“该做什么”，不自动解决“能否在压力下做到”。"
    ],
    decisionChecklist: [
      "是否能把每个信号 K 写成 H+1t/L-1t 或 L-1t/H+1t？",
      "目标空间是否至少覆盖 stop？",
      "是否完整填写交易前 10 问清单？",
      "是否连续 SIM 达标且无纪律违规？",
      "是否满足 Rule of 10 后才考虑 E-mini 实盘？"
    ],
    commonTraps: [
      "会背 A2，但不能用 H+1t、L-1t、4t target 写出执行计划。",
      "形态正确但风险收益不合格，仍然硬做。",
      "SIM 中随意交易，实盘前没有可验证记录。",
      "没有完成 SIM 和 Rule of 10，就把 E-mini 知识直接拿去实盘。",
      "把一周盈利当成已掌握，跳过 Rule of 10。"
    ],
    sourceNote: "来自 Trading Guide、Two Strikes 与 Price Action Basics：先只做 A2、单图训练、2/5 限制、Rule of 10 后再扩展。",
    sourceAnchors: anchors("simRule10", "tickExecution", "twoStrikes", "tradePlanExecution"),
    caseIds: ["case-es-tick-calculation", "case-a2-trade-management"],
    examIds: ["exam-tick-1", "exam-tick-2", "exam-readiness-1"]
  },
  {
    id: "order-execution-discipline",
    module: "risk",
    title: "订单执行纪律：未触发、OCO、limit entry 与 mid-bar 决策",
    subtitle: "A2 的边界在订单层面完成，不是在情绪里完成",
    masteryGoal: "能区分计划、挂单、触发、取消和重新定义信号；知道未触发不追价、不用 limit entry 省 tick、不在 K 线未收盘时改判断。",
    whyItMatters: "PDF 把 entry、stop、target 写成预定义规则。新手一旦把未触发追价、limit entry、省 tick、mid-bar 预测混在一起，A2 就失去可复盘性。",
    explanation: [
      "信号 K 收盘后只生成交易计划，不等于已经入场。做多必须等高点上方 1 tick 触发，做空必须等低点下方 1 tick 触发。",
      "如果信号 K 后没有触发，不能把收盘价、市价或回踩 limit 当作同一笔 A2。旧计划失效后，只能等待 A22 或新结构重新定义 entry 与 stop。",
      "PDF 明确提醒新手应消除 limit entries。为了省一两个 tick 而提前成交，需要更高的读图能力，不属于第一阶段 A2 训练。",
      "OCO 的意义是把 stop 和 target 成对放好，防止入场后临场犹豫。设置后重点观察下一组 setup，而不是盯着盈亏临时改规则。",
      "Channel、TTR、开盘混乱中，mid-bar 看起来像突破但收盘可能变成长影线。训练阶段只在 K 线收盘后评估信号，避免被盘中形状诱导。"
    ],
    decisionChecklist: [
      "这只是信号 K 收盘后的计划，还是已经突破外侧 1 tick 触发？",
      "如果没有触发，是否取消旧订单并等待新信号？",
      "是否把 entry、stop、target 作为 OCO/成对规则预先写好？",
      "是否为了省 tick 使用 limit entry？如果是，训练阶段直接禁止。",
      "是否在 K 线未收盘时改变 setup 判断？如果是，停止并等收盘。"
    ],
    commonTraps: [
      "信号 K 看起来很好，下一根没触发也市价追入。",
      "用 limit entry 试图买得更便宜，结果交易已经不再是 PDF 的 A2 执行。",
      "入场后不设 OCO，临场决定止损和目标。",
      "mid-bar 看到突破就提前入场，收盘后发现只是长影线或 Doji。"
    ],
    sourceNote: "来自 Trading Guide 与 overtrading 章节：entry、stop、target 预定义；新手应消除 limit entry；设置订单后等待 setup 结果。",
    sourceAnchors: anchors("orderDiscipline", "tickExecution", "tradePlanExecution", "channelFilter"),
    caseIds: ["case-order-not-triggered", "case-doji-overlap"],
    examIds: ["exam-order-1", "exam-order-2", "exam-order-3"]
  },
  {
    id: "exit-management-advanced",
    module: "risk",
    title: "离场逻辑：target、stop、反向 setup 与趋势终结信号",
    subtitle: "会入场只是 A2 的一半，知道何时退出才是完整交易",
    masteryGoal: "能把固定 target、initial stop、breakeven stop、反向 setup、TTR/Doji/climax/trendline break 离场分开处理。",
    whyItMatters: "PDF 对离场的要求不是死拿，也不是随意落袋。A2 成功后必须知道什么时候让 swing 运行，什么时候趋势质量已经下降。",
    explanation: [
      "最基础的离场只有两种：target filled 或 stop taken out。这保证每笔 A2 都可以被统计。",
      "如果 first target filled，balance stop 可以移到 entry price，让 swing portion 尝试更大 move。这个动作必须是入场前计划的一部分。",
      "如果出现反向 setup 并触发，PDF 的交易计划语言允许结束当前仓位并进入新订单；但这需要清楚结构，不是看到一根反向 K 就慌。",
      "趋势终结信号包括 double top/bottom、TTR、弱反转后弱 A2、连续 Doji、明显趋势线突破、climax 或 undeserved gain。持仓者看到这些要考虑退出或收紧。",
      "退出训练要记录原因：fixed target、breakeven stop、trend termination、opposite setup、rule violation。原因混在一起，就无法知道自己到底掌握了什么。"
    ],
    decisionChecklist: [
      "这笔交易的 primary exit 是 target 还是 stop？",
      "first target filled 后，balance stop 是否移到 entry price？",
      "是否出现反向 setup 且真实触发，而不是单根反向 K？",
      "是否出现连续 Doji、TTR、climax、trendline break 或 TT 线索？",
      "离场原因能否在日志中归类，而不是写“感觉差不多”？"
    ],
    commonTraps: [
      "target 未到就因为害怕提前出，导致统计失真。",
      "first target 后不移动 balance stop，或随意放宽 stop。",
      "看到一根反向 K 就退出，没等反向 setup 触发。",
      "趋势已经进入 TTR/连续 Doji，还把 swing 当成无条件死拿。"
    ],
    sourceNote: "来自 Patience、exit 与 swing management 段落：交易由 target 或 stop 结束；反向 setup 触发可结束；TTR、Doji、climax 是退出线索。",
    sourceAnchors: anchors("exitManagement", "trendTermination", "tradePlanExecution"),
    caseIds: ["case-exit-signals", "case-a2-trade-management", "case-trend-termination-weak-a2"],
    examIds: ["exam-exit-1", "exam-exit-2", "exam-exit-3"]
  },
  {
    id: "risk-math-mae",
    module: "risk",
    title: "风险数学与 MAE：为什么 stop、target、胜率必须一起看",
    subtitle: "不是形态对就能做，风险收益不合格的 A2 仍然要跳过",
    masteryGoal: "能用 reward * probability > risk 判断交易是否值得，并用 MAE 记录触发后回撤质量。",
    whyItMatters: "PDF 明确说 stop 不应大于 target，也用 MAE 说明好 swing 入场通常回撤很小。新手必须把形态识别和风险数学绑定。",
    explanation: [
      "PDF 给出的关系是 reward * probability > risk。胜率、目标和风险不是三件事，而是一件交易是否有 EV 的三个面。",
      "如果胜率约 50%，期待 4 ticks，风险就不能过大；如果风险很大，目标必须更大才只是打平。stop should not be larger than target 是最低门槛。",
      "信号 K 太大时，不能靠幻想更高胜率解决问题。新手应跳过，或者等 A22/更小更清楚的信号重新定义风险。",
      "MAE 记录入场后最大不利波动。PDF 的观察是：很多优质 swing entry 触发后回撤很小，超过 4t 的回撤最终成为好 swing 的比例明显下降。",
      "MAE 不是让你随意提前止损，而是训练你区分“触发后立刻走远的高质量 entry”和“触发后深回撤、只能按低质量处理的 entry”。"
    ],
    decisionChecklist: [
      "这笔 A2 的 stop 是否小于或等于 target？",
      "如果风险大，是否有足够大的结构目标支撑？没有就跳过。",
      "是否记录触发后的 MAE：0t、1t、2t、3t、4t、超过 4t？",
      "MAE 超过 4t 后，是否还把它当高质量 swing？",
      "日志是否把 win rate、average win、average loss 分开统计？"
    ],
    commonTraps: [
      "形态正确就忽略 stop/target 比例。",
      "把超大信号 K 当强信号，实际风险过宽。",
      "MAE 深回撤后仍幻想它是最佳 swing。",
      "只统计胜率，不统计平均盈利和平均亏损。"
    ],
    sourceNote: "来自 risk/probability 与 MAE 章节：reward * probability > risk；触发后深回撤会降低 swing 质量。",
    sourceAnchors: anchors("riskMathMae", "tradePlanExecution", "tickExecution", "signalBarSelection"),
    caseIds: ["case-mae-swing-quality", "case-es-tick-calculation"],
    examIds: ["exam-riskmath-1", "exam-riskmath-2", "exam-mae-1"]
  },
  {
    id: "channel-structure-filter",
    module: "structure",
    title: "Channel 与 sloping BW：有趋势方向，也可能不能按普通 A2 做",
    subtitle: "结构过滤必须覆盖 normal trend、hard trend、soft trend、channel、BW 与 TR",
    masteryGoal: "能区分 normal trend 的 A2、hard trend 的 H1/L1 例外、soft trend 的重叠例外、channel/sloping BW 的高重叠风险。",
    whyItMatters: "PDF 反复强调 market structure 是过滤器。仅仅看到 HH/HL 或 LL/LH 不够，重叠、斜率、bar size 和 follow-through 决定 A2 是否可训练。",
    explanation: [
      "Normal trend 是 A2 的主训练环境：趋势清楚、pullback 两腿、EMA/趋势线附近、信号 K 与 entry bar 不重叠太多。",
      "Hard trend 里 H1/L1 有时有效，但 PDF 同时建议新手先只做 A2。知道例外，不等于把例外加入第一阶段实盘。",
      "Soft trend 会有更多重叠和 fL2/fH2；经验交易者能处理，但新手很容易把 soft trend 和 BW 混淆。",
      "Channel 是有方向的重叠漂移。PDF 描述 channel 时强调多根 K 重叠、长影线、颜色交替、不可预测，普通 fixed stop 与 signal-bar breakout 会变弱。",
      "Sloping BW 看起来有方向，但本质仍是重叠噪音。训练动作是等待 channel break 或不再重叠的 pullback，再重新评估。"
    ],
    decisionChecklist: [
      "这是 normal trend、hard trend、soft trend、channel、BW 还是 TR？",
      "signal bar、entry bar 和后续两根是否继续重叠？如果是，警惕 channel。",
      "pullback 是否 deep enough，有足够 room for profit？",
      "是否只是斜向漂移，每个 swing 只多走几 tick？",
      "如果不是 normal trend，自己是否有足够经验交易例外？没有则跳过。"
    ],
    commonTraps: [
      "看到方向向上就忽略重叠，误把 channel 当 normal trend。",
      "把 soft trend 的进阶例外当新手常规规则。",
      "在 sloping BW 中反复做 A2，被深回撤扫掉。",
      "channel break 前过早预测方向，进入最差位置。"
    ],
    sourceNote: "来自 Market Structure 与 channel 章节：market structure 是过滤器；channels 是高度重叠且漂移的价格行为。",
    sourceAnchors: anchors("channelFilter", "marketStructureFilter", "ttrBwSkip", "signalBarSelection"),
    caseIds: ["case-channel-vs-a2", "case-hard-soft-trend-filter", "case-bw-trap"],
    examIds: ["exam-channel-1", "exam-channel-2", "exam-channel-3"]
  },
  {
    id: "bar-by-bar-marking",
    module: "a2",
    title: "逐 K 标注训练：从看懂答案到自己识别 A2",
    subtitle: "每张图都要能标 sequence、structure、entry、stop、target 和 skip reason",
    masteryGoal: "能不用提示，逐 K 标出趋势状态、Leg1/fL1/Leg2/fL2、信号 K、entry/stop/target、以及跳过原因。",
    whyItMatters: "选择题只能证明你能认答案，逐 K 标注才能证明你能在真实图表上按 PDF 流程工作。",
    explanation: [
      "逐 K 标注的第一层是 structure：上升趋势、下降趋势、TR、TTR/BW、channel、opening range。状态不清楚时，先标 wait。",
      "第二层是 sequence：做多标 HH、L1、Leg1、fL1、Leg2、L2/fL2；做空标 LL、H1、Leg1、fH1、Leg2、H2/fH2。",
      "第三层是 signal：信号 K 是否 strong close、少重叠、靠近 EMA/趋势线、stop 不超过 target。Doji/OL/超大 K 要明确写 skip reason。",
      "第四层是 execution：做多 H+1t/L-1t，做空 L-1t/H+1t，写 target、first target、breakeven stop、swing plan。",
      "第五层是 review：每个候选只允许一个结论：trade、wait A22、skip BW/OL、skip far from EMA、skip risk/reward、exit/stand aside。"
    ],
    decisionChecklist: [
      "我能否先写市场状态，而不是先找信号 K？",
      "我能否逐 K 标出 Leg1/fL1/Leg2/fL2 或 H1/fH1/H2/fH2？",
      "我能否写出具体 H+1t/L-1t 或 L-1t/H+1t？",
      "跳过时是否能写出唯一主因，而不是含糊说“不好”？",
      "复盘时是否记录 MAE、是否触发、是否到 target、是否违规？"
    ],
    commonTraps: [
      "看完答案觉得懂，自己标图时先找漂亮 K。",
      "跳过原因写得模糊，导致下次仍然犯同样错误。",
      "只标入场，不标 stop、target、MAE 和离场。",
      "把结果盈利当成标注正确，忽略 setup 分类。"
    ],
    sourceNote: "来自 Trading Guide 的 SIM 与日志要求：先只做 A2，记录 setup、entry、stop、target、失败与执行纪律。",
    sourceAnchors: anchors("barByBarPractice", "simRule10", "tradePlanExecution", "a2Definition"),
    caseIds: ["case-clean-a2-long", "case-clean-a2-short", "case-order-not-triggered", "case-channel-vs-a2"],
    examIds: ["exam-marking-1", "exam-marking-2", "exam-marking-3"]
  }
];

export const exams: ExamQuestion[] = [
  {
    id: "exam-signal-1",
    mode: "concept",
    lessonId: "signal-bar",
    prompt: "为什么强阳线不一定是好信号 K？",
    options: ["因为还要看位置、重叠和止损宽度", "因为实体大就自动代表控制权确立", "因为只要是阳线就能定义合理风险", "因为强 K 出现就说明趋势已经成立"],
    answer: "因为还要看位置、重叠和止损宽度",
    explanation: "强实体只是一个维度。信号 K 必须在正确上下文中，并能定义合理风险。",
    whyWrong: {
      "因为实体大就自动代表控制权确立": "大实体在 BW 中常被下一根反转，单独看实体不够。",
      "因为只要是阳线就能定义合理风险": "阳线止损可能过宽或位置在重叠区，风险定义不合格。",
      "因为强 K 出现就说明趋势已经成立": "强 K 可以出现在区间中部或反转失败中，不等于趋势成立。"
    }
  },
  {
    id: "exam-signal-2",
    mode: "case",
    lessonId: "signal-bar",
    chartCaseId: "case-doji-overlap",
    prompt: "图中 b10 的主要问题是什么？",
    options: ["信号 K 是 Doji 且重叠多", "趋势方向不清楚所以不能做", "信号 K 实体太大导致止损过宽", "离 EMA 太近不适合做 A2"],
    answer: "信号 K 是 Doji 且重叠多",
    explanation: "这张图的结构不是最大问题，问题是触发 K 没有表达清楚控制权。",
    whyWrong: {
      "趋势方向不清楚所以不能做": "前面仍能看到上升趋势和回调结构，方向不是主问题。",
      "信号 K 实体太大导致止损过宽": "这里的问题恰恰相反，信号 K 太弱（Doji），不是太大。",
      "离 EMA 太近不适合做 A2": "靠近 EMA 通常是加分项，不是问题。"
    }
  },
  {
    id: "exam-a2-1",
    mode: "concept",
    lessonId: "a2-core",
    prompt: "A2 的机制描述最准确的是哪一个？",
    options: ["第二次失败的反转尝试形成趋势延续", "价格回调碰到 EMA 就自动触发入场", "趋势中任意两根同向 K 线出现的位置", "回调深度超过前一波涨幅的 50%"],
    answer: "第二次失败的反转尝试形成趋势延续",
    explanation: "二腿回调到 EMA 是外观，两个反转尝试失败才是 A2 逻辑。",
    whyWrong: {
      "价格回调碰到 EMA 就自动触发入场": "碰 EMA 只是位置条件，还需要二腿结构和信号 K 确认。",
      "趋势中任意两根同向 K 线出现的位置": "A2 是两腿回调序列，不是简单计数两根 K 线。",
      "回调深度超过前一波涨幅的 50%": "A2 不用固定百分比定义，关键是二腿结构和 EMA 位置。"
    }
  },
  {
    id: "exam-a2-2",
    mode: "case",
    lessonId: "a2-core",
    chartCaseId: "case-far-from-ema",
    prompt: "图中高亮信号为什么要等待？",
    options: ["因为趋势太弱", "因为离 EMA 太远，可能还有第三推", "因为不能顺势交易", "因为所有 A2 都要等三腿"],
    answer: "因为离 EMA 太远，可能还有第三推",
    explanation: "书中明确说 A2 太远离 EMA 可能不合格，可能演化成 W pullback。",
    whyWrong: {
      "因为趋势太弱": "这张图的问题不是趋势弱，而是回调位置不够好。",
      "因为不能顺势交易": "A2 正是顺势延续 setup。",
      "因为所有 A2 都要等三腿": "标准 A2 是两腿，三推是远离 EMA 时的风险。"
    }
  },
  {
    id: "exam-a2-3",
    mode: "case",
    lessonId: "a2-core",
    chartCaseId: "case-one-leg-not-a2",
    prompt: "图中 b7 很强，为什么仍然不能把它归类为 A2？",
    options: ["因为只有一腿回调，缺少第二次失败反转", "因为强阳线不能做多", "因为 EMA 完全没用", "因为上涨结果证明它一定是 A2"],
    answer: "因为只有一腿回调，缺少第二次失败反转",
    explanation: "A2 的定义要求 second attempt。强信号 K 可以是别的顺势信号，但不能替代两腿结构。",
    whyWrong: {
      "因为强阳线不能做多": "强阳线可以做多，但这里的问题是 setup 分类不是 A2。",
      "因为 EMA 完全没用": "EMA 仍然重要，只是本题的关键缺口是序列不足。",
      "因为上涨结果证明它一定是 A2": "结果正确不代表分类正确，训练要先按定义标注。"
    }
  },
  {
    id: "exam-execution-1",
    mode: "execution",
    lessonId: "a2-core",
    chartCaseId: "case-clean-a2-long",
    prompt: "标准做多 A2 的触发方式是什么？",
    options: ["信号 K 高点上方 1 tick Buy Stop", "信号 K 收盘后市价买入锁定方向", "信号 K 低点附近挂 Limit 省 tick 入场", "信号 K 收盘价挂 Stop 触发"],
    answer: "信号 K 高点上方 1 tick Buy Stop",
    explanation: "Buy Stop 要求下一根 K 突破信号 K 高点，避免未确认的收盘追价。",
    whyWrong: {
      "信号 K 收盘后市价买入锁定方向": "市价追入价格更差且没有突破确认，不是标准 A2 执行。",
      "信号 K 低点附近挂 Limit 省 tick 入场": "PDF 要求新手消除 limit entry，省的 tick 用更高读图风险换来。",
      "信号 K 收盘价挂 Stop 触发": "触发价应在高点上方 1 tick，不是收盘价。"
    }
  },
  {
    id: "exam-structure-1",
    mode: "case",
    lessonId: "ttr-bw",
    chartCaseId: "case-bw-trap",
    prompt: "BW/OL 区域中出现一根稍强阳线，最合理动作是什么？",
    options: ["立刻做多", "立刻做空", "等待突破、失败或 BP", "把止损放宽三倍"],
    answer: "等待突破、失败或 BP",
    explanation: "BW 内部没有方向优势，等待市场离开重叠区再评估。",
    whyWrong: {
      "立刻做多": "你是在重叠区猜方向。",
      "立刻做空": "反向猜测同样没有优势。",
      "把止损放宽三倍": "放宽止损不能制造交易优势。"
    }
  },
  {
    id: "exam-structure-2",
    mode: "case",
    lessonId: "ttr-bw",
    chartCaseId: "case-breakout-pullback",
    prompt: "为什么最后的 BP 可以重新考虑，而区间内部不做？",
    options: ["因为突破后市场给出新结构", "因为区间内部没有 K 线", "因为 BP 永远成功", "因为 EMA 不再重要"],
    answer: "因为突破后市场给出新结构",
    explanation: "强突破后没有立即失败，回调不重回区间，说明市场可能从 flat 转为 up。",
    whyWrong: {
      "因为区间内部没有 K 线": "区间内部有 K 线，只是没有方向优势。",
      "因为 BP 永远成功": "BP 也会失败，但比区间内部随机信号更有结构依据。",
      "因为 EMA 不再重要": "EMA 仍然有参考价值，但突破位也成为关键上下文。"
    }
  },
  {
    id: "exam-fa2-1",
    mode: "case",
    lessonId: "fa2-discipline",
    chartCaseId: "case-fa2",
    prompt: "A2 触发后被止损，训练阶段的默认动作是什么？",
    options: ["马上反手", "等待两个摆动后重新评估", "加倍做多", "取消 2/5 规则"],
    answer: "等待两个摆动后重新评估",
    explanation: "fA2 是信息，不是情绪按钮。先等结构明确。",
    whyWrong: {
      "马上反手": "只有经验足够且反向结构很强时才考虑。",
      "加倍做多": "这是典型情绪补偿。",
      "取消 2/5 规则": "止损后更需要纪律规则。"
    }
  },
  {
    id: "exam-risk-1",
    mode: "concept",
    lessonId: "fa2-discipline",
    prompt: "2/5 规则主要训练什么？",
    options: ["限制情绪化过度交易", "确保每天至少交易五笔来积累数据", "止损后鼓励继续找同方向机会", "保证每天不会出现净亏损"],
    answer: "限制情绪化过度交易",
    explanation: "2/5 的目的不是保证盈利，而是限制亏损后继续犯错。",
    whyWrong: {
      "确保每天至少交易五笔来积累数据": "五笔是上限而非目标，强制凑数会降低样本质量。",
      "止损后鼓励继续找同方向机会": "止损后更要等待和复盘，不是继续找机会。",
      "保证每天不会出现净亏损": "没有规则能保证不亏损，2/5 只是限制亏损后的情绪化扩大。"
    }
  },
  {
    id: "exam-management-1",
    mode: "execution",
    lessonId: "a2-management",
    chartCaseId: "case-a2-trade-management",
    prompt: "做多 A2 的入场和初始止损应该在什么时候确定？",
    options: ["入场前就确定", "触发后根据盘面感觉调整", "到 first target 后再决定止损位置", "先入场再看支撑阻力放止损"],
    answer: "入场前就确定",
    explanation: "PDF 强调 entry、stop、target 都是预定义的。A2 的执行优势来自先定义风险。",
    whyWrong: {
      "触发后根据盘面感觉调整": "触发后情绪会干扰执行，感觉调整会破坏可复盘性。",
      "到 first target 后再决定止损位置": "止损必须在入场前就定义好，不能等到盈利后再补。",
      "先入场再看支撑阻力放止损": "入场前不知道 stop 就无法评估风险收益，违反预定义原则。"
    }
  },
  {
    id: "exam-management-2",
    mode: "execution",
    lessonId: "a2-management",
    chartCaseId: "case-a2-trade-management",
    prompt: "first target filled 后，PDF 风险管理章节描述的 balance 处理是什么？",
    options: ["把 balance stop 移到 entry price", "马上加倍仓位", "取消 stop 等待 swing", "把 first target 改远"],
    answer: "把 balance stop 移到 entry price",
    explanation: "PDF 的 breakeven odds 章节写到 first target filled 后，把 balance 的 stop 移到 entry price 并 let it run。",
    whyWrong: {
      "马上加倍仓位": "这是扩大风险，不是 A2 基础训练。",
      "取消 stop 等待 swing": "取消 stop 会破坏风险定义。",
      "把 first target 改远": "入场后临时改目标会让复盘失真。"
    }
  },
  {
    id: "exam-management-3",
    mode: "concept",
    lessonId: "a2-management",
    prompt: "swing portion 的目标应该主要来自哪里？",
    options: ["结构目标，如前高/前低、摆动点、通道线或 measured move", "随便想赚多少", "固定永远 100 ticks", "亏损后翻倍追回"],
    answer: "结构目标，如前高/前低、摆动点、通道线或 measured move",
    explanation: "PDF 用 swing、measured move、previous swing extreme 等结构语言，不用固定 T2 标签。",
    whyWrong: {
      "随便想赚多少": "目标不能来自愿望。",
      "固定永远 100 ticks": "固定超远目标通常脱离市场结构。",
      "亏损后翻倍追回": "这是报复性交易，不是离场逻辑。"
    }
  },
  {
    id: "exam-quality-1",
    mode: "case",
    lessonId: "a2-quality-filter",
    chartCaseId: "case-classic-a2-trendline-break",
    prompt: "为什么这张图比普通“碰 EMA”更接近 classic A2？",
    options: ["因为二腿、EMA、回调趋势线失效和强信号同时出现", "因为任意靠近 EMA 都可以买", "因为 Doji 越多越好", "因为不需要趋势背景"],
    answer: "因为二腿、EMA、回调趋势线失效和强信号同时出现",
    explanation: "Classic A2 强调结构清楚：二腿 pullback 到关键位置，回调方向失败，再由强信号 K 执行。",
    whyWrong: {
      "因为任意靠近 EMA 都可以买": "EMA 只是位置条件，不是完整 setup。",
      "因为 Doji 越多越好": "Doji 和重叠会降低新手训练质量。",
      "因为不需要趋势背景": "A2 是趋势延续 setup，趋势背景是前提。"
    }
  },
  {
    id: "exam-quality-2",
    mode: "concept",
    lessonId: "a2-quality-filter",
    prompt: "软趋势日里重叠信号有时也能走出来，新手训练阶段应该怎么处理？",
    options: ["默认仍按低质量样本跳过或等确认", "立刻把所有 Doji 当 A2", "取消止损", "只要结果上涨就算合格"],
    answer: "默认仍按低质量样本跳过或等确认",
    explanation: "软趋势例外属于经验语境；训练阶段要保持样本清楚，否则复盘无法稳定。",
    whyWrong: {
      "立刻把所有 Doji 当 A2": "Doji 方向不清，不能因为例外降低标准。",
      "取消止损": "任何 A2 都必须先定义风险。",
      "只要结果上涨就算合格": "结果不能反推 setup 质量。"
    }
  },
  {
    id: "exam-quality-3",
    mode: "case",
    lessonId: "a2-quality-filter",
    chartCaseId: "case-far-from-ema",
    prompt: "远离 EMA 的候选 A2，最核心的训练判断是什么？",
    options: ["等待更靠近 EMA/结构位的清楚回调", "因为趋势强所以追", "把止损缩到 1 tick", "只看下一根是否上涨"],
    answer: "等待更靠近 EMA/结构位的清楚回调",
    explanation: "远离 EMA 的二次尝试可能只是浅回调，后续还有第三推或 W pullback 风险。",
    whyWrong: {
      "因为趋势强所以追": "强趋势不等于任何位置都合格。",
      "把止损缩到 1 tick": "人为缩小止损会破坏 setup 失效定义。",
      "只看下一根是否上涨": "训练目标是判断可重复 setup，不是猜下一根。"
    }
  },
  {
    id: "exam-a22-1",
    mode: "case",
    lessonId: "a22-second-entry",
    chartCaseId: "case-a22-second-entry",
    prompt: "A22 的正确含义是什么？",
    options: ["第一 A2 弱或止损不合适时，等待更好第二入场", "第一 A2 未触发后在更远位置追入", "第一 A2 止损后用同样参数立刻重做一次", "所有 clean A2 都应等第二次确认后才入场"],
    answer: "第一 A2 弱或止损不合适时，等待更好第二入场",
    explanation: "A22 是重新等待更合格的信号 K，并重新定义 entry 与 stop。",
    whyWrong: {
      "第一 A2 未触发后在更远位置追入": "追入是 FOMO，A22 是等待新的合格信号 K 重新定义风险。",
      "第一 A2 止损后用同样参数立刻重做一次": "止损后需要新信号和新风险定义，不是简单重复旧参数。",
      "所有 clean A2 都应等第二次确认后才入场": "clean A2 可以直接按规则触发，不需要强制等第二次。"
    }
  },
  {
    id: "exam-a22-2",
    mode: "execution",
    lessonId: "a22-second-entry",
    chartCaseId: "case-a22-second-entry",
    prompt: "等待到 A22 后，entry 和 stop 应该怎么处理？",
    options: ["用 A22 新信号 K 重新定义", "沿用第一根弱信号", "取消 stop 防止被扫", "用市价随便进"],
    answer: "用 A22 新信号 K 重新定义",
    explanation: "A22 是新的执行信号，必须用它自己的高低点计算触发和失效。",
    whyWrong: {
      "沿用第一根弱信号": "第一根本来就不合格，沿用会让风险定义混乱。",
      "取消 stop 防止被扫": "没有 stop 就没有可复盘交易。",
      "用市价随便进": "A2/A22 都依赖高低点外触发。"
    }
  },
  {
    id: "exam-short-1",
    mode: "case",
    lessonId: "a2-short-mirror",
    chartCaseId: "case-clean-a2-short",
    prompt: "做空 A2 中，H1/fH1/H2 描述的是什么？",
    options: ["下降趋势中回调向上的两次失败尝试", "下降趋势中连续创新低的三波主跌", "上升趋势中两次成功突破新高的序列", "入场后从 target 到 swing 的持仓管理过程"],
    answer: "下降趋势中回调向上的两次失败尝试",
    explanation: "做空 A2 是做多 A2 的镜像：反弹两腿到 EMA 后，多头第二次向上尝试失败。",
    whyWrong: {
      "下降趋势中连续创新低的三波主跌": "H1/H2 是回调向上的反弹序列，不是主跌腿。",
      "上升趋势中两次成功突破新高的序列": "做空 A2 的背景是下降趋势，H1/H2 是多头两次失败的反弹。",
      "入场后从 target 到 swing 的持仓管理过程": "H1/H2 属于入场前的回调识别，不是入场后的管理。"
    }
  },
  {
    id: "exam-short-2",
    mode: "execution",
    lessonId: "a2-short-mirror",
    chartCaseId: "case-clean-a2-short",
    prompt: "标准做空 A2 的触发和初始止损是什么？",
    options: ["信号 K 低点下方 Sell Stop，止损在高点上方", "信号 K 高点上方 Buy Stop，止损在低点下方", "收盘后市价买入", "到 first target 后再设止损"],
    answer: "信号 K 低点下方 Sell Stop，止损在高点上方",
    explanation: "做空执行完全镜像做多：突破信号 K 低点才触发，另一端定义失效。",
    whyWrong: {
      "信号 K 高点上方 Buy Stop，止损在低点下方": "这是做多触发。",
      "收盘后市价买入": "方向和执行方式都错。",
      "到 first target 后再设止损": "入场前必须定义 stop。"
    }
  },
  {
    id: "exam-bp-1",
    mode: "case",
    lessonId: "bp-a2",
    chartCaseId: "case-breakout-pullback",
    prompt: "BP A2 和区间内部小 A2 的关键区别是什么？",
    options: ["先有强突破并在区间外回调", "区间内部 K 线更多", "BP A2 不需要信号 K", "BP A2 永远不会失败"],
    answer: "先有强突破并在区间外回调",
    explanation: "BP A2 的前提是市场从区间突破出来，回调不重新进入区间，再找顺突破方向的二腿信号。",
    whyWrong: {
      "区间内部 K 线更多": "K 线数量不是关键，结构状态才是关键。",
      "BP A2 不需要信号 K": "仍然需要可执行信号 K。",
      "BP A2 永远不会失败": "任何 setup 都会失败。"
    }
  },
  {
    id: "exam-bp-2",
    mode: "execution",
    lessonId: "bp-a2",
    chartCaseId: "case-breakout-pullback",
    prompt: "BP A2 的 target 最合理参考是什么？",
    options: ["区间高度 measured move 或前方结构位", "随便固定 100 ticks", "第一根突破 K 的颜色", "完全不设目标"],
    answer: "区间高度 measured move 或前方结构位",
    explanation: "突破回调的结构目标常参考原区间高度、前高/前低或通道目标。",
    whyWrong: {
      "随便固定 100 ticks": "目标不能脱离市场结构。",
      "第一根突破 K 的颜色": "颜色不是目标计算方法。",
      "完全不设目标": "没有目标就无法管理交易。"
    }
  },
  {
    id: "exam-termination-1",
    mode: "case",
    lessonId: "a2-trend-termination",
    chartCaseId: "case-trend-termination-weak-a2",
    prompt: "趋势后期出现双顶、TTR 和弱 A2 候选，训练阶段最合理动作是什么？",
    options: ["跳过新入场，持仓者考虑退出或降风险", "无条件加仓做多", "忽略双顶只看 EMA", "马上取消所有规则"],
    answer: "跳过新入场，持仓者考虑退出或降风险",
    explanation: "弱反转后跟弱 A2 是趋势终结风险，不是新手继续开仓的好位置。",
    whyWrong: {
      "无条件加仓做多": "趋势优势已经下降，加仓风险更高。",
      "忽略双顶只看 EMA": "EMA 不能替代市场结构。",
      "马上取消所有规则": "越到趋势末端越需要规则。"
    }
  },
  {
    id: "exam-termination-2",
    mode: "concept",
    lessonId: "a2-trend-termination",
    prompt: "为什么 fA2 后不能默认马上反手？",
    options: ["失败只是信息，还需要新结构和两个摆动确认", "因为止损后立刻反手通常胜率更高", "因为 fA2 说明原趋势仍然很强应该同向再做", "因为反手需要更大仓位才能把亏损赚回来"],
    answer: "失败只是信息，还需要新结构和两个摆动确认",
    explanation: "fA2 可能代表趋势终结、TR 或更深回调；PDF 建议 loss 后 wait two swings 或等价格离开 choppy action。",
    whyWrong: {
      "因为止损后立刻反手通常胜率更高": "刚止损后情绪干扰大，且缺少新结构确认，胜率并不更高。",
      "因为 fA2 说明原趋势仍然很强应该同向再做": "fA2 可能代表趋势终结或 TR 开始，不能简单判断趋势仍强。",
      "因为反手需要更大仓位才能把亏损赚回来": "仓位管理是独立问题，不是反手的理由或障碍。"
    }
  },
  {
    id: "exam-opening-1",
    mode: "case",
    lessonId: "opening-first-a2",
    chartCaseId: "case-opening-first-a2",
    prompt: "新手为什么不应该在开盘前几根 K 线直接抢入场？",
    options: ["开盘 1Rev/1PB 和 gap 语境复杂，先等初始趋势后的第一个 A2", "因为开盘波动大所以应该用更大止损直接做", "因为开盘前几根通常是最清楚的 A2 信号", "因为开盘 K 线实体更大所以信号质量更高"],
    answer: "开盘 1Rev/1PB 和 gap 语境复杂，先等初始趋势后的第一个 A2",
    explanation: "PDF 把开盘作为复杂主题；新手更适合等待初始趋势确认后的两腿回调。",
    whyWrong: {
      "因为开盘波动大所以应该用更大止损直接做": "更大止损不能弥补结构不清楚的问题，且放大单笔风险。",
      "因为开盘前几根通常是最清楚的 A2 信号": "开盘前几根噪音和陷阱多，二腿结构很难在开盘就完整形成。",
      "因为开盘 K 线实体更大所以信号质量更高": "大实体可能只是开盘波动，不等于 A2 信号质量高。"
    }
  },
  {
    id: "exam-opening-2",
    mode: "concept",
    lessonId: "opening-first-a2",
    prompt: "如果开盘持续高度重叠、tiny bars、dojis，A2 训练动作是什么？",
    options: ["降低期望，等待强突破后的 BP A2 或不交易", "继续在区间内部找每个 A2", "把止损放宽直到不亏", "马上切换到实盘大仓位"],
    answer: "降低期望，等待强突破后的 BP A2 或不交易",
    explanation: "开盘 BW/TTR 说明市场未给方向优势；区间内部 A2 不适合训练。",
    whyWrong: {
      "继续在区间内部找每个 A2": "区间内部信号容易被边界拦截。",
      "把止损放宽直到不亏": "放宽止损不能制造优势。",
      "马上切换到实盘大仓位": "复杂市场更应减小行动。"
    }
  },
  {
    id: "exam-mode-1",
    mode: "case",
    lessonId: "trend-mode-filter",
    chartCaseId: "case-hard-soft-trend-filter",
    prompt: "Hard trend 中 L1/H1 可能有效，新手应该怎么处理？",
    options: ["知道这是进阶例外，但训练阶段仍只做清楚 A2", "所有 L1/H1 都直接按 A2 规则实盘交易", "hard trend 中不需要止损因为趋势不会回调", "hard trend 中应降低信号标准把 Doji 也做进去"],
    answer: "知道这是进阶例外，但训练阶段仍只做清楚 A2",
    explanation: "PDF 提到强趋势中 H1/L1 可工作，但同时建议新手先只做 A2。",
    whyWrong: {
      "所有 L1/H1 都直接按 A2 规则实盘交易": "L1/H1 是进阶例外，不是新手常规 setup，直接全做会增加错误率。",
      "hard trend 中不需要止损因为趋势不会回调": "任何趋势都会回调，止损是所有交易的基本风险定义。",
      "hard trend 中应降低信号标准把 Doji 也做进去": "降低标准会把 hard trend 例外无限扩大，复盘质量下降。"
    }
  },
  {
    id: "exam-mode-2",
    mode: "concept",
    lessonId: "trend-mode-filter",
    prompt: "Soft trend 中很多 fL2 能工作，为什么新手仍不能放宽到所有重叠信号？",
    options: ["因为重叠容易退化成 BW/OL，需要经验区分", "因为 soft trend 没有趋势", "因为 fL2 不是 A2 的一部分", "因为信号 K 越弱越好"],
    answer: "因为重叠容易退化成 BW/OL，需要经验区分",
    explanation: "Soft trend 是进阶语境；新手仍要用信号质量和 BW/OL 过滤。",
    whyWrong: {
      "因为 soft trend 没有趋势": "Soft trend 仍然是趋势，只是重叠多。",
      "因为 fL2 不是 A2 的一部分": "fL2 正是做多 A2 的核心机制之一。",
      "因为信号 K 越弱越好": "弱信号只会降低可复盘性。"
    }
  },
  {
    id: "exam-fa2-2",
    mode: "case",
    lessonId: "fa2-discipline",
    chartCaseId: "case-fa2-reversal-boundary",
    prompt: "fA2 后什么时候才可以把它视为新方向线索？",
    options: ["强反向 K、无 BW/OL、后续有清楚跟随或两腿", "只要止损触发就说明原方向错了应立刻反手", "等到 EMA 方向完全反转后再反手做新方向", "fA2 后下一根出现反向同色 K 就确认新方向"],
    answer: "强反向 K、无 BW/OL、后续有清楚跟随或两腿",
    explanation: "fA2 可反手是进阶边界，不是报复性反手。新手默认等待两个摆动或等价格离开 choppy action。",
    whyWrong: {
      "只要止损触发就说明原方向错了应立刻反手": "止损可能只是正常波动或 BW，不等于方向已经反转。",
      "等到 EMA 方向完全反转后再反手做新方向": "EMA 反转是滞后信号，等到那时入场通常已经太晚或错过最佳位置。",
      "fA2 后下一根出现反向同色 K 就确认新方向": "单根 K 线不足以确认新方向，需要结构性跟随和两腿确认。"
    }
  },
  {
    id: "exam-tick-1",
    mode: "execution",
    lessonId: "tick-risk-sim-readiness",
    chartCaseId: "case-es-tick-calculation",
    prompt: "PDF 语境下，做多 A2 的信号 K 高点为 H、低点为 L，entry 和 stop 应该怎么写？",
    options: ["Entry = H + 1t，Stop = L - 1t", "Entry = H，Stop = L", "Entry = L - 1t，Stop = H + 1t", "Entry = 收盘价，Stop = 随后再定"],
    answer: "Entry = H + 1t，Stop = L - 1t",
    explanation: "PDF 的执行规则是 long entry 1 tick above signal bar，stop 1 tick below；不需要引入外部小数换算。",
    whyWrong: {
      "Entry = H，Stop = L": "这是信号 K 高低点本身，不是外侧 1 tick。",
      "Entry = L - 1t，Stop = H + 1t": "这是做空触发和止损方向。",
      "Entry = 收盘价，Stop = 随后再定": "PDF 强调预先定义 entry、stop、target。"
    }
  },
  {
    id: "exam-tick-2",
    mode: "execution",
    lessonId: "tick-risk-sim-readiness",
    chartCaseId: "case-es-tick-calculation",
    prompt: "PDF 中基础 target 语言最符合哪一个？",
    options: ["target 至少 4 ticks 或更多，且 stop 不应大于 target", "target 永远固定 100 ticks", "不用 target，只看感觉", "stop 越大越安全"],
    answer: "target 至少 4 ticks 或更多，且 stop 不应大于 target",
    explanation: "书中写到 long entry 上方 1 tick、stop 下方 1 tick、target 4 ticks or more，并在 Two Strikes 中强调 stop should not be larger than target。",
    whyWrong: {
      "target 永远固定 100 ticks": "PDF 没有这种固定远目标规则。",
      "不用 target，只看感觉": "PDF 强调预定义 target 和 stop。",
      "stop 越大越安全": "书中明确警惕 stop 大于 target。"
    }
  },
  {
    id: "exam-readiness-1",
    mode: "concept",
    lessonId: "tick-risk-sim-readiness",
    prompt: "学完 Coach 课程后，进入实盘前最正确的路径是什么？",
    options: ["先 SIM，满足 Rule of 10，再进入 E-mini 实盘", "马上 E-mini 满仓实盘", "只要会背术语就实盘", "跳过止损用感觉交易"],
    answer: "先 SIM，满足 Rule of 10，再进入 E-mini 实盘",
    explanation: "PDF 明确建议 rank beginner 先 SIM，满足 Rule of 10 后才开始 real money，并且先只做 A2。",
    whyWrong: {
      "马上 E-mini 满仓实盘": "这会把学习问题变成资金风险问题。",
      "只要会背术语就实盘": "术语不能替代执行记录。",
      "跳过止损用感觉交易": "这违背 A2 的风险定义。"
    }
  },
  {
    id: "exam-order-1",
    mode: "execution",
    lessonId: "order-execution-discipline",
    chartCaseId: "case-order-not-triggered",
    prompt: "A2 信号 K 收盘后挂 Buy Stop，但下一根没有突破信号 K 高点，正确动作是什么？",
    options: ["取消旧计划，等待 A22 或新结构", "收盘后市价追入", "把止损先去掉", "用 limit entry 强行成交"],
    answer: "取消旧计划，等待 A22 或新结构",
    explanation: "PDF 的 A2 执行是信号 K 外 1 tick 触发；未触发就没有交易，不能把旧计划改成追价。",
    whyWrong: {
      "收盘后市价追入": "这绕开了 signal bar breakout 的确认。",
      "把止损先去掉": "入场前必须定义 stop。",
      "用 limit entry 强行成交": "PDF 建议新手消除 limit entries。"
    }
  },
  {
    id: "exam-order-2",
    mode: "concept",
    lessonId: "order-execution-discipline",
    prompt: "为什么第一阶段 A2 训练不应使用 limit entry 省 tick？",
    options: ["它需要更高读图能力，会破坏可复盘的触发规则", "因为 limit order 永远不会成交", "因为 PDF 只允许市价单", "因为 stop 不需要定义"],
    answer: "它需要更高读图能力，会破坏可复盘的触发规则",
    explanation: "书中提醒新手消除 limit entries；A2 训练要用明确的 signal bar 外侧触发。",
    whyWrong: {
      "因为 limit order 永远不会成交": "limit order 会成交，问题是它不适合新手第一阶段训练。",
      "因为 PDF 只允许市价单": "PDF 的核心是预定义触发、止损和目标，不是市价单。",
      "因为 stop 不需要定义": "stop 必须在入场前定义。"
    }
  },
  {
    id: "exam-order-3",
    mode: "execution",
    lessonId: "order-execution-discipline",
    prompt: "OCO 在 A2 训练中的核心作用是什么？",
    options: ["把 stop 和 target 成对预设，减少临场乱改", "让亏损交易自动变盈利", "取消 entry 规则", "允许不知道 stop 就入场"],
    answer: "把 stop 和 target 成对预设，减少临场乱改",
    explanation: "PDF 强调 entry、exit、stop 预定义。OCO 能帮助执行这个预定义规则。",
    whyWrong: {
      "让亏损交易自动变盈利": "OCO 只是订单管理，不创造优势。",
      "取消 entry 规则": "entry 仍由信号 K 外侧触发定义。",
      "允许不知道 stop 就入场": "不知道 stop 就不能入场。"
    }
  },
  {
    id: "exam-exit-1",
    mode: "case",
    lessonId: "exit-management-advanced",
    chartCaseId: "case-exit-signals",
    prompt: "A2 到 first target 后，后续出现连续 Doji、TTR 和 climax，swing portion 应怎么处理？",
    options: ["识别为趋势质量下降，考虑退出或收紧", "无条件死拿到收盘", "取消 breakeven stop", "立刻加倍加仓"],
    answer: "识别为趋势质量下降，考虑退出或收紧",
    explanation: "PDF 的退出逻辑包括 TTR、连续 Doji、trendline break、climax/undeserved gain 等趋势终结线索。",
    whyWrong: {
      "无条件死拿到收盘": "swing 不是没有退出条件。",
      "取消 breakeven stop": "first target 后 balance stop 应按计划管理。",
      "立刻加倍加仓": "趋势质量下降不是加仓信号。"
    }
  },
  {
    id: "exam-exit-2",
    mode: "concept",
    lessonId: "exit-management-advanced",
    prompt: "PDF 语境下，最基础的交易结束方式是哪一组？",
    options: ["target filled 或 stop taken out", "感觉赚够了或亏怕了", "看到任意反向 K 就平仓", "永远不退出"],
    answer: "target filled 或 stop taken out",
    explanation: "基础计划必须先由 target 和 stop 定义，其他退出如趋势终结或反向 setup 是结构化补充。",
    whyWrong: {
      "感觉赚够了或亏怕了": "感觉不能形成可复盘系统。",
      "看到任意反向 K 就平仓": "需要结构和触发，不是任意反向 K。",
      "永远不退出": "交易必须有退出规则。"
    }
  },
  {
    id: "exam-exit-3",
    mode: "execution",
    lessonId: "exit-management-advanced",
    prompt: "first target filled 后，PDF 风险管理示例对 balance stop 的处理是什么？",
    options: ["移到 entry price，让 swing portion 运行", "移动到更远亏损处", "完全取消 stop", "一定马上全平"],
    answer: "移到 entry price，让 swing portion 运行",
    explanation: "PDF 写到 first target filled 后，把 balance 的 stop 移到 entry price and let it run。",
    whyWrong: {
      "移动到更远亏损处": "不能 loosen stop 破坏数学。",
      "完全取消 stop": "取消 stop 会让风险失控。",
      "一定马上全平": "可以全平，但 PDF 示例讨论的是 balance stop + swing portion。"
    }
  },
  {
    id: "exam-riskmath-1",
    mode: "concept",
    lessonId: "risk-math-mae",
    prompt: "PDF 中 reward、probability、risk 的核心关系是什么？",
    options: ["reward * probability > risk", "risk 越大越安全", "只看胜率不用看亏损", "target 必须永远小于 stop"],
    answer: "reward * probability > risk",
    explanation: "风险数学要求目标、胜率和风险一起看；形态正确但风险过大仍然不能做。",
    whyWrong: {
      "risk 越大越安全": "过大 stop 会破坏 EV。",
      "只看胜率不用看亏损": "平均亏损会决定系统是否盈利。",
      "target 必须永远小于 stop": "PDF 明确 stop should not be larger than target。"
    }
  },
  {
    id: "exam-riskmath-2",
    mode: "execution",
    lessonId: "risk-math-mae",
    chartCaseId: "case-es-tick-calculation",
    prompt: "信号 K 过大导致 stop 大于 target 时，训练阶段正确动作是什么？",
    options: ["跳过或等待更好信号", "缩小 stop 到随机位置", "忽略 target", "加仓摊平"],
    answer: "跳过或等待更好信号",
    explanation: "PDF 明确 stop 不应大于 target。不能用随意缩 stop 来让交易看起来合格。",
    whyWrong: {
      "缩小 stop 到随机位置": "随机 stop 不再代表 setup 失效点。",
      "忽略 target": "没有 target 无法管理交易。",
      "加仓摊平": "这是扩大风险，不是 A2 训练。"
    }
  },
  {
    id: "exam-mae-1",
    mode: "case",
    lessonId: "risk-math-mae",
    chartCaseId: "case-mae-swing-quality",
    prompt: "A2 触发后深度回撤超过 4t，这对 swing 质量意味着什么？",
    options: ["需要降级记录，通常不是高质量 swing entry", "说明一定会大涨", "说明可以取消 stop", "说明 setup 分类不用复盘"],
    answer: "需要降级记录，通常不是高质量 swing entry",
    explanation: "PDF 的 MAE 观察显示，优质 swing entry 通常触发后回撤很小；超过 4t 后成为好 swing 的概率下降。",
    whyWrong: {
      "说明一定会大涨": "深回撤不是优势增强。",
      "说明可以取消 stop": "stop 仍然有效。",
      "说明 setup 分类不用复盘": "MAE 正是复盘的重要字段。"
    }
  },
  {
    id: "exam-channel-1",
    mode: "case",
    lessonId: "channel-structure-filter",
    chartCaseId: "case-channel-vs-a2",
    prompt: "图中整体向上但 K 线高度重叠、长影线多，为什么不按普通 A2 做？",
    options: ["这是 channel/sloping BW 风险，普通 signal-bar breakout 优势下降", "因为只要向上就不能做多", "因为 EMA 不存在", "因为 A2 只允许在 TR 内做"],
    answer: "这是 channel/sloping BW 风险，普通 signal-bar breakout 优势下降",
    explanation: "PDF 把 channel 描述为重叠漂移结构；新手应等待 break 或更清楚 pullback。",
    whyWrong: {
      "因为只要向上就不能做多": "方向不是问题，重叠结构才是问题。",
      "因为 EMA 不存在": "图中仍有 EMA，关键是结构过滤。",
      "因为 A2 只允许在 TR 内做": "A2 主训练环境是趋势，不是 TR 内部。"
    }
  },
  {
    id: "exam-channel-2",
    mode: "concept",
    lessonId: "channel-structure-filter",
    prompt: "Channel 与 BW 的共同危险是什么？",
    options: ["多根 K 重叠导致突破和固定止损更容易失效", "一定没有任何方向", "一定永远不能突破", "所有信号都自动高胜率"],
    answer: "多根 K 重叠导致突破和固定止损更容易失效",
    explanation: "Channel 是有方向的重叠漂移；BW 是更横向的重叠。共同问题是缺少清楚 follow-through。",
    whyWrong: {
      "一定没有任何方向": "Channel 可以有方向。",
      "一定永远不能突破": "Channel 会突破，但难点是预测何时突破。",
      "所有信号都自动高胜率": "重叠通常降低信号质量。"
    }
  },
  {
    id: "exam-channel-3",
    mode: "execution",
    lessonId: "channel-structure-filter",
    prompt: "如果 signal bar、entry bar 和后续两根都重叠，训练阶段最稳健动作是什么？",
    options: ["切换到 wait，等待 channel break 后的新 pullback", "继续加仓直到突破", "把所有重叠都当 clean A2", "取消所有复盘"],
    answer: "切换到 wait，等待 channel break 后的新 pullback",
    explanation: "PDF 提醒重叠的 signal/entry/后续 bars 是 channel 风险；新手应先停手。",
    whyWrong: {
      "继续加仓直到突破": "这是扩大风险。",
      "把所有重叠都当 clean A2": "clean A2 要少重叠。",
      "取消所有复盘": "正应记录为结构过滤样本。"
    }
  },
  {
    id: "exam-marking-1",
    mode: "case",
    lessonId: "bar-by-bar-marking",
    chartCaseId: "case-clean-a2-long",
    prompt: "逐 K 标注 A2 时，正确的顺序是什么？",
    options: ["先市场状态，再二腿序列，再信号 K，最后 entry/stop/target", "先看哪根 K 好看", "先算自己想赚多少", "先决定实盘仓位"],
    answer: "先市场状态，再二腿序列，再信号 K，最后 entry/stop/target",
    explanation: "这能避免用漂亮 K 线反推 setup，也能保证执行规则完整。",
    whyWrong: {
      "先看哪根 K 好看": "这会忽略结构。",
      "先算自己想赚多少": "目标要来自结构和风险，不是欲望。",
      "先决定实盘仓位": "未完成 SIM 与 Rule of 10 前不能进入实盘。"
    }
  },
  {
    id: "exam-marking-2",
    mode: "case",
    lessonId: "bar-by-bar-marking",
    chartCaseId: "case-order-not-triggered",
    prompt: "逐 K 标注时，未触发 A2 的结论应如何写？",
    options: ["wait / no trigger，并等待 A22 或新结构", "trade because close looks strong", "ignore entry rule", "直接标为成功 A2"],
    answer: "wait / no trigger，并等待 A22 或新结构",
    explanation: "标注必须记录是否真实触发；未触发不等于失败交易，也不等于可追价交易。",
    whyWrong: {
      "trade because close looks strong": "收盘强不等于外侧 1 tick 已触发。",
      "ignore entry rule": "entry rule 是 A2 可复盘的核心。",
      "直接标为成功 A2": "没有触发就没有这笔交易。"
    }
  },
  {
    id: "exam-marking-3",
    mode: "execution",
    lessonId: "bar-by-bar-marking",
    prompt: "复盘日志中每个候选 A2 至少应记录哪些字段？",
    options: ["结构、序列、信号 K、entry、stop、target、触发、MAE、离场/跳过原因", "只记录盈亏", "只记录自己当时心情", "只记录 K 线颜色"],
    answer: "结构、序列、信号 K、entry、stop、target、触发、MAE、离场/跳过原因",
    explanation: "这些字段能把识别、执行、风险和结果分开，才知道错误发生在哪一层。",
    whyWrong: {
      "只记录盈亏": "盈亏不能解释过程是否正确。",
      "只记录自己当时心情": "心理记录有用，但不能替代交易字段。",
      "只记录 K 线颜色": "颜色远远不够。"
    }
  },

  // Multi-condition A2 scenario questions
  {
    id: "exam-a2-scenario-1",
    mode: "execution",
    lessonId: "a2-core",
    prompt: "上升趋势中二腿回调到 EMA，信号 K 强阳收盘靠近高点，但前方 5 ticks 处有前一个 swing high 形成的阻力。你应该？",
    options: ["评估 stop vs target：若 stop 小于 5t 则可做，否则跳过", "直接做因为 A2 结构完美不用看前方阻力", "因为有阻力所以这笔绝对不能做", "把目标设到阻力之后忽略中间风险"],
    answer: "评估 stop vs target：若 stop 小于 5t 则可做，否则跳过",
    explanation: "A2 合格需要趋势、位置、信号和 room for profit 同时满足。前方阻力限制了 target，需要和 stop 对比。",
    whyWrong: {
      "直接做因为 A2 结构完美不用看前方阻力": "结构好但空间不足的 A2 仍然不合格。",
      "因为有阻力所以这笔绝对不能做": "如果 stop 很小、target 仍大于 stop，阻力不一定是否决项。",
      "把目标设到阻力之后忽略中间风险": "阻力可能拦截价格，目标应基于最近结构位而非愿望。"
    }
  },
  {
    id: "exam-a2-scenario-2",
    mode: "execution",
    lessonId: "a2-quality-filter",
    prompt: "下降趋势中，反弹两腿到 EMA 附近出现阴线信号，但信号 K 与前两根高度重叠，且 EMA 已经开始走平。你应该？",
    options: ["降级：重叠多 + EMA 走平说明趋势可能进入 TR，等更清楚环境", "做空因为有二腿反弹和阴线信号", "因为 EMA 还没翻上去所以趋势依然很强", "把止损放大到重叠区外面做进去"],
    answer: "降级：重叠多 + EMA 走平说明趋势可能进入 TR，等更清楚环境",
    explanation: "多个条件同时变差（重叠、EMA 走平）是趋势衰减信号，新手应降级或跳过。",
    whyWrong: {
      "做空因为有二腿反弹和阴线信号": "二腿和阴线只是部分条件，趋势质量和重叠也必须评估。",
      "因为 EMA 还没翻上去所以趋势依然很强": "EMA 走平已经是趋势减速信号，不需要等完全翻转。",
      "把止损放大到重叠区外面做进去": "放大止损恶化风险收益比，不能解决环境质量问题。"
    }
  },
  {
    id: "exam-a2-scenario-3",
    mode: "case",
    lessonId: "a2-core",
    chartCaseId: "case-clean-a2-long",
    prompt: "图中 A2 的信号 K 很强，但如果这根信号 K 是 Doji、前方还有一个 TTR 形成阻力，整体判断会变成？",
    options: ["降级或跳过：Doji 信号弱 + TTR 阻力限制空间", "仍然做因为二腿到 EMA 就一定行", "Doji 说明双方平衡所以更安全", "TTR 不影响 A2 的有效性"],
    answer: "降级或跳过：Doji 信号弱 + TTR 阻力限制空间",
    explanation: "把多个负面因素叠加思考：信号弱 + 前方阻力 = 训练阶段不合格。",
    whyWrong: {
      "仍然做因为二腿到 EMA 就一定行": "二腿到 EMA 只是位置条件，信号和空间都要同时合格。",
      "Doji 说明双方平衡所以更安全": "平衡意味着方向不确定，对顺势 setup 是减分而非加分。",
      "TTR 不影响 A2 的有效性": "TTR 会限制 target 空间，直接影响风险收益比。"
    }
  },

  // "不做 A2" training questions
  {
    id: "exam-a2-skip-1",
    mode: "execution",
    lessonId: "a2-quality-filter",
    prompt: "趋势日午后，价格已经从开盘涨了 30 ticks，出现看似标准的二腿回调到 EMA。但二腿回调只有 3 根 K 且每根都很小。你应该？",
    options: ["等待：浅回调不够清楚，可能后面还有更深回调或第三推", "立刻做因为趋势很强不能错过", "这是最好的 A2 因为回调越浅说明趋势越强", "在 EMA 挂 Limit 等价格回到 EMA"],
    answer: "等待：浅回调不够清楚，可能后面还有更深回调或第三推",
    explanation: "远离 EMA 的浅回调不够清楚，A2 训练要求二腿可辨识且位置合格。",
    whyWrong: {
      "立刻做因为趋势很强不能错过": "趋势强不等于任何位置都合格，FOMO 不是入场理由。",
      "这是最好的 A2 因为回调越浅说明趋势越强": "回调太浅反而说明回调未完成，后续可能有更深回调。",
      "在 EMA 挂 Limit 等价格回到 EMA": "PDF 要求新手消除 limit entry。"
    }
  },
  {
    id: "exam-a2-skip-2",
    mode: "execution",
    lessonId: "a2-trend-termination",
    prompt: "上升趋势尾声出现双顶后，市场下跌再反弹到 EMA，出现弱阳线。这看起来像 A2 做多，你应该？",
    options: ["跳过：双顶 + 趋势末期的弱信号不适合新入场", "做多因为仍有二腿回调到 EMA", "因为有阳线所以趋势一定还会继续", "加大仓位抄底因为跌了很多"],
    answer: "跳过：双顶 + 趋势末期的弱信号不适合新入场",
    explanation: "趋势终结信号（双顶）+ 弱信号 K = 环境已经不支持标准 A2 训练。",
    whyWrong: {
      "做多因为仍有二腿回调到 EMA": "形状像 A2 不够，趋势终结环境下 A2 胜率大幅下降。",
      "因为有阳线所以趋势一定还会继续": "阳线不能否定双顶等终结信号。",
      "加大仓位抄底因为跌了很多": "跌了多少不是做多理由，这是报复性抄底思维。"
    }
  },
  {
    id: "exam-a2-skip-3",
    mode: "execution",
    lessonId: "ttr-bw",
    prompt: "开盘后 40 分钟市场一直在窄幅 BW 中震荡，期间出现了看似标准的二腿回调和阳线信号。你应该？",
    options: ["跳过：BW 内部的二腿只是噪音，不是可训练的 A2", "做多因为二腿结构已经完整", "BW 内部的 A2 胜率更高因为止损小", "先做一笔试试 BW 是否会突破"],
    answer: "跳过：BW 内部的二腿只是噪音，不是可训练的 A2",
    explanation: "BW 内部没有方向优势，二腿只是随机来回走，不是趋势回调。",
    whyWrong: {
      "做多因为二腿结构已经完整": "BW 内部的二腿形状正确但缺少趋势背景，不是真 A2。",
      "BW 内部的 A2 胜率更高因为止损小": "止损小但空间也小，且区间边界会拦截延续。",
      "先做一笔试试 BW 是否会突破": "用真金白银试探不是训练方法，等突破后 BP 确认才是正途。"
    }
  },

  // A2 vs other setup boundary confusion
  {
    id: "exam-a2-boundary-1",
    mode: "concept",
    lessonId: "a2-core",
    prompt: "趋势中回调出现三推衰竭而非标准二腿，这时候更接近哪个 setup？",
    options: ["更接近 W1P（wedge pullback），不是标准 A2", "仍然是 A2 因为最终也是顺势入场", "三推和二腿完全一样没有区别", "三推说明趋势已经结束不能做任何 setup"],
    answer: "更接近 W1P（wedge pullback），不是标准 A2",
    explanation: "A2 强调二腿回调，W1P 强调三推楔形。分类不同意味着确认和执行细节不同。",
    whyWrong: {
      "仍然是 A2 因为最终也是顺势入场": "顺势入场不等于同一 setup，分类正确才能正确执行和复盘。",
      "三推和二腿完全一样没有区别": "结构节奏不同，W1P 需要第三推衰竭确认而非简单二腿失败。",
      "三推说明趋势已经结束不能做任何 setup": "三推回调后趋势可能继续，关键是用正确框架评估。"
    }
  },
  {
    id: "exam-a2-boundary-2",
    mode: "concept",
    lessonId: "a2-quality-filter",
    prompt: "下跌后在前低附近两次测试支撑，第二次测试失败后出现强阳反转。这更接近 A2 还是 DP？",
    options: ["更接近 DP（双测边界反转），而非趋势延续的 A2", "是 A2 因为有两腿结构", "两个名字可以互换使用", "无法判断因为任何反转都一样"],
    answer: "更接近 DP（双测边界反转），而非趋势延续的 A2",
    explanation: "A2 是趋势中的回调延续，DP 是边界双测反转。两者方向可能相反，分类影响 target 和 context。",
    whyWrong: {
      "是 A2 因为有两腿结构": "两腿只是形状，A2 要求趋势背景和顺势延续语境。",
      "两个名字可以互换使用": "setup 名称定义了不同的交易逻辑和风险管理。",
      "无法判断因为任何反转都一样": "反转有不同结构语境，分类正确才能有效复盘和学习。"
    }
  }
];

export const glossary: GlossaryEntry[] = [
  {
    id: "a2",
    term: "A2",
    chinese: "第二次尝试结束回调 / 二腿回调延续入场",
    category: "setup",
    pdfEnglish: "A2; a 2 legged pullback to the ema; the second attempt to end the pullback; two failed attempts to reverse the trend, i.e. failed L2",
    short: "趋势中二腿回调到 EMA 附近后，第二次逆趋势尝试失败形成的顺势延续入场。",
    detail: "A2 不是“碰到 EMA 就买/卖”，而是趋势、二腿序列、EMA/趋势线位置、信号 K 和风险收益同时成立。做多 A2 要能标出 Leg1、fL1、Leg2、L2/fL2；做空 A2 镜像为 H1、fH1、H2/fH2。",
    example: "上升趋势 HH-HL 后，价格两腿回调到 EMA，L2 后强阳信号 K，Buy Stop 在高点上方 1 tick。"
  },
  {
    id: "a22",
    term: "A22",
    chinese: "A2 的第二入场",
    category: "setup",
    pdfEnglish: "A second entry for an A2, taken perhaps because the first signal required a large stop or had a large overlap.",
    short: "第一根 A2 信号弱、重叠多或止损过宽时，等待第二个更清楚信号重新定义风险。",
    detail: "A22 不是错过第一笔后的追单。它必须仍在原趋势语境内，并且第二个信号 K 比第一个更可执行。A22 要用新信号 K 自己的高低点重新计算 entry、stop、target。",
    example: "第一根 A2 是 Doji 且 OL，先跳过；后面出现强阳 A22，再用新高点 +1t 触发。"
  },
  {
    id: "fA2",
    term: "fA2",
    chinese: "失败的 A2",
    category: "setup",
    pdfEnglish: "failed A2; fRev + fA2; failed A2 is usually an indication of two more legs in the new direction",
    short: "A2 触发后没有延续，反而打掉 initial stop，说明原趋势延续尝试失败。",
    detail: "fA2 是信息，不是情绪按钮。它可能提示趋势终结、新方向两腿，也可能只是进入 TR/BW。新手默认等待两个摆动或价格离开 choppy action，再重新评估。",
    example: "做多 A2 触发后下一根强阴跌破信号 K 低点，标记 fA2，不立刻报复性反手。"
  },
  {
    id: "leg1",
    term: "Leg1 / 1st Leg",
    chinese: "第一腿",
    category: "structure",
    pdfEnglish: "first leg; 1st pullback; 2 legged pullback",
    short: "从趋势极点开始，向回调方向推进的第一段运动。",
    detail: "A2 的序列训练必须先数 leg。做多时，Leg1 是从 HH 后向下的第一段回调；做空时，Leg1 是从 LL 后向上的第一段反弹。只有一腿不能叫 A2。",
    example: "上升趋势创新高后，价格第一次连续向下推进到 L1/leg1。"
  },
  {
    id: "l1",
    term: "L1",
    chinese: "第一次向下突破 / 第一腿低点尝试",
    category: "bar",
    pdfEnglish: "L1; first time price goes below the low of a prior bar in an up move",
    short: "上升趋势或上升腿中，第一次跌破前一根 K 低点的向下尝试。",
    detail: "L1 代表空头第一次试图结束上升趋势。强趋势里 L1 有时会工作，但 PDF 明确建议新手先只做 A2，不把 L1 当第一阶段主 setup。",
    example: "HH 后第一根跌破前低的回调 K，标为 L1。"
  },
  {
    id: "fl1",
    term: "fL1",
    chinese: "失败的 L1",
    category: "bar",
    pdfEnglish: "failed L1; fL1",
    short: "L1 后价格回升，说明第一次向下反转尝试失败。",
    detail: "fL1 让 A2 的二腿结构开始成立。没有 fL1，就只有一腿回调；新手不能把一腿后的强阳线误叫成 A2。",
    example: "L1 后出现反弹，但没有反转趋势，标为 fL1，随后等待 Leg2。"
  },
  {
    id: "leg2",
    term: "Leg2 / 2nd Leg",
    chinese: "第二腿",
    category: "structure",
    pdfEnglish: "second leg; 2 legged pullback",
    short: "fL1/fH1 后再次向回调方向推进的第二段运动。",
    detail: "第二腿是 A2 的核心结构。做多时，Leg2 再次向下测试 EMA/趋势线；做空时，Leg2 再次向上反弹到 EMA/趋势线附近。第二腿离 EMA 太远时，要警惕第三推或 W pullback。",
    example: "fL1 后价格再跌到 EMA 附近，形成 Leg2 和 L2。"
  },
  {
    id: "l2",
    term: "L2",
    chinese: "第二次向下突破",
    category: "bar",
    pdfEnglish: "L2; second attempt down; failed L2",
    short: "上升趋势回调中，第二次跌破前 K 低点的尝试；失败后可形成做多 A2。",
    detail: "PDF 把 A2 也描述为 two failed attempts to reverse the trend, i.e. failed L2。做多 A2 的关键不是 L2 本身，而是 L2 失败后出现合格多头信号。",
    example: "第二腿末端 L2 触及 EMA，随后强阳线突破，表示 fL2。"
  },
  {
    id: "fl2",
    term: "fL2",
    chinese: "失败的 L2",
    category: "bar",
    pdfEnglish: "failed L2; fL2",
    short: "第二次向下反转尝试失败，是做多 A2 的直接机制。",
    detail: "fL2 出现后并不自动入场，还要看信号 K 是否强、是否少重叠、是否靠近 EMA/趋势线、stop 是否不大于 target。",
    example: "L2 后强阳收盘，Buy Stop 放在该信号 K 高点上方 1 tick。"
  },
  {
    id: "h1",
    term: "H1",
    chinese: "第一次向上突破",
    category: "bar",
    pdfEnglish: "H1; first time price goes above the high of a prior bar in a down move",
    short: "下降趋势反弹中，第一次突破前一根 K 高点的向上尝试。",
    detail: "H1 是做空 A2 的镜像术语，表示多头第一次试图结束下降趋势。强下降趋势中 H1 有时有效，但新手仍先只做清楚 A2。",
    example: "下降趋势 LL 后第一次反弹突破前高，标为 H1。"
  },
  {
    id: "fh1",
    term: "fH1",
    chinese: "失败的 H1",
    category: "bar",
    pdfEnglish: "failed H1; fH1",
    short: "H1 后价格重新下跌，说明第一次向上反转尝试失败。",
    detail: "fH1 让做空 A2 的二腿反弹结构开始成立。后面若再出现第二腿向上，并在 EMA 附近失败，才进入做空 A2 评估。",
    example: "H1 反弹后强阴回落，标为 fH1。"
  },
  {
    id: "h2",
    term: "H2",
    chinese: "第二次向上突破",
    category: "bar",
    pdfEnglish: "H2; second attempt up; failed H2",
    short: "下降趋势回调中，第二次突破前 K 高点的尝试；失败后可形成做空 A2。",
    detail: "H2 是做空 A2 的关键节点。真正的做空机会来自 H2/fH2 后出现强空头信号 K，并用 Sell Stop 在低点下方 1 tick 触发。",
    example: "第二腿反弹到 EMA 附近，H2 后强阴线给出做空 A2。"
  },
  {
    id: "fh2",
    term: "fH2",
    chinese: "失败的 H2",
    category: "bar",
    pdfEnglish: "failed H2; fH2",
    short: "第二次向上反转尝试失败，是做空 A2 的直接机制。",
    detail: "fH2 说明多头第二次尝试结束下降趋势失败，但仍需确认信号 K、目标空间、是否在 TR/BW 底部附近。",
    example: "H2 到 EMA 附近失败，强阴信号 K 低点下方 1 tick 触发做空。"
  },
  {
    id: "signal",
    term: "Signal Bar",
    chinese: "信号 K 线",
    category: "bar",
    pdfEnglish: "signal bar; well formed bar; strong close; little overlap",
    short: "用于定义 entry 和 initial stop 的 K 线。",
    detail: "信号 K 不是单独看形状，而是上下文里的执行边界。合格信号通常强收盘、实体清楚、与前 K 重叠少、靠近 EMA/趋势线/突破位，并且 stop 不过宽。",
    example: "做多 A2 的强阳信号 K：高点 +1t 是 entry，低点 -1t 是 initial stop。"
  },
  {
    id: "entry-bar",
    term: "Entry Bar",
    chinese: "入场 K 线",
    category: "bar",
    pdfEnglish: "entry bar; strong entry bar; entry bar low is not taken out by more than 1t",
    short: "触发信号 K 外侧订单并确认交易进入执行阶段的 K 线。",
    detail: "Entry bar 的质量影响后续 swing。强 entry bar 应该有跟随；如果 entry bar 与 signal bar 高度重叠，甚至后续两根仍重叠，要警惕 channel 或 BW。",
    example: "A2 信号 K 后，下一根突破高点成交并强收盘，是较好的 entry bar。"
  },
  {
    id: "entry",
    term: "Entry",
    chinese: "入场触发价",
    category: "risk",
    pdfEnglish: "long entry is 1 tick above the signal bar; short entry is mirrored below the signal bar",
    short: "A2 真正成交的触发价，不是信号 K 收盘价。",
    detail: "做多 entry = 信号 K 高点 +1t；做空 entry = 信号 K 低点 -1t。未触发就没有交易，不追价，不改成市价成交。",
    example: "A2 long 只在 H + 1t 的 Buy Stop 成交后才进入交易。"
  },
  {
    id: "initial-stop",
    term: "Initial Stop",
    chinese: "初始止损",
    category: "risk",
    pdfEnglish: "stop is 1 tick below the signal bar; stop should not be larger than your target",
    short: "入场前定义的 setup 失效价。",
    detail: "做多 stop = 信号 K 低点 -1t；做空 stop = 信号 K 高点 +1t。stop 不是随便放小一点，而是 setup 失效位置。若 stop 大于 target，训练阶段跳过。",
    example: "做多 A2 的信号 K low 下方 1 tick 被打掉，标记 fA2。"
  },
  {
    id: "target",
    term: "Target",
    chinese: "目标",
    category: "risk",
    pdfEnglish: "target is 4 ticks or more above your entry; stop should not be larger than your target",
    short: "入场前定义的获利目标，至少要能覆盖风险。",
    detail: "PDF 的基础语言是 4 ticks or more；更大的目标要来自结构，例如前高/前低、通道线、measured move 或 swing plan。不能因为想赚更多随意设远目标。",
    example: "Entry 上方至少 +4t，若 signal bar stop 比 target 还大，跳过。"
  },
  {
    id: "first-target",
    term: "First Target",
    chinese: "第一目标",
    category: "risk",
    pdfEnglish: "1st target is +10t for half size; first target filled",
    short: "分仓管理中的第一获利点，PDF 示例为半仓 +10t。",
    detail: "first target 是风险管理示例，不等于所有 A2 都机械固定。关键是 first target filled 前不要随意 loosen/tighten stop；成交后才能处理 balance stop。",
    example: "first target filled 后，balance stop 移到 entry price。"
  },
  {
    id: "breakeven",
    term: "Breakeven Stop",
    chinese: "保本止损",
    category: "risk",
    pdfEnglish: "move stop on balance to your entry price and let it run",
    short: "第一目标成交后，把剩余仓位止损移到入场价。",
    detail: "breakeven stop 用于让 swing portion 在不再亏损本金的前提下运行。它不是随意移动 stop；只有 first target filled 或计划条件满足后才执行。",
    example: "半仓 first target 成交，剩余 half size 的 stop 移到 entry price。"
  },
  {
    id: "BW",
    term: "BW / Barb Wire",
    chinese: "Barb Wire / 铁丝网横盘",
    category: "structure",
    pdfEnglish: "Barb wire. Three or more horizontal bars with at least one being a doji. Similar to TTR.",
    short: "三根以上横向重叠 K，至少一根 Doji；方向控制不清。",
    detail: "BW 是 A2 新手训练的硬过滤项。它的问题不是没有任何 K 看起来像信号，而是市场没有方向优势。BW 内部的 A2 很容易 1tf/5tf 或被区间边界拦截。正确动作是等待强突破后 BP，或继续停手。",
    example: "EMA 附近 5 根小实体长影线互相重叠，其中两根 Doji；即使出现二腿，也标 skip BW/OL。"
  },
  {
    id: "ol",
    term: "OL / Overlap",
    chinese: "重叠",
    category: "structure",
    pdfEnglish: "overlap; overlapped bars; large overlap; signal and entry bars are poor, i.e. overlapped and taily",
    short: "多根 K 的价格范围大量重合，说明买卖双方都没有清楚接管。",
    detail: "OL 是比 BW 更通用的质量描述。一个 A2 可以有二腿，但如果信号 K、entry bar、后续 K 都与前面高度重叠，交易质量要降级。OL 会增加 1tf、5tf、breakeven stop 被打、channel 化的概率。",
    example: "A2 信号 K 与前三根 K 高低区间重合，下一根 entry bar 也没有脱离，标为 weak A2 / wait A22。"
  },
  {
    id: "TTR",
    term: "TTR / Tight Trading Range",
    chinese: "极窄交易区间",
    category: "structure",
    pdfEnglish: "TTR; tight trading range; bars suddenly turn tiny and doji-like in a strong trend could be TTR",
    short: "很小范围内来回反转、K 线变小、Doji 增多的横向状态。",
    detail: "TTR 与 BW 一样会破坏 A2 优势。趋势进入 TTR 后，持仓者要警惕趋势终结，空仓者不应在内部硬找 A2。PDF 也把 TTR 列为 trend termination 信号之一。",
    example: "上涨后 K 线突然变小，连续 doji-like，在窄范围内来回，标 TTR 并停止新 A2。"
  },
  {
    id: "BP",
    term: "BP / Breakout Pullback",
    chinese: "突破回调",
    category: "setup",
    pdfEnglish: "breakout pullback; if breakout does not fail after two or three bars then it is more likely to give a breakout pullback",
    short: "突破成功后，价格回测突破位附近产生的入场机会。",
    detail: "BP 不是区间内部的小二腿。它必须先有强突破，且突破没有在两三根内失败；随后回调不重新进入区间，再评估顺突破方向信号。",
    example: "TR 向上强突破两根收在区间外，二腿回调到突破位上方出现强阳 BP A2。"
  },
  {
    id: "bp-a2",
    term: "BP A2 / Breakout Pullback A2",
    chinese: "突破回调 A2",
    category: "setup",
    pdfEnglish: "A 2 legged pullback after a breakout is possibly the first A2 in a new trend and is a high probability trade.",
    short: "突破成功后的二腿回调 A2，常是新趋势中的第一组 A2。",
    detail: "BP A2 的质量来自市场状态转换：从 TR/BW 转为趋势。它仍然要求二腿、信号 K、entry/stop/target 完整，不是追第一根突破 K。",
    example: "开盘区间突破成功后，第一次 2L pullback 到 EMA/突破位，出现信号 K。"
  },
  {
    id: "channel",
    term: "Channel",
    chinese: "通道 / 重叠漂移",
    category: "structure",
    pdfEnglish: "Channels are heavily overlapped regions of price action that drift up or down in a chart.",
    short: "有方向，但 K 线高度重叠、长影线多、回撤深的漂移结构。",
    detail: "Channel 不等于 normal trend。普通 signal-bar breakout 和 fixed stop 在 channel 中会变弱。若 entry bar 与后续两根仍重叠 signal bar，PDF 认为你已经进入 channel mode。新手应等待 channel break 或更清楚 pullback。",
    example: "价格整体向上，但每根 K 都重叠且交替颜色，A2 外观存在也先 skip。"
  },
  {
    id: "bwc",
    term: "BWC / Barb Wire Channel / Sloping Barbwire",
    chinese: "倾斜 Barb Wire / 铁丝网通道",
    category: "structure",
    pdfEnglish: "bars with tails on both ends should be viewed as sloping barbwire or barb wire channels (BWC). These should be traded just like BW.",
    short: "有斜率但本质仍高度重叠、长影线多的 BW 式通道。",
    detail: "BWC 容易让新手误以为“有趋势方向，所以 A2 有效”。PDF 的处理是把它像 BW 一样对待：先降低交易欲望，等待清楚 break 或新结构。",
    example: "缓慢上移但每根 K 上下影线长、互相重叠，标 BWC，不按 clean A2 做。"
  },
  {
    id: "normal-trend",
    term: "Normal Trend",
    chinese: "正常趋势",
    category: "structure",
    pdfEnglish: "normal trend; A2 in a normal trend",
    short: "A2 的主训练环境：趋势清楚、pullback 两腿、信号少重叠。",
    detail: "Normal trend 里，A2 是最适合新手集中训练的 continuation setup。你应该先掌握 normal trend A2，再研究 hard trend、soft trend、channel 等例外。",
    example: "HH-HL、EMA 上行，二腿回调到 EMA 后强阳信号。"
  },
  {
    id: "hard-trend",
    term: "Hard Trend",
    chinese: "强硬趋势",
    category: "structure",
    pdfEnglish: "In a strong trend, you may have H1s and L1s that work, but new traders should just stick to A2.",
    short: "强到很少给二腿的趋势，L1/H1 有时有效。",
    detail: "Hard trend 是进阶例外，不是新手放宽规则的借口。Coach 第一阶段只要求识别它，并避免在强趋势里逆势，也不把每个 L1/H1 都加入实盘。",
    example: "连续趋势 K 上涨，第一次小 L1 就继续涨；新手只记录，不作为 A2 主训练。"
  },
  {
    id: "soft-trend",
    term: "Soft Trend",
    chinese: "柔性趋势",
    category: "structure",
    pdfEnglish: "soft trend where you should buy every fL2; overlapped signal bars and doji signal bars can work with-trend on very strong days",
    short: "趋势仍在，但重叠更多，fL2/fH2 更常见。",
    detail: "Soft trend 容易与 BW 混淆。PDF 允许经验交易者在强趋势语境下接受一些重叠/Doji 信号，但新手第一阶段仍应跳过模糊样本或等待 A22。",
    example: "EMA 上行但回调 K 重叠多；只接受最清楚的 fL2，不把所有 OL 都当 A2。"
  },
  {
    id: "1tf",
    term: "1tf / 1 Tick Failure",
    chinese: "1 tick 失败",
    category: "risk",
    pdfEnglish: "1 tick failure. Price goes 1 tick beyond prior bar triggering the trade and proceeds to take out stop. Similarly 5tf, 9tf.",
    short: "价格刚突破触发 1 tick 就反向打止损。",
    detail: "1tf 常出现在弱信号 K、BW/OL、channel、止损过宽或方向不清的环境。它是复盘弱 A2 的重要标签，不是随机坏运气的代名词。",
    example: "Doji A2 高点上方 1t 成交后马上下跌打 stop，标 1tf。"
  },
  {
    id: "5tf",
    term: "5tf / 5 Tick Failure",
    chinese: "5 tick 失败",
    category: "risk",
    pdfEnglish: "5 tick failure; breakout goes 5 ticks above an entry and turns down",
    short: "突破后只推进约 5 ticks 就反向失败。",
    detail: "5tf 有时能增强反向信号，但不是魔法公式。对 A2 新手而言，主要用于标记触发后跟随不足、信号质量差或环境噪音。",
    example: "A2 触发后只走 5t 便反向，后续形成强反向 K，记录为 5tf 风险。"
  },
  {
    id: "mae",
    term: "MAE / Maximum Adverse Excursion",
    chinese: "最大不利波动",
    category: "risk",
    pdfEnglish: "Maximum Adverse Excursion (MAE); entries that pulled back beyond 4t after triggering and were eventually profitable less than 10% of the time",
    short: "入场后价格对持仓方向的最大回撤，用于评估 entry 质量。",
    detail: "MAE 不是让你随意提前止损，而是帮助判断 swing quality。PDF 的观察是，真正好的 swing entry 通常触发后回撤很小；超过 4t 后要降级记录。",
    example: "A2 触发后回撤 5t 才反弹，即使最后盈利，也记录为低质量 swing entry。"
  },
  {
    id: "buy-stop",
    term: "Buy Stop",
    chinese: "突破买入止损单",
    category: "risk",
    pdfEnglish: "enter above a bull signal bar; long entry is 1 tick above the signal bar",
    short: "做多时放在信号 K 高点上方 1 tick 的触发订单。",
    detail: "Buy Stop 保证只有价格真正突破信号 K 才入场。未触发就取消或等待 A22，不能把收盘追价当作同一条规则。",
    example: "A2 long 信号 K 高点为 H，Buy Stop = H + 1t。"
  },
  {
    id: "sell-stop",
    term: "Sell Stop",
    chinese: "突破卖出止损单",
    category: "risk",
    pdfEnglish: "sell below any bear bar; short entry is mirrored below the signal bar",
    short: "做空时放在信号 K 低点下方 1 tick 的触发订单。",
    detail: "Sell Stop 是做空 A2 的镜像执行。成交前必须已经定义高点上方 1 tick 的 initial stop 和目标空间。",
    example: "A2 short 信号 K 低点为 L，Sell Stop = L - 1t。"
  },
  {
    id: "no-trigger",
    term: "No Trigger",
    chinese: "未触发",
    category: "risk",
    pdfEnglish: "If the pattern does not trigger, you no longer take the trade.",
    short: "信号 K 后价格没有突破触发价，因此没有交易。",
    detail: "No Trigger 是纪律标签。它不是失败，也不是错过；它说明市场没有确认信号 K。下一笔必须用新信号重新定义 entry/stop。",
    example: "Buy Stop 没成交，后面进入 OL，旧 A2 计划取消。"
  },
  {
    id: "limit-entry",
    term: "Limit Entry",
    chinese: "限价入场",
    category: "risk",
    pdfEnglish: "The first step you need to take is to eliminate limit entries.",
    short: "试图用更好价格提前成交的入场方式；PDF 建议新手先消除。",
    detail: "Limit entry 需要更高市场阅读能力。A2 第一阶段训练要用 signal bar 外侧触发，避免为了省 tick 破坏可复盘规则。",
    example: "想在信号 K 内部提前买入省 2 ticks，训练阶段直接禁止。"
  },
  {
    id: "oco",
    term: "OCO / One-Cancels-Other",
    chinese: "二择一订单",
    category: "risk",
    pdfEnglish: "Most trading platforms support OCO orders where you can set stops and targets to cancel each other.",
    short: "stop 与 target 成对管理，一个成交后另一个取消。",
    detail: "OCO 的作用是把交易计划变成订单纪律。入场前或入场后立即设好 stop/target，减少盯盈亏临场改规则。",
    example: "A2 触发后，target 成交则 stop 自动取消；stop 成交则 target 自动取消。"
  },
  {
    id: "room-profit",
    term: "Room for Profit",
    chinese: "目标空间",
    category: "risk",
    pdfEnglish: "Room for profit takes quite a bit of experience to judge.",
    short: "从 entry 到合理目标之间是否有足够空间覆盖风险。",
    detail: "Room for profit 是 A2 风险过滤。正常趋势中回调往往至少测试前极点 1 tick，但 BW、tiny bars、前方阻力太近都会破坏目标空间。",
    example: "做多 A2 上方马上是 TR 顶，target 空间不足，跳过。"
  },
  {
    id: "scalp",
    term: "Scalp",
    chinese: "固定小目标获利",
    category: "risk",
    pdfEnglish: "A scalp is a pre-defined amount of profit; the smallest possible scalp is 1 tick in futures.",
    short: "不管行情最终走多远，先按预定义小目标获利。",
    detail: "Scalp 通常与风险大小相关。PDF 强调新手若只靠 scalp 可能最多 breakeven，真正盈利需要识别 swingable entries。",
    example: "A2 到 first target 先出一部分，剩余尝试 swing。"
  },
  {
    id: "swing",
    term: "Swing / Swing Portion",
    chinese: "较大摆动持仓 / 剩余仓位",
    category: "risk",
    pdfEnglish: "A swing is a large undetermined move many times the size of the original risk; A2 is one of the best swingable setups.",
    short: "尝试捕捉远大于初始风险的未定大移动。",
    detail: "Swing 不是死拿。要有合理预期：下一次 pullback 不会打掉 breakeven stop。A2、1PB、W1P 是书中提到更适合 swing 的 setup。",
    example: "first target 后 balance stop 移到 entry，若趋势继续干净则持有 swing portion。"
  },
  {
    id: "rule10",
    term: "Rule of 10",
    chinese: "十规则",
    category: "psychology",
    pdfEnglish: "10 points every week; 10 consecutive weeks; 10 days no losing trades; 10 consecutive winning days; max losing day no more than half average winning day",
    short: "从 SIM/训练走向真实资金前的稳定性闸门。",
    detail: "Rule of 10 不是知识测验，而是执行证据。未满足前，Coach 只能用于学习、回放和 SIM，不能证明你已经能实盘。",
    example: "只做 A2，连续记录每周 points、无亏损日、连续盈利日和最大亏损日。"
  },
  {
    id: "sim",
    term: "SIM / Simulator Trading",
    chinese: "模拟交易",
    category: "psychology",
    pdfEnglish: "The first thing you do is to trade for a while on a simulator (SIM).",
    short: "不承担真实资金风险的执行训练阶段。",
    detail: "SIM 的目的不是炫耀盈利，而是学习下单、移动 stops、避免买卖方向/数量错误，并把 A2 执行稳定性记录下来。",
    example: "第一阶段只做 A2，所有非 A2 冲动只能标图，不下单。"
  },
  {
    id: "two-strikes",
    term: "2/5 Rule / Two Strikes",
    chinese: "两亏五笔规则",
    category: "risk",
    pdfEnglish: "If you lose two trades, you are done for the day; done for the day if you took five trades total.",
    short: "一天亏两笔停止，最多五笔交易停止，防止过度交易。",
    detail: "2/5 的目标是让交易者专注 major moves，避免 stopped out 后立刻情绪化重进。它是 A2 学习系统的纪律边界。",
    example: "第二笔亏损后，即使看到 A2，也只标注不下单。"
  },
  {
    id: "wait-two-swings",
    term: "Wait Two Swings",
    chinese: "等待两个摆动",
    category: "psychology",
    pdfEnglish: "stay out for two swings or until price moves away from choppy action",
    short: "止损后等待市场给出新结构，再考虑下一笔。",
    detail: "等待两个摆动的作用是切断报复性交易。fA2 后尤其重要，因为失败可能意味着趋势终结、TR 或新方向，而不是马上反手。",
    example: "A2 止损后，不马上找下一根 K，等两个摆动完成再评估。"
  },
  {
    id: "emini",
    term: "Emini / E-mini",
    chinese: "Emini 交易语境",
    category: "risk",
    pdfEnglish: "Price Action trading on the Emini; E-mini",
    short: "PDF 标题使用 Emini，正文也写 E-mini；Coach 只按书中的 Emini price action 语境训练。",
    detail: "本 Coach 不引入 MES、外部合约规格或 0.25 tick 换算。书中 A2 规则用 1 tick、4 ticks、points 等相对交易语言表达。",
    example: "所有 A2、A22、fA2、BP A2 案例都只按 Emini 图表语境训练。"
  },
  {
    id: "tick",
    term: "Tick / t",
    chinese: "一跳",
    category: "risk",
    pdfEnglish: "1 tick; 4 ticks; 5t; 10t",
    short: "PDF 使用的相对价格单位，用来定义 entry、stop、failure 和 target。",
    detail: "Coach 只复刻书中的相对 tick 语言：H + 1t、L - 1t、target 4 ticks or more、MAE 0t-4t 等，不加入外部换算。",
    example: "做多 entry = 信号 K 高点 +1t；stop = 信号 K 低点 -1t。"
  },
  {
    id: "trade-log",
    term: "Trade Log",
    chinese: "交易日志",
    category: "psychology",
    pdfEnglish: "make a note of the kind of setup and let the market take you out",
    short: "记录 setup、entry、stop、target、MAE、离场和违规的训练证据。",
    detail: "日志要能回答错误发生在哪一层：结构误判、序列误判、信号 K 弱、风险收益不合格、未触发追价、止损后重进，还是离场纪律问题。",
    example: "每笔 A2 候选记录：market state、Leg1/fL1/Leg2/fL2、entry、stop、target、MAE、exit reason。"
  },
  {
    id: "bar-by-bar",
    term: "Bar-by-bar Marking",
    chinese: "逐 K 标注",
    category: "psychology",
    pdfEnglish: "bar-by-bar; make a note of the kind of setup",
    short: "按每根 K 标结构、序列、信号、执行和跳过原因。",
    detail: "逐 K 标注是从“看懂答案”到“自己识别 A2”的桥。每个候选只能给一个明确结论：trade、wait A22、skip BW/OL、skip far from EMA、skip risk/reward、exit。",
    example: "先标 market state，再标 Leg1/fL1/Leg2/fL2，最后写 H+1t、L-1t、target。"
  },
  {
    id: "hh-ll",
    term: "HH / LL",
    chinese: "更高高点 / 更低低点",
    category: "structure",
    pdfEnglish: "HH; LL; two HH and a HL; two LL and a LH",
    short: "判断趋势方向的基本 swing 结构。",
    detail: "HH-HL 支持做多 A2；LL-LH 支持做空 A2。只有单根强 K 但没有 swing 结构，不能证明 A2 背景成立。",
    example: "上涨形成 HH 后，等待 HL 的二腿回调找 A2 long。"
  },
  {
    id: "hl-lh",
    term: "HL / LH",
    chinese: "更高低点 / 更低高点",
    category: "structure",
    pdfEnglish: "HL; LH; first higher low; first lower high",
    short: "趋势或反转后第一次回调结构的重要标记。",
    detail: "HL/LH 可用于判断趋势方向和 channel 方向。A2 做多常发生在上升趋势 HL 区域；做空 A2 常发生在下降趋势 LH 区域。",
    example: "强突破后第一次二腿 HL 可能是新趋势的第一个 A2。"
  },
  {
    id: "tl",
    term: "TL / Trendline",
    chinese: "趋势线",
    category: "structure",
    pdfEnglish: "Trendline. A line connecting swing lows in an up move or swing highs in a down move.",
    short: "连接 swing lows 或 swing highs 的结构线。",
    detail: "A2 不只靠 EMA，也可以发生在趋势线附近。Classic A2 还会观察回调内部小趋势线是否被突破或失效。",
    example: "第二腿回调到 EMA 与 TL 附近，强信号 K 触发。"
  },
  {
    id: "tcl",
    term: "TCL / Trend Channel Line",
    chinese: "趋势通道线",
    category: "structure",
    pdfEnglish: "Trend Channel Line; a parallel line drawn to the TL",
    short: "与 TL 平行或连接另一侧 swing 的通道边界。",
    detail: "TCL 过冲（OS）可能提示趋势衰竭、第三推或 W 风险。A2 发生在趋势末端时要结合 TCL/OS 判断是否降级。",
    example: "第三推冲出 TCL 后，后续弱 A2 不再按普通延续处理。"
  },
  {
    id: "os",
    term: "OS / Overshoot",
    chinese: "过冲",
    category: "structure",
    pdfEnglish: "overshoot; trend channel overshoot; TCL OS",
    short: "价格明显超出趋势线或趋势通道线。",
    detail: "OS 本身不是交易信号，但它是趋势终结或回调加深的线索。A2 远离 EMA 且伴随 OS 时，要警惕第三推或反转风险。",
    example: "强上涨第三推过冲 TCL 后，弱 A2 要降级。"
  },
  {
    id: "or",
    term: "OR / Opening Range",
    chinese: "开盘区间",
    category: "structure",
    pdfEnglish: "opening range; first bar can be treated as a small trading range",
    short: "开盘初期形成的交易区间，新手先观察，不急着抢 1Rev/1PB。",
    detail: "开盘语境复杂。第一根 K 可能给出 HOD/LOD，也可能形成 BW/opening range。新手更适合等待初始趋势后的第一组清楚 2L pullback/A2。",
    example: "开盘前几根上下重叠，标 OR，等待强突破后的 BP A2。"
  },
  {
    id: "hod-lod",
    term: "HOD / LOD",
    chinese: "日内高点 / 日内低点",
    category: "structure",
    pdfEnglish: "high of day; low of day; HOD; LOD",
    short: "当天当前最高点和最低点，是开盘、突破和目标判断的重要位置。",
    detail: "HOD/LOD 常成为突破、失败突破、目标和趋势判断的参考。开盘第一根 K 特殊，因为它同时给出新的 HOD 和 LOD。",
    example: "突破 HOD 后不失败，后续二腿回调可能成为 BP A2。"
  },
  {
    id: "mm",
    term: "Measured Move",
    chinese: "测量目标",
    category: "risk",
    pdfEnglish: "measured move; reach the measured move of the opening range",
    short: "用前一段结构高度推算目标，例如区间高度突破后的等幅目标。",
    detail: "Measured Move 是结构目标，不是固定 ticks。BP A2、OR breakout、channel/spike 语境都可能用 measured move 估算 room for profit。",
    example: "开盘区间高度为 X，突破成功后目标可参考区间等幅 measured move。"
  },
  {
    id: "tt",
    term: "TT / Trend Termination",
    chinese: "趋势终结",
    category: "structure",
    pdfEnglish: "Trend termination (TT); not something to trade but rather a sign to exit your trend positions.",
    short: "趋势优势下降，提示持仓者退出或停止新顺势入场。",
    detail: "TT 不是新手反手信号。常见线索包括 double top/bottom、TTR、弱反转后弱 A2、fA2 无跟随。",
    example: "上升趋势末端 DT + TTR + 弱 A2，持仓者考虑退出，空仓者停手。"
  },
  {
    id: "db",
    term: "DB / Double Bottom",
    chinese: "双底",
    category: "structure",
    pdfEnglish: "double bottom; DB",
    short: "两次测试相近低点，可能提示支撑或趋势终结。",
    detail: "DB 在下降趋势末端可能提示空头优势下降。若做空 A2 出现在 DB 附近且信号弱，要降级或跳过。",
    example: "下降趋势后两次测试相同低点，后续弱做空 A2 不再 clean。"
  },
  {
    id: "dt",
    term: "DT / Double Top",
    chinese: "双顶",
    category: "structure",
    pdfEnglish: "double top; DT",
    short: "两次测试相近高点，可能提示阻力或趋势终结。",
    detail: "DT 在上升趋势末端可能提示多头优势下降。若弱做多 A2 出现在 DT/TTR 后，要按趋势终结风险处理。",
    example: "上升趋势后第二次测试前高失败，后面弱 A2 应跳过。"
  },
  {
    id: "climax",
    term: "Climax / Undeserved Gain",
    chinese: "高潮推进 / 意外收益",
    category: "structure",
    pdfEnglish: "climax; undeserved gains; bars that shock the trader with good fortune are often exit candidates",
    short: "突然强推可能提示趋势临近终结，是候选退出线索。",
    detail: "A2 swing 后如果出现让人意外的强推进，PDF 倾向于把它视为候选退出，而不是无条件期待更大目标。",
    example: "持有 swing 时突然一根巨大趋势 K 远超预期，考虑退出或收紧。"
  },
  {
    id: "pullback-trendline",
    term: "Pullback Trendline Break",
    chinese: "回调趋势线突破",
    category: "structure",
    pdfEnglish: "trendline break; pullback trendline break",
    short: "回调内部的小趋势线被突破或失效，帮助确认第二腿可能结束。",
    detail: "Classic A2 常不只是数两腿，还能看到回调自己的方向被打破。它提高样本清晰度，但仍要有强信号 K 和合理 stop/target。",
    example: "第二腿下破小下降趋势线后失败，强阳 K 触发 classic A2。"
  },
  {
    id: "money-stop",
    term: "Money Stop",
    chinese: "固定金额/点数止损",
    category: "risk",
    pdfEnglish: "money stop of 8 ticks; fixed stop",
    short: "不完全按信号 K 另一端，而用固定点数管理风险的止损方式。",
    detail: "PDF 提到 money stop，但第一阶段 A2 训练更重要的是识别信号 K 是否太大。若信号 K 风险超过目标，优先跳过，不靠随机缩 stop 硬做。",
    example: "信号 K 巨大导致 bar stop 过宽，新手不改用幻想 stop，而是跳过。"
  },
  {
    id: "gbar",
    term: "G / G2",
    chinese: "强确认 K / 第二确认",
    category: "bar",
    pdfEnglish: "G2; deep pullback; strong confirmation bar",
    short: "用于等待模糊 A2 后的更清楚确认信号。",
    detail: "G/G2 属于更广的 setup 语言。A2 第一阶段只需知道：如果第一信号 Doji/OL，可等待更清楚确认，而不是降低标准。",
    example: "Doji A2 跳过，后续强确认 K 出现再评估 A22/G2。"
  },
  {
    id: "frev",
    term: "fRev / Failed Reversal",
    chinese: "失败反转",
    category: "setup",
    pdfEnglish: "failed reversal; fRev + fA2",
    short: "反转尝试失败，可能回到原趋势、进入 TR，或与 fA2 形成趋势终结线索。",
    detail: "fRev 与 fA2 连续出现时，说明市场在测试方向转换。新手不应把它当立即反手许可，而应等待结构清楚。",
    example: "弱反转失败后又出现弱 A2 失败，标为 TT 风险。"
  },
  {
    id: "W1P",
    term: "W1P / First Pullback after Wedge",
    chinese: "楔形后第一回调",
    category: "setup",
    pdfEnglish: "W1P; first pullback after a W reversal",
    short: "W 反转后新方向的第一次回调。",
    detail: "PDF 建议新手先只做 A2，掌握后再把 W1P 加入 SIM。Coach 术语表保留它，是为了让你知道边界，不是第一阶段交易对象。",
    example: "三推顶部强反转后，第一次 LH 可形成 W1P short。"
  },
  {
    id: "mid-bar",
    term: "Mid-bar Decision",
    chinese: "K 线未收盘决策",
    category: "bar",
    pdfEnglish: "Never make mid-bar decisions, especially in a channel.",
    short: "在 K 线尚未完成时根据临时形状改变判断。",
    detail: "Channel 和 TR 中，盘中看似突破的形状收盘后可能变成长影线或 Doji。A2 训练只在信号 K 收盘后计划，触发后执行。",
    example: "看到盘中突破就追，收盘变成上影线，属于 mid-bar 决策错误。"
  },
  {
    id: "reward-probability-risk",
    term: "Reward * Probability > Risk",
    chinese: "风险收益关系",
    category: "risk",
    pdfEnglish: "reward * probability > risk OR reward > risk / probability",
    short: "交易必须同时考虑目标、胜率和风险。",
    detail: "这解释了为什么 stop 不能大于 target，以及为什么大信号 K 不一定是好交易。胜率不够高、风险又过宽时，形态正确也没有正期望。",
    example: "如果胜率约 50%，期待 4 ticks，风险不能随意放到 8 ticks。"
  }
];
