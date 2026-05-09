import type { TrainingGate } from "./types";

export const preTradeChecklist = [
  "当前市场状态不是 TTR/BW：能明确说出上升趋势、下降趋势、TR 突破后趋势，或选择停手。",
  "交易方向与当前趋势一致；PDF 明确说趋势中的反向信号大概率只是陷阱。",
  "能清楚标出 Leg1、fL1/fH1、Leg2、fL2/fH2；数不清就不是 A2。",
  "第二腿末端靠近 EMA、趋势线或突破位；远离关键位置就等待第三推或更深回调。",
  "信号 K 是强方向 K：实体清楚、收盘靠近极端、不是 Doji、重叠少。",
  "信号 K 不在 BW/OL 内，且止损距离没有大到超过合理目标。",
  "已经写下 entry、initial stop、target 和可能的 swing plan；没有写完整就不能挂单。",
  "今天没有达到 2/5 上限：两笔亏损停止，最多五笔交易停止。",
  "上一次止损后已经等待两个摆动，或价格已经离开被止损的混乱区。",
  "没有因为害怕错过、想追回亏损、或看到一根漂亮 K 而跳过流程。"
];

export const simTrainingGates: TrainingGate[] = [
  {
    id: "gate-knowledge",
    title: "知识闸门",
    requirement: "先完成基础读图，再能解释 A2、W1P、DP、fBO 的结构前提与过滤项。",
    evidence: "每次复盘都能标出 setup、市场状态、为什么交易或跳过，以及为什么不是另一个 setup。"
  },
  {
    id: "gate-chartmark",
    title: "标注闸门",
    requirement: "盘中有入场冲动时先在图上标记，收盘后检查这笔交易是否真的满足 setup 定义。",
    evidence: "记录冲动信号是否满足趋势/区间语境、位置、确认、信号 K、风险收益。"
  },
  {
    id: "gate-sim",
    title: "SIM 闸门",
    requirement: "先在 SIM 中学习下单、移动止损、犯低级错误，并且只做当前已掌握的 setup。",
    evidence: "交易日志必须显示每笔都通过 10 问清单；违规日不计入连续天数。"
  },
  {
    id: "gate-rule10",
    title: "Rule of 10 闸门",
    requirement: "达到 PDF 的 Rule of 10：每周至少 10 points，连续 10 周，至少 10 天无亏损交易，至少 10 个连续盈利日，最大亏损日最多为平均盈利日的一半。",
    evidence: "周报记录每周 points、无亏损交易日、连续盈利日、最大亏损日与平均盈利日。"
  },
  {
    id: "gate-live",
    title: "实盘闸门",
    requirement: "实盘前先证明自己能稳定区分 setup，并且仍只在 PDF 的 E-mini 语境下小规模执行。",
    evidence: "实盘后仍维持 2/5、wait two swings、每日/每周/月度亏损限制，并逐 setup 统计。"
  }
];

export const learningPath = [
  "先学 Bar：知道一根 K 线什么时候能当信号，什么时候只是噪音。",
  "再学 A2：把趋势中的二腿回调，练成可定义风险的基础 setup。",
  "再学 W1P / DP / fBO：把 reversal、double test、failed breakout 分清楚。",
  "最后考试和 SIM 闸门：用清单、回放、Rule of 10 验证自己是否能进入实盘。"
];
