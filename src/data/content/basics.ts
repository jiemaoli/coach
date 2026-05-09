import type { ExamQuestion } from "./types";

export const basicsExams: ExamQuestion[] = [
  // Signal Bar (bar module)
  {
    id: "exam-basics-bar-1",
    mode: "concept",
    lessonId: "signal-bar",
    prompt: "以下哪个因素最能区分高质量信号 K 和低质量信号 K？",
    options: ["收盘位置、重叠程度和止损宽度的综合评估", "K 线实体越大质量越高", "K 线颜色必须与趋势方向一致才合格", "K 线出现在整数关口附近就更可靠"],
    answer: "收盘位置、重叠程度和止损宽度的综合评估",
    explanation: "信号 K 质量取决于收盘位置、与前 K 重叠、止损宽度等多维度，不是单看实体大小或颜色。",
    whyWrong: {
      "K 线实体越大质量越高": "实体大但止损过宽或位置不对，仍然不合格。大实体是加分项，不是唯一标准。",
      "K 线颜色必须与趋势方向一致才合格": "颜色只是涨跌结果，收盘位置和重叠比颜色更关键。阴线收盘靠近高点也可以是做多信号。",
      "K 线出现在整数关口附近就更可靠": "整数关口可能是支撑阻力参考，但信号 K 质量主要看自身结构和上下文位置。"
    }
  },
  {
    id: "exam-basics-bar-2",
    mode: "concept",
    lessonId: "signal-bar",
    prompt: "信号 K 线出现在 BW 区域内，训练阶段正确做法是什么？",
    options: ["默认跳过", "只要实体大就可以做", "等 BW 结束后立刻追", "用更小时间级别找入场"],
    answer: "默认跳过",
    explanation: "BW 中双方都无法控制方向，即使偶尔成功也不适合训练。",
    whyWrong: {
      "只要实体大就可以做": "BW 中大实体常被下一根反转吞没。",
      "等 BW 结束后立刻追": "应等突破后的 BP 或 fBO 确认，不是追价。",
      "用更小时间级别找入场": "更小时间级别在 BW 中噪音更大，不会提高质量。"
    }
  },
  {
    id: "exam-basics-bar-3",
    mode: "execution",
    lessonId: "signal-bar",
    prompt: "一根做多候选信号 K 实体很大，止损（低点 -1t）远大于目标空间，正确处理是？",
    options: ["跳过，等更小止损的信号或 A22", "缩小止损到 K 线中部", "用 limit 在回调时入场省 tick", "因为方向对所以照做"],
    answer: "跳过，等更小止损的信号或 A22",
    explanation: "止损不应大于目标。不能靠缩小止损或提前入场绕开规则。",
    whyWrong: {
      "缩小止损到 K 线中部": "止损在信号 K 另一端 -1t 是规则，缩小止损只会被正常波动扫掉。",
      "用 limit 在回调时入场省 tick": "PDF 明确要求新手消除 limit entry。",
      "因为方向对所以照做": "方向对但风险收益不合格的交易仍然要跳过。"
    }
  },

  // TTR/BW structure
  {
    id: "exam-basics-structure-1",
    mode: "concept",
    lessonId: "ttr-bw",
    prompt: "TTR 和 BW 的共同核心含义是什么？",
    options: ["市场没有给出方向优势，新手应默认等待", "市场正在积蓄能量，突破方向已基本确定", "区间越窄说明趋势越强，应准备顺势加仓", "适合在区间上下边界反复高抛低吸赚差价"],
    answer: "市场没有给出方向优势，新手应默认等待",
    explanation: "TTR/BW 表示双方都无法推动价格离开小范围，此时没有可靠信号。",
    whyWrong: {
      "市场正在积蓄能量，突破方向已基本确定": "BW/TTR 可能长时间持续，且突破方向无法提前确定。",
      "区间越窄说明趋势越强，应准备顺势加仓": "窄区间恰恰说明双方都无法主导，不是趋势加速的信号。",
      "适合在区间上下边界反复高抛低吸赚差价": "区间极窄时空间不足，两端都容易被扫，高抛低吸的 edge 很低。"
    }
  },
  {
    id: "exam-basics-structure-2",
    mode: "concept",
    lessonId: "ttr-bw",
    prompt: "在 BW/TTR 中看到一根强趋势 K 突破，训练阶段最合理做法是？",
    options: ["等突破后的回调（BP）确认再考虑", "立刻追入", "在突破 K 反方向止损做", "判定趋势已成立，全仓跟进"],
    answer: "等突破后的回调（BP）确认再考虑",
    explanation: "第一根突破可能回收。PDF 建议等 BP 或等突破失败（fBO），不追第一根。",
    whyWrong: {
      "立刻追入": "区间突破第一根的失败率很高。",
      "在突破 K 反方向止损做": "除非有 fBO 确认，否则猜失败同样不可靠。",
      "判定趋势已成立，全仓跟进": "趋势成立需要连续收在区间外，一根不够。"
    }
  },
  {
    id: "exam-basics-structure-3",
    mode: "case",
    lessonId: "ttr-bw",
    prompt: "图上连续 5 根 K 线高度重叠，至少两根 Doji，此时出现一根阳线收盘略超前高。这是有效突破吗？",
    options: ["不确定，需等后续 K 确认或 BP 回调", "是，因为突破了前高", "是，因为阳线收盘", "直接做空因为假突破概率大"],
    answer: "不确定，需等后续 K 确认或 BP 回调",
    explanation: "BW 后的第一根突破需要后续确认。仅靠一根阳线无法证明突破成功。",
    whyWrong: {
      "是，因为突破了前高": "BW 中的突破第一根回收率很高。",
      "是，因为阳线收盘": "K 线颜色不能证明突破有效。",
      "直接做空因为假突破概率大": "需要等 fBO 确认，不能提前猜。"
    }
  },

  // Risk & discipline
  {
    id: "exam-basics-risk-1",
    mode: "concept",
    lessonId: "fa2-discipline",
    prompt: "止损被触发后，新手的默认第一反应应该是？",
    options: ["等待两个摆动，重新评估市场结构", "等一根反向 K 出现就反手做反方向", "缩小止损在原方向再进一次", "换到更小时间级别找同方向入场"],
    answer: "等待两个摆动，重新评估市场结构",
    explanation: "Two Swing Wait 让市场先给出新结构，避免情绪化交易。",
    whyWrong: {
      "等一根反向 K 出现就反手做反方向": "一根反向 K 不等于新结构确认，刚止损后情绪会放大反手冲动。",
      "缩小止损在原方向再进一次": "缩小止损会被正常波动扫掉，且没有新 setup 确认就重新入场是重复犯错。",
      "换到更小时间级别找同方向入场": "更小时间级别在止损后噪音更大，这是用时间框架逃避等待纪律。"
    }
  },
  {
    id: "exam-basics-risk-2",
    mode: "concept",
    lessonId: "fa2-discipline",
    prompt: "2/5 规则的含义是什么？",
    options: ["一天最多亏 2 笔就停手，最多交易 5 笔", "前 2 笔盈利后第 3-5 笔可以加大仓位", "连续 5 天中只要有 2 天盈利就可以转实盘", "每个 setup 最多尝试 2 次，一周最多 5 次"],
    answer: "一天最多亏 2 笔就停手，最多交易 5 笔",
    explanation: "2/5 规则防止一天内因情绪累积导致过度交易和扩大亏损。",
    whyWrong: {
      "前 2 笔盈利后第 3-5 笔可以加大仓位": "2/5 是风控上限，不是盈利后加仓的许可。",
      "连续 5 天中只要有 2 天盈利就可以转实盘": "2/5 是单日规则，不是跨天盈利统计。",
      "每个 setup 最多尝试 2 次，一周最多 5 次": "2/5 限制的是单日亏损笔数和交易总数，不是按 setup 或周计算。"
    }
  },
  {
    id: "exam-basics-risk-3",
    mode: "execution",
    lessonId: "a2-management",
    prompt: "入场后 first target filled，接下来标准操作是什么？",
    options: ["balance stop 移到 entry price，让 swing portion 运行", "全部平仓锁利", "把止损移到 first target 下方", "取消所有止损让利润奔跑"],
    answer: "balance stop 移到 entry price，让 swing portion 运行",
    explanation: "First target 后把 balance 保护到成本，尝试 swing portion 是 PDF 的标准管理方式。",
    whyWrong: {
      "全部平仓锁利": "这放弃了 swing 部分的潜在收益，不是标准流程。",
      "把止损移到 first target 下方": "balance stop 应移到 entry price，不是 target 下方。",
      "取消所有止损让利润奔跑": "没有止损保护是危险的，违反风险管理原则。"
    }
  },

  // Order execution
  {
    id: "exam-basics-order-1",
    mode: "concept",
    lessonId: "order-execution-discipline",
    prompt: "信号 K 收盘后下一根没有触发 Buy Stop，正确做法是？",
    options: ["取消订单，等 A22 或新结构", "改用市价追入", "用 limit 在回调时入场", "把 Buy Stop 挂到更低价位"],
    answer: "取消订单，等 A22 或新结构",
    explanation: "未触发说明市场没有确认，追价或 limit 入场改变了原始 setup 的风险定义。",
    whyWrong: {
      "改用市价追入": "市价追入失去了触发确认，不是同一笔 A2。",
      "用 limit 在回调时入场": "PDF 要求新手消除 limit entry。",
      "把 Buy Stop 挂到更低价位": "这改变了原始触发位，不再是同一个 setup。"
    }
  },
  {
    id: "exam-basics-order-2",
    mode: "concept",
    lessonId: "order-execution-discipline",
    prompt: "为什么训练阶段应消除 limit entry？",
    options: ["因为它改变了信号触发确认逻辑，需要更高读图能力", "因为手续费更贵", "因为 limit 单不能设止损", "因为 PDF 禁止所有挂单"],
    answer: "因为它改变了信号触发确认逻辑，需要更高读图能力",
    explanation: "Limit entry 跳过了 breakout 确认，省的 1-2 tick 用经验判断换来，不属于第一阶段训练。",
    whyWrong: {
      "因为手续费更贵": "limit 单手续费通常不比 stop 单贵。",
      "因为 limit 单不能设止损": "技术上 limit 单可以配合 OCO。",
      "因为 PDF 禁止所有挂单": "PDF 推荐使用 stop 单，不是禁止所有挂单。"
    }
  },

  // SIM readiness & tick language
  {
    id: "exam-basics-sim-1",
    mode: "concept",
    lessonId: "tick-risk-sim-readiness",
    prompt: "Rule of 10 在训练系统中的作用是？",
    options: ["实盘前用统计数据证明执行稳定性的量化门槛", "连续 10 天 SIM 盈利就自动达标转实盘", "每天至少完成 10 笔交易才算有效训练日", "学会识别 10 种不同 setup 后就可以实盘"],
    answer: "实盘前用统计数据证明执行稳定性的量化门槛",
    explanation: "Rule of 10 要求用统计证明技术正确和纪律稳定，不是随意设定的交易次数。",
    whyWrong: {
      "连续 10 天 SIM 盈利就自动达标转实盘": "盈利天数不等于执行质量稳定，Rule of 10 要求的是可复盘的技术正确率。",
      "每天至少完成 10 笔交易才算有效训练日": "强制交易次数会导致过度交易和降低样本质量。",
      "学会识别 10 种不同 setup 后就可以实盘": "PDF 建议新手先只做 A2 一种 setup，不是学会多种。"
    }
  },
  {
    id: "exam-basics-sim-2",
    mode: "execution",
    lessonId: "tick-risk-sim-readiness",
    prompt: "做多信号 K 高点为 4150.50，低点为 4148.00，标准 entry 和 stop 应写成？",
    options: ["entry = 4150.50 + 1t, stop = 4148.00 - 1t", "entry = 4150.50, stop = 4148.00", "entry = 4148.00 + 1t, stop = 4150.50 - 1t", "entry = 信号 K 收盘价, stop = 开盘价"],
    answer: "entry = 4150.50 + 1t, stop = 4148.00 - 1t",
    explanation: "做多 entry 在高点 +1t 触发，止损在低点 -1t。这是 PDF 的标准执行规则。",
    whyWrong: {
      "entry = 4150.50, stop = 4148.00": "缺少 ±1t 偏移，不是标准执行。",
      "entry = 4148.00 + 1t, stop = 4150.50 - 1t": "方向完全反了，这是做空逻辑。",
      "entry = 信号 K 收盘价, stop = 开盘价": "entry 和 stop 必须基于高低点，不是开收盘价。"
    }
  },

  // Risk math
  {
    id: "exam-basics-math-1",
    mode: "concept",
    lessonId: "risk-math-mae",
    prompt: "PDF 对交易是否值得的判断公式是？",
    options: ["reward × probability > risk", "胜率 > 50%", "target > 10 ticks", "止损越小越好"],
    answer: "reward × probability > risk",
    explanation: "三个维度必须一起看，只看胜率或只看目标都不完整。",
    whyWrong: {
      "胜率 > 50%": "胜率 50% 但目标小于风险仍然亏钱。",
      "target > 10 ticks": "大目标如果胜率极低或风险更大也不值得。",
      "止损越小越好": "太小止损会被正常波动扫掉，降低胜率。"
    }
  },
  {
    id: "exam-basics-math-2",
    mode: "concept",
    lessonId: "risk-math-mae",
    prompt: "MAE（最大不利波动）记录的意义是什么？",
    options: ["区分高质量 entry 和低质量 entry 的客观指标", "决定什么时候加仓", "计算手续费", "选择交易时间段"],
    answer: "区分高质量 entry 和低质量 entry 的客观指标",
    explanation: "PDF 的观察是好 swing 入场通常回撤很小，MAE 大的 entry 成功率明显下降。",
    whyWrong: {
      "决定什么时候加仓": "MAE 不是加仓信号。",
      "计算手续费": "MAE 与手续费无关。",
      "选择交易时间段": "MAE 衡量入场质量，不是时间段。"
    }
  },

  // Exit management
  {
    id: "exam-basics-exit-1",
    mode: "concept",
    lessonId: "exit-management-advanced",
    prompt: "以下哪个不是 PDF 中提到的趋势终结离场信号？",
    options: ["EMA 斜率从陡峭变为走平", "连续 Doji 和动能衰竭", "Double top / Double bottom", "趋势线被突破并有 follow-through"],
    answer: "EMA 斜率从陡峭变为走平",
    explanation: "PDF 的趋势终结信号包括连续 Doji、DT/DB、趋势线突破等结构变化，但 EMA 斜率走平是滞后反映，不是 PDF 定义的离场触发。",
    whyWrong: {
      "连续 Doji 和动能衰竭": "连续 Doji 说明趋势动能消退，是 PDF 提到的退出线索。",
      "Double top / Double bottom": "DT/DB 是经典趋势终结结构，PDF 明确讨论。",
      "趋势线被突破并有 follow-through": "趋势线突破提示趋势方结构正在改变，是重要离场参考。"
    }
  },

  // Multi-condition scenario questions
  {
    id: "exam-basics-scenario-1",
    mode: "execution",
    lessonId: "signal-bar",
    prompt: "上升趋势中，二腿回调到 EMA，出现一根阳线但实体只占全 K 的 1/3、与前 K 重叠超过一半。你应该？",
    options: ["降级为弱信号，等 A22 或更清楚确认", "直接入场因为位置和趋势都对", "用更大止损做进去弥补信号弱", "EMA 附近的任何 K 都该做不能错过"],
    answer: "降级为弱信号，等 A22 或更清楚确认",
    explanation: "趋势和位置都好，但信号 K 质量不够（实体小、重叠多），应等更好信号。多条件中任何一个不合格都要降级。",
    whyWrong: {
      "直接入场因为位置和趋势都对": "位置好不能弥补信号质量差，重叠大的弱 K 容易被反转。",
      "用更大止损做进去弥补信号弱": "放大止损不能改善信号质量，反而恶化风险收益比。",
      "EMA 附近的任何 K 都该做不能错过": "EMA 是位置条件，不是自动入场规则，信号 K 仍需独立合格。"
    }
  },
  {
    id: "exam-basics-scenario-2",
    mode: "case",
    lessonId: "ttr-bw",
    prompt: "市场刚从 BW 中向上突破两根 K，但第三根 K 回到 BW 上边界附近出现阳线。这是 BP 机会还是假突破开始？",
    options: ["不确定，需看后续是否重新收回 BW 内部再判断", "一定是 BP 因为突破方向有阳线", "一定是假突破因为回踩了上边界", "直接用大止损做多因为突破已成立"],
    answer: "不确定，需看后续是否重新收回 BW 内部再判断",
    explanation: "刚突破 BW 后回踩可能是 BP 也可能是 fBO 开始。在边界犹豫时，新手默认等待更多确认。",
    whyWrong: {
      "一定是 BP 因为突破方向有阳线": "仅凭阳线不能确认突破成功，关键是是否重新收回 BW。",
      "一定是假突破因为回踩了上边界": "回踩上边界是正常 BP 行为，不等于假突破。",
      "直接用大止损做多因为突破已成立": "边界犹豫时放大止损只是扩大风险，不能创造优势。"
    }
  },

  // "不做" training questions
  {
    id: "exam-basics-skip-1",
    mode: "execution",
    lessonId: "ttr-bw",
    prompt: "连续 7 根 K 高度重叠，中间出现一根看似很强的阳线但收盘仅略高于区间上沿。训练阶段应该？",
    options: ["跳过，BW 内部不做，等突破后 BP 或 fBO 确认", "入场做多因为这是区间内最强 K", "在阳线高点上方挂 Buy Stop 试试", "因为等了很久所以必须抓住这笔"],
    answer: "跳过，BW 内部不做，等突破后 BP 或 fBO 确认",
    explanation: "BW 内部强 K 经常被下一根反转吞没，且空间不足以定义合理 target。",
    whyWrong: {
      "入场做多因为这是区间内最强 K": "BW 中最强 K 仍然缺少方向优势，经常被反转。",
      "在阳线高点上方挂 Buy Stop 试试": "触发方式正确但位置不合格，BW 上沿附近随时可能回收。",
      "因为等了很久所以必须抓住这笔": "等待时间不是入场理由，强制交易是过度交易的常见原因。"
    }
  },
  {
    id: "exam-basics-skip-2",
    mode: "execution",
    lessonId: "risk-math-mae",
    prompt: "趋势和位置都合格的 A2 信号 K，但实体太大导致止损 12 ticks，而到最近结构目标只有 6 ticks。训练阶段应该？",
    options: ["跳过，stop 大于 target 不符合风险收益要求", "做进去因为趋势强迟早会涨更多", "缩小止损到 K 线中部省一半风险", "先做一半仓位试试看"],
    answer: "跳过，stop 大于 target 不符合风险收益要求",
    explanation: "PDF 明确 stop 不应大于 target。即使 setup 正确，风险收益不合格的交易仍然要跳过。",
    whyWrong: {
      "做进去因为趋势强迟早会涨更多": "趋势强不能保证短期不先触发止损，风险收益仍是硬性标准。",
      "缩小止损到 K 线中部省一半风险": "随机缩小止损不再代表 setup 失效点，被正常波动扫掉的概率大增。",
      "先做一半仓位试试看": "减仓不改变风险收益比，止损 vs 目标的数学仍然不合格。"
    }
  },

  // Mixed judgment questions
  {
    id: "exam-basics-judgment-1",
    mode: "execution",
    lessonId: "fa2-discipline",
    prompt: "第一笔 A2 止损后你等了两个摆动，市场又回到 EMA 附近出现新的二腿信号 K。这时候应该？",
    options: ["用新信号 K 重新评估 setup 质量，合格则按规则入场", "因为刚止损过所以今天不再做任何交易", "直接用上一笔的参数再做一次", "放弃等待立刻市价追入"],
    answer: "用新信号 K 重新评估 setup 质量，合格则按规则入场",
    explanation: "等了两个摆动后市场给出新结构，应独立评估新信号，不受上一笔情绪影响。",
    whyWrong: {
      "因为刚止损过所以今天不再做任何交易": "2/5 规则允许亏 2 笔后停手，但第一笔止损后仍可评估新机会。",
      "直接用上一笔的参数再做一次": "新信号需要新的 entry/stop/target 定义，不能沿用旧参数。",
      "放弃等待立刻市价追入": "市价追入绕过了信号 K 外侧触发确认。"
    }
  },
  {
    id: "exam-basics-judgment-2",
    mode: "concept",
    lessonId: "risk-math-mae",
    prompt: "信号 K 挂 Buy Stop 后触发入场，但触发前价格先回撤接近信号 K 低点。触发后应如何处理？",
    options: ["持有但记录 MAE，复盘时评估 entry 质量", "因为先回撤了所以 setup 已失败应立刻平仓", "因为最终触发了所以不用管中间过程", "下次应提前取消 Buy Stop 改用 Limit 在低点买"],
    answer: "持有但记录 MAE，复盘时评估 entry 质量",
    explanation: "触发规则是机械的（高点 +1t），但触发前的回撤大小反映 entry 质量，应记录 MAE 复盘。",
    whyWrong: {
      "因为先回撤了所以 setup 已失败应立刻平仓": "setup 失效由 stop 定义，中间波动不等于失败。",
      "因为最终触发了所以不用管中间过程": "MAE 是复盘核心字段，过程质量影响长期表现。",
      "下次应提前取消 Buy Stop 改用 Limit 在低点买": "PDF 要求新手消除 limit entry，不能因为价格先下跌就改用 limit。"
    }
  }
];