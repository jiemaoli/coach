# Coach v2 — Setup-Driven 学习系统需求与设计文档

**版本**: v2.6 (clean)
**基线来源**: `docs/ninetrans_book.pdf`（主），`docs/ninetrans_book.txt`（辅）
**文档目标**: 将学习系统从“按章节阅读”重构为“按可交易 setup 训练”，用于直接指导实现。

---

## 1. 产品目标与边界

### 1.1 总目标（唯一主线）

打造一套以 `ninetrans_book.pdf` 为基础的交易学习系统，让用户按可交易 setup 逐步掌握：

1. **识别** setup
2. **拒绝**低质量 setup
3. **执行**入场 / 止损 / 目标
4. **管理**持仓与失败后纪律
5. **复盘**并达到可交易门槛（先 SIM，后实盘准备）

### 1.2 非目标

- 不是实盘信号服务
- 不是自动交易系统
- 不接券商下单
- 不提供个性化投资建议

### 1.3 证据优先级

1. PDF 原文（权威）
2. TXT 对齐文本（辅助检索，允许轻微字符误差）
3. 系统内解释（必须可追溯到 1）

---

## 2. 训练组织原则

### 2.1 从“章节组织”改为“setup 组织”

学习单元不再按书目录，而按可交易 setup：

- A2（起点，唯一先修）
- W1P
- DP
- fBO
- 后续扩展 setup

### 2.2 每个 setup 固定 8 段结构

每个 setup 页面必须包含：

1. 定义与市场前提（含原文）
2. 结构识别（图上如何数腿 / 数推）
3. 信号质量分级（3/2/1/0 星）
4. 自动跳过条件（硬过滤）
5. 执行规则（入场 / 止损 / 目标）
6. 失败分支（失败后怎么做）
7. 盘中决策清单（纪律）
8. 练习与考核（概念题 + 看图题 + 执行题 + 失败题）

### 2.3 学习完成标准（非“已读”）

单元完成必须同时满足：

- 概念测试达标
- 看图识别达标
- 执行参数题达标
- 失败分支题达标

### 2.4 补齐原则

1. 只补书中已有知识点，不补书外体系。
2. 所有补齐项必须挂载在 A2 / W1P / DP / fBO 的学习与考核流程中。
3. 不新增脱离交易场景的独立理论章节。

---

## 3. Setup 学习路径

### 阶段 S0：基础底座（轻量）

只保留 setup 必需基础：

- Signal Bar 选择
- 趋势 / 区间 / TTR / BW / OL 过滤
- tick、风险单位、ATR 相对尺度
- Two Strikes（2/5）与 Two Swing Wait

> S0 不是独立长课程；它服务后续 setup 执行。

### 阶段 S1：A2 专项（必须单独通过）

A2 是唯一入口 setup。未通过 A2，不解锁后续 setup。

### 阶段 S2：W1P

在 A2 稳定后引入反转后首回调。

### 阶段 S3：DP

双顶 / 双底后的回调入场。

### 阶段 S4：fBO

突破失败类 setup，放在后期（难度高、情绪要求高）。

### 阶段 S5：混合场景考核

多 setup 共存时的“识别 - 拒绝 - 执行”决策。

---

## 4. A2 模块（完整模板）

### 4.1 定义与本质

- A2 = 趋势中回调后的第二次延续尝试
- 等价理解：
  - 二腿回调到 EMA 附近
  - 两次反转趋势尝试失败（fL1/fL2 或 fH1/fH2）

### 4.2 识别流程（四层）

1. 趋势方向成立（5m 为主，15m 同向加分）
2. 二腿结构成立（可明确标注 legs）
3. 信号 K 线质量合格（方向明确、重叠受控）
4. 自动过滤未触发（TTR / BW / OL / 过宽止损等）

### 4.3 执行规则

- 触发：信号 K 极值 ±1t（Stop 单）
- 止损：信号 K 另一端 ∓1t（或规则内固定风险）
- 目标：
  - T1：至少 1R / 或书内最小 tick 目标
  - T2：摆动目标 / MM 目标（按上下文）
- No-trigger：未触发则作废，不追价

### 4.4 失败分支（fA2）

必须覆盖：

- fA2 定义与可反手边界
- Two Swing Wait 触发条件
- “止损后等待”优先于“立即反手”

### 4.5 A2 评分体系

- 3 星：结构清晰 + 信号强 + 无 BW/OL + 位置好
- 2 星：结构成立但有瑕疵（仅保守执行）
- 1 星：可解释但不建议新手做
- 0 星：触发自动过滤，必须跳过

### 4.6 A2 考核构成

- 概念题（定义 / 边界 / 纪律）
- 看图题（有效 vs 无效 A2）
- 执行题（entry / stop / target 计算）
- 失败题（fA2 后处理）

### 4.7 A2 量化通过阈值

#### 4.7.1 题型分布与最低样本量

- Concept: 最少 40 题
- Chart: 最少 40 题
- Execution: 最少 30 题
- Failure: 最少 20 题

> A2 总样本量最低 130 题次（可分多天累计）。

#### 4.7.2 单题型通过阈值

- Concept Accuracy ≥ 85%
- Chart Accuracy ≥ 85%
- Execution Accuracy ≥ 90%
- Failure Accuracy ≥ 85%

#### 4.7.3 硬错误约束

以下任一行为视为硬错误：

1. 在 TTR 内将 setup 判为“可做”
2. 在 BW/OL 明显区域将 setup 判为“可做”
3. 把单腿回调误判为 A2
4. 入场 / 止损方向写反

通过条件：

- 最近 30 次看图题中，硬错误次数 ≤ 1
- 最近 20 次执行题中，方向性错误 = 0

#### 4.7.4 稳定性门槛

- 连续 3 轮综合测验都达标
- 每轮测验至少 20 题，且包含四种题型

### 4.8 A2 题库蓝图

#### 4.8.1 题库结构

```ts
interface QuestionBlueprint {
  id: string;
  setupId: 'a2';
  bucket:
    | 'a2-definition'
    | 'a2-recognition'
    | 'a2-quality'
    | 'a2-filters'
    | 'a2-execution'
    | 'a22'
    | 'fa2'
    | 'discipline';
  type: 'concept' | 'chart' | 'execution' | 'failure';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}
```

#### 4.8.2 必备题目桶与占比

- a2-definition: 10%
- a2-recognition: 20%
- a2-quality: 15%
- a2-filters: 15%
- a2-execution: 20%
- a22: 8%
- fa2: 8%
- discipline: 4%

#### 4.8.3 看图题最小场景覆盖清单

1. 标准 3 星 A2 做多
2. 标准 3 星 A2 做空（镜像）
3. 单腿回调误判陷阱
4. Doji 信号降级案例
5. 大实体导致止损过宽案例
6. BW 内伪 A2
7. OL 过重伪 A2
8. 远离 EMA 的伪 A2
9. A22 可做案例
10. A22 仍应跳过案例
11. fA2 后 Two Swing Wait 案例
12. TR 突破后 BP A2 案例
13. 开盘前 5 bars 观察案例
14. fRev + fA2 趋势终结风险案例

#### 4.8.4 执行题最小覆盖

- Buy Stop / Sell Stop 触发价计算
- 初始止损位计算
- 1R 与最小 tick 目标换算
- T1 / T2 目标区分
- 未触发信号的处理（不追价）

---

## 5. W1P 模块（实现级）

### 5.1 定义与定位

- W1P = 反转成立后的第一回调入场（first pullback after reversal）
- 在训练路径中：
  - 难度高于 A2
  - 低于 fBO
  - 用于建立“反转后顺势跟进”的能力

### 5.2 可交易前提（全部满足）

1. 先出现可识别的反转尝试并有成立迹象
2. 反转后出现新方向第一段推动（至少一段清晰 impulsive move）
3. 第一回调未破坏新方向结构
4. 回调末端信号 K 不在 BW/OL 核心区域

### 5.3 识别流程（四层）

#### 第一层：反转成立检查

至少满足 2 项：

- 原方向出现衰竭迹象（推动减弱、重叠增多）
- 关键位置出现反转信号（如双测 / 楔形语境）
- 出现新方向强势趋势 K（收盘靠近极端）
- 价格脱离原震荡噪音区

#### 第二层：首推动检查

- 新方向至少有一段可计数推动
- 推动不是单根异常大 K 的孤立 spike（需有后续）

#### 第三层：第一回调结构检查

- 回调为反转后第一回调（不是第二、第三次）
- 回调深度可接受（不直接破坏新方向结构）
- 回调过程中未形成 TTR / BW 主导

#### 第四层：信号 K 质量

- 强势方向 K、收盘靠近极端优先
- Doji 仅可降级，不可默认高质量
- 与前 2 根过度重叠则过滤

### 5.4 自动过滤条件

1. 回调区域处于 BW/OL 高重叠状态
2. 回调后信号 K 为逆势 Doji 且无后续确认
3. 止损宽度超出风险上限
4. 信号发生在明显 TTR 内部
5. 该信号实为 A2 或 DP 场景，被误标为 W1P

### 5.5 执行规则

- 入场：信号 K 极值 ±1t（Stop 单）
- 止损：信号 K 另一端 ∓1t
- 目标：
  - T1 = 1R 或 setup 最小目标
  - T2 = 最近结构目标（摆动位 / MM）
- No-trigger：未触发则作废，不追价

### 5.6 失败分支

W1P 失败后：

1. 不立即反向报复性交易
2. 先判断失败属于：
   - 假反转（原趋势恢复）
   - 转入区间（震荡主导）
3. 至少等待新摆动完成后再评估

### 5.7 与 A2 / DP 的区分规则

- 与 A2：A2 是趋势中回调延续；W1P 是反转后首回调
- 与 DP：DP 依赖双测结构确认；W1P 依赖“反转后第一回调”时序

### 5.8 W1P 评分体系

- 3 星：反转成立清晰 + 首推动明确 + 第一回调干净 + 强信号 K
- 2 星：结构成立但有轻微重叠 / 信号一般
- 1 星：结构勉强成立，仅观察或极保守
- 0 星：触发任一自动过滤

### 5.9 W1P 考核规格

- Concept: ≥ 30 题
- Chart: ≥ 30 题
- Execution: ≥ 20 题
- Failure: ≥ 15 题

通过阈值：

- Concept / Chart / Failure ≥ 85%
- Execution ≥ 90%
- 最近 20 次看图硬错误 ≤ 1

### 5.10 W1P 题库蓝图

#### 5.10.1 题库结构

```ts
interface W1PQuestionBlueprint {
  id: string;
  setupId: 'w1p';
  bucket:
    | 'w1p-definition'
    | 'w1p-reversal-confirmation'
    | 'w1p-first-pullback'
    | 'w1p-quality'
    | 'w1p-filters'
    | 'w1p-execution'
    | 'w1p-failure'
    | 'w1p-distinction';
  type: 'concept' | 'chart' | 'execution' | 'failure';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}
```

#### 5.10.2 必备题目桶与占比

- w1p-definition: 10%
- w1p-reversal-confirmation: 18%
- w1p-first-pullback: 18%
- w1p-quality: 12%
- w1p-filters: 12%
- w1p-execution: 15%
- w1p-failure: 8%
- w1p-distinction: 7%

#### 5.10.3 看图题最小场景覆盖清单

1. 标准 W1P 做多
2. 标准 W1P 做空
3. 假反转后误判为 W1P
4. 第一回调其实已是第二回调
5. W1P 与 A2 混淆场景
6. W1P 与 DP 混淆场景
7. BW/OL 中伪 W1P
8. 反转后首推动过弱导致放弃
9. 强 W1P + 强信号 K
10. W1P 失败后转入区间

---

## 6. DP 模块（实现级）

### 6.1 定义与定位

- DP = Double Top / Double Bottom 相关的回调入场
- 在训练路径中：
  - 难度介于 W1P 与 fBO 之间
  - 核心能力是“结构确认后再执行”，而非第一次触碰即交易

### 6.2 可交易前提（全部满足）

1. 出现可辨识的双测结构（两次测试同一关键区）
2. 第二次测试后有失败或停滞迹象，非强势直接突破
3. 回调信号出现在结构边界附近，不在区间中部噪音带
4. 信号区域不被 BW/OL 主导

### 6.3 识别流程（四层）

#### 第一层：双测结构成立

至少满足 2 项：

- 两次测试发生在可比价位区间
- 第二次测试动能弱于第一次（或未形成有效突破）
- 出现拒绝该区域的信号 K
- 关键位置（前高 / 前低 / 边界）反应明显

#### 第二层：确认信号

- 双测后出现方向确认（反向趋势 K 或连续收盘）
- 不是单根偶发波动

#### 第三层：回调入场窗口

- 确认后出现可执行回调
- 回调未破坏确认结构

#### 第四层：信号 K 质量

- 顺势强收盘优先
- Doji / 重叠仅降级或过滤

### 6.4 自动过滤条件

1. 双测其实是区间中部随机震荡
2. 第二次测试直接有效突破并延续（非 DP 语境）
3. 信号 K 在 BW/OL 核心区
4. 止损宽度超出风险上限
5. 信号更符合 A2 或 fBO 而非 DP

### 6.5 执行规则

- 入场：信号 K 极值 ±1t（Stop 单）
- 止损：信号 K 另一端 ∓1t
- 目标：
  - T1 = 1R
  - T2 = 结构目标（最近摆动位 / MM）
- No-trigger：不触发则作废，不追价

### 6.6 失败分支

DP 失败后：

1. 识别是否转为“有效突破延续”
2. 若转为延续，不做逆势加仓或报复性反手
3. 等待新结构完成再评估（至少一轮新摆动）

### 6.7 与 W1P / fBO 区分规则

- 与 W1P：W1P 依赖“反转后第一回调”时序；DP 依赖“双测确认”结构
- 与 fBO：fBO 强调“先突破再失败”；DP 强调“测试边界后的结构性回调”

### 6.8 DP 评分体系

- 3 星：双测清晰 + 确认充分 + 回调干净 + 强信号 K
- 2 星：结构成立但确认一般
- 1 星：结构含糊，仅观察
- 0 星：触发自动过滤

### 6.9 DP 考核规格

- Concept: ≥ 30 题
- Chart: ≥ 30 题
- Execution: ≥ 20 题
- Failure: ≥ 15 题

通过阈值：

- Concept / Chart / Failure ≥ 85%
- Execution ≥ 90%
- 最近 20 次看图硬错误 ≤ 1

### 6.10 DP 题库蓝图

#### 6.10.1 题库结构

```ts
interface DPQuestionBlueprint {
  id: string;
  setupId: 'dp';
  bucket:
    | 'dp-definition'
    | 'dp-double-test'
    | 'dp-confirmation'
    | 'dp-quality'
    | 'dp-filters'
    | 'dp-execution'
    | 'dp-failure'
    | 'dp-distinction';
  type: 'concept' | 'chart' | 'execution' | 'failure';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}
```

#### 6.10.2 必备题目桶与占比

- dp-definition: 10%
- dp-double-test: 20%
- dp-confirmation: 18%
- dp-quality: 10%
- dp-filters: 12%
- dp-execution: 15%
- dp-failure: 8%
- dp-distinction: 7%

#### 6.10.3 看图题最小场景覆盖清单

1. 标准双底后 DP 做多
2. 标准双顶后 DP 做空
3. 区间中部随机双测伪 DP
4. 第二次测试直接突破失效案例
5. DP 与 fBO 混淆场景
6. DP 与 W1P 混淆场景
7. DP 确认后回调入场
8. BW/OL 中伪 DP
9. DP 失败后转为突破延续
10. DP + MM 目标案例

---

## 7. fBO 模块（实现级）

### 7.1 定义与定位

- fBO = failed breakout，突破失败后的反向机会
- 在训练路径中属于高难 setup：
  - 对确认质量要求高
  - 对纪律要求高（最容易触发报复性交易）

### 7.2 可交易前提（全部满足）

1. 先有可识别突破（边界明确、方向明确）
2. 随后出现失败证据（回到边界内或突破后无跟随）
3. 失败后出现反向可执行信号，而非纯噪音
4. 当前不是 TTR / BW 主导

### 7.3 识别流程（四层）

#### 第一层：突破有效性检查

至少满足 2 项：

- 发生在关键边界（区间边界、前高前低、结构线）
- 突破 K 有一定强度
- 突破后有短暂跟随而非立即无效

#### 第二层：失败确认

至少满足 2 项：

- 突破后价格回到关键边界内
- 跟随不足（连续性消失）
- 出现反向强势 K 或小型反转结构

#### 第三层：反向入场窗口

- 失败确认后出现可执行信号 K
- 该信号不在 BW/OL 核心区域

#### 第四层：质量与风险检查

- 信号质量达标
- 止损宽度在可接受范围内

### 7.4 自动过滤条件

1. 所谓失败其实未确认（仅一次回踩）
2. TTR 内连续假突破（噪音主导）
3. 信号 K 方向不清或重叠严重
4. 止损过宽 / 风险回报失衡
5. 实际更符合 DP 或 A2，而非 fBO

### 7.5 执行规则

- 入场：确认信号 K 极值 ±1t（Stop 单）
- 止损：信号 K 另一端 ∓1t
- 目标：
  - T1 = 1R
  - T2 = 回归区间另一侧或结构 MM 目标
- No-trigger：不触发作废，不追价

### 7.6 失败分支

fBO 失败后：

1. 若再次转为同向有效突破，立即停止逆势假设
2. 不做连续反向尝试
3. 等待新边界形成后再评估

### 7.7 与 A2 / DP 区分规则

- 与 A2：A2 是趋势回调延续；fBO 是突破失败后反向
- 与 DP：DP 是双测结构回调；fBO 是突破事件失败

### 7.8 fBO 评分体系

- 3 星：突破清晰 + 失败确认充分 + 反向信号强
- 2 星：失败成立但确认一般
- 1 星：疑似失败，仅观察
- 0 星：触发自动过滤

### 7.9 fBO 考核规格

- Concept: ≥ 30 题
- Chart: ≥ 30 题
- Execution: ≥ 20 题
- Failure: ≥ 15 题

通过阈值：

- Concept / Chart / Failure ≥ 85%
- Execution ≥ 90%
- 最近 20 次看图硬错误 ≤ 1

### 7.10 fBO 题库蓝图

#### 7.10.1 题库结构

```ts
interface FBOQuestionBlueprint {
  id: string;
  setupId: 'fbo';
  bucket:
    | 'fbo-definition'
    | 'fbo-breakout'
    | 'fbo-failure-confirmation'
    | 'fbo-quality'
    | 'fbo-filters'
    | 'fbo-execution'
    | 'fbo-failure'
    | 'fbo-distinction';
  type: 'concept' | 'chart' | 'execution' | 'failure';
  difficulty: 'basic' | 'intermediate' | 'advanced';
}
```

#### 7.10.2 必备题目桶与占比

- fbo-definition: 10%
- fbo-breakout: 15%
- fbo-failure-confirmation: 20%
- fbo-quality: 10%
- fbo-filters: 12%
- fbo-execution: 15%
- fbo-failure: 10%
- fbo-distinction: 8%

#### 7.10.3 看图题最小场景覆盖清单

1. 标准上破失败后做空
2. 标准下破失败后做多
3. 只有回踩、尚未失败确认的伪 fBO
4. TTR 中连续乱突破伪 fBO
5. fBO 与 DP 混淆场景
6. fBO 与 A2 混淆场景
7. 失败确认后强反向信号案例
8. 失败确认不足应放弃案例
9. fBO 失败后再次转为同向突破
10. breakout pullback 与 failed breakout 对照题

---

## 8. 开盘统一决策树（1Rev → 1PB → A2 / W1P）

### 8.1 目标

将开盘阶段的书中知识点嵌入 setup 学习路径，避免把开盘知识做成孤立章节。

### 8.2 决策流程

#### Step 1：开盘前 5 bars 仅观察

观察项：

- Gap 大小与方向
- 前 5 bars 是否高度重叠
- 是否已出现 BW / TTR 主导
- 是否已有明确单边推动

若前 5 bars 处于 BW / TTR：
→ 不做开盘抢单，继续等待结构清晰。

#### Step 2：判断初始尝试类型

- 若单边推动强且持续：视为 opening trend attempt
- 若双向来回且重叠多：视为 open TR

#### Step 3：识别 1Rev / 1PB

- 初始趋势尝试失败并出现反向成立迹象 → 候选 1Rev
- 1Rev 成立后第一次回调 → 候选 1PB / W1P 训练语境

#### Step 4：选择首个可执行 setup

优先级：

1. 若只是正常趋势建立后首个两腿回调清晰 → A2
2. 若已明确发生反转且出现第一回调 → W1P
3. 若仍处于开盘区间混乱阶段 → 不交易

#### Step 5：失败后处理

- 开盘信号失败后，不立即重做同方向
- 若进入 BW / TTR，回到等待模式
- 若形成新趋势，再回到 A2 / W1P 路径判断

### 8.3 开盘场景考核要求

必须至少包含以下 8 类场景题：

1. 开盘强趋势后首个 A2
2. 开盘失败后 1Rev 成立
3. 1Rev 后第一回调 W1P
4. 开盘前 5 bars 全部重叠，选择观望
5. open TR 中误判 A2
6. open TR 突破后 A2 / BP 对照
7. 开盘后假反转，不应做 W1P
8. 开盘止损后进入 Two Swing Wait

---

## 9. Setup 冲突优先级决策树

当同一时段可被解释为多个 setup 时，按以下顺序裁决：

1. **先判市场状态**：TTR / BW 主导则全部降级或跳过
2. **先判时序型 setup**：若是“反转后第一回调”明确成立，优先 W1P
3. **再判结构型 setup**：双测结构明确则优先 DP
4. **再判事件型 setup**：明确“先突破后失败”则优先 fBO
5. **最后判趋势延续型**：其余满足两腿回调延续的归 A2

冲突时统一保守规则：

- 若两种解释评分都 ≤ 2 星，默认跳过
- 若存在硬过滤命中，直接跳过，不做解释性强行交易

---

## 10. 纪律与 readiness

### 10.1 2/5 规则

- 若亏损两笔，当日停止
- 若总交易五笔，当日停止

### 10.2 Two Swing Wait

- 止损后优先等待两个摆动完成
- 或等待价格远离震荡区后再评估

### 10.3 Rule-of-10 评分卡

#### 10.3.1 数据结构

```ts
interface RuleOf10Scorecard {
  weeklyPoints: number[];
  consecutiveWeeksAtGoal: number;
  noLossDays: number;
  consecutiveWinningDays: number;
  avgWinningDay: number;
  biggestLosingDay: number;
  status: 'not-ready' | 'in-progress' | 'ready';
}
```

#### 10.3.2 判定规则

满足以下全部条件才可标记 `ready`：

1. 至少 10 周中，每周 ≥ 10 点
2. 连续 10 周达标
3. 至少 10 个无亏损交易日
4. 至少连续 10 个盈利日
5. 最大亏损日 ≤ 平均盈利日的一半

#### 10.3.3 回退机制

若已接近达标但出现以下情况，状态回退为 `in-progress`：

- 连续周数中断
- 最大亏损日超出阈值
- 连续盈利日被打断

#### 10.3.4 UI 呈现要求

- 五项指标分别展示为独立卡片
- 每张卡片显示：当前值 / 目标值 / 是否达标
- readiness 页面须明确提示：
  - 这是学习系统内的准备度量，不是收益承诺
  - 即使 Rule of 10 达标，仍需从小仓位与稳定执行开始

---

## 11. 页面与导航（v2 IA）

- `/` 学习仪表盘（按 setup 展示进度）
- `/setup/a2`
- `/setup/w1p`
- `/setup/dp`
- `/setup/fbo`
- `/drills/chart` 看图训练
- `/drills/execution` 执行参数训练
- `/discipline` 盘中清单与 2/5 追踪
- `/readiness` SIM 与 Rule-of-10 进度门槛
- `/glossary` 术语检索

导航顺序固定按训练路径，不按书章节。

---

## 12. 数据模型（实现就绪）

```ts
interface SetupModule {
  id: 'a2' | 'w1p' | 'dp' | 'fbo';
  title: string;
  unlockedBy: string[];
  sections: SetupSection[];
  passCriteria: PassCriteria;
}

interface SetupSection {
  id: string;
  kind:
    | 'definition'
    | 'recognition'
    | 'quality'
    | 'filters'
    | 'execution'
    | 'failure'
    | 'checklist'
    | 'assessment';
  content: RichContent[];
  quotes: SourceQuote[];
}

interface SourceQuote {
  source: 'ninetrans_book.pdf' | 'ninetrans_book.txt';
  textEn: string;
  textZh: string;
  confidence: 'high' | 'medium';
}

interface DrillQuestion {
  id: string;
  setupId: SetupModule['id'];
  type: 'concept' | 'chart' | 'execution' | 'failure';
  prompt: string;
  options?: string[];
  answer: string;
  rationale: string;
}

interface PassCriteria {
  conceptAccuracy: number;
  chartAccuracy: number;
  executionAccuracy: number;
  minSamples: number;
}
```

---

## 13. Rule Traceability

### 13.1 结构

```ts
interface RuleTrace {
  ruleId: string;
  setupId: 'a2' | 'w1p' | 'dp' | 'fbo' | 'cross';
  ruleText: string;
  source: 'ninetrans_book.pdf' | 'ninetrans_book.txt';
  quoteEn: string;
  quoteZh: string;
  confidence: 'high' | 'medium';
  note?: string;
}
```

### 13.2 Rule Traceability v1（已填充）

| ruleId | setupId | ruleText | source | confidence | quoteEn | quoteZh | note |
|---|---|---|---|---|---|---|---|
| RT-A2-001 | a2 | A2 是靠近 EMA 的二次回调反转失败后趋势延续信号 | ninetrans_book.pdf | high | "A second attempt to reverse a pullback move near the ema... a continuation signal. If its too far from the ema it may not qualify to be an A2." | A2 是在 EMA 附近对回调反转的第二次尝试失败，因此形成延续信号；若离 EMA 太远则可能不算 A2。 | A2 定义主锚点 |
| RT-A2-002 | a2 | A2 距离 EMA 过远需降级，可能演变为第三推 / 楔形回调 | ninetrans_book.pdf | high | "if your A2 entry is very far from the ema, you may get a 3rd push..." | 若 A2 入场离 EMA 很远，可能出现第三推并演化结构。 | 对应 A2 过滤条件 |
| RT-A2-003 | a2 | failed A2 常提示新方向还有两腿，属可反手候选但非必反手 | ninetrans_book.pdf | high | "Some setups are reversible, for example failed A2 is usually an indication of two more legs in the new direction." | 某些 setup 可反手，failed A2 通常意味着新方向还有两腿。 | 映射 fA2 模块 |
| RT-DIS-001 | cross | 止损后应等待 two swings 或价格远离震荡再入场 | ninetrans_book.pdf | high | "The right thing to do is to wait out two swings or until the price moves some distance away from choppy action." | 正确做法是等待两个摆动，或等待价格远离震荡后再入场。 | 映射 Two Swing Wait |
| RT-FLT-001 | cross | BW/OL 区域多数交易失败，应避免在其中直接做 setup | ninetrans_book.pdf | high | "Trading BW/OL: Most trades in BW/OL are likely to fail." | 在 BW/OL 中多数交易很可能失败。 | 映射 A2 / W1P / DP / fBO 过滤 |
| RT-OPN-001 | a2 | 保守交易者可等第一个两腿回调 | ninetrans_book.pdf | high | "A conservative trader may simply wait for the first 2 legged pullback..." | 保守交易者可等待第一个两腿回调；即使会错过早盘一段走势。 | 映射开盘策略 |
| RT-RSK-001 | cross | 2/5 纪律：亏损两笔或总交易五笔即当日停止 | ninetrans_book.pdf | high | "If you lose two trades, you are done for the day... done for the day if you took five trades total." | 若亏损两笔，当日结束；若总计五笔交易，当日也结束。 | 映射纪律模块 |
| RT-PSY-001 | cross | 急切与不耐烦是亏损交易者特征，需用清单化纪律抑制冲动 | ninetrans_book.pdf | high | "Eagerness and impatience are signs of a losing inexperienced trader..." | 急切与不耐烦是亏损新手标志；谨慎与耐心是盈利交易者特征。 | 映射盘中清单 |
| RT-RO10-001 | cross | Rule of 10 是 SIM→实盘准备门槛，而非单日胜负指标 | ninetrans_book.pdf | high | "The rule of ten: A trading plan..." | Rule of 10 以周与连续性指标验证技术稳定。 | 映射 readiness |
| RT-BP-001 | fbo | 区间突破后的回调可形成 breakout pullback setup，并指向 MM 目标 | ninetrans_book.pdf | high | "...gave a breakout pullback... moved to a measured move target." | 突破后回调（BP）可形成入场，并可能移动至测量目标。 | 映射 BP / fBO / DP 目标 |
| RT-TTR-001 | cross | TTR 日低概率，宜减少或停止交易 | ninetrans_book.pdf | high | "TTR days are best not traded at all..." | TTR 日最好不交易，因为信号概率低。 | 映射全 setup 硬过滤 |
| RT-SBAR-001 | cross | 信号 K 线选择是最先要掌握的核心能力 | ninetrans_book.pdf | high | "The very first thing to learn about price action trading is signal bar selection." | 学习 Price Action 第一件事是信号 K 线选择。 | 映射 S0 底座 |
| RT-DOJI-001 | cross | Doji 顺势可用、逆势失败率高，必须区分上下文 | ninetrans_book.pdf | high | "doji signal bars often work for with-trend trades but fail for counter-trend trades." | Doji 在顺势交易中常有效，但逆势中常失败。 | 映射质量分级 |
| RT-TRL-001 | cross | 应持续警惕趋势终结，终结后可能不再有 A2 | ninetrans_book.pdf | high | "...watch for possible trend terminations... After this point, there may be no more A2s." | 应警惕趋势终结信号；之后可能不再出现 A2。 | 映射终结与降级 |
| RT-NTX-001 | cross | 交易可抽象为反转 / 延续 / 突破 / 假突破四类 | ninetrans_book.pdf | high | "There are only four kinds of trades: Reversals, continuations, breakouts and failed breakouts." | 交易只有四大类：反转、延续、突破、假突破。 | setup 体系基础 |

### 13.3 TXT 辅助引用规则

- 若某条 quote 仅在 `ninetrans_book.txt` 检索到，`confidence` 设为 `medium`
- v1 中核心规则均以 PDF 版本为主锚；TXT 仅用于检索定位与交叉比对
- 若后续出现 PDF / TXT 文本差异，以 PDF 为最终准

### 13.4 Rule Traceability v2（分支级已填充 v1）

#### 13.4.1 新增分支级规则

| ruleId | setupId | ruleText | source | confidence | quoteEn | quoteZh | note |
|---|---|---|---|---|---|---|---|
| RT-W1P-001 | w1p | W1P 可视为反转成立后第一回调的顺势入场语境 | ninetrans_book.pdf | high | "A HL after a bullish reversal or a LH after a bearish reversal present the best swing entry of any move. This is because they represent the 1st pullback (1PB) of the new trend." | 牛市反转后的 HL，或熊市反转后的 LH，是整段走势中最好的波段入场，因为它们代表新趋势中的第一次回调（1PB）。 | 直接支撑“反转成立后第一回调”的 W1P 核心定义。 |
| RT-W1P-002 | w1p | 假反转不可直接当作 W1P，需先确认反转成立 | ninetrans_book.pdf | high | "When a day opens with an obvious trend attempt ... and immediately gives a reversal signal ... it is a possible 1Rev. Ideally, the reversal bar needs to be as large as the prior bar and dip more than 1t below it... 1Revs often are weak signals." | 当一天以明显趋势尝试开局，并立刻给出反转信号时，它才只是一个可能的 1Rev。理想情况下，反转 bar 需至少接近前一 bar 的力度，并下探超过 1t；很多 1Rev 信号本身仍然偏弱。 | 直接支撑“先确认反转，再谈第一回调”的过滤逻辑。 |
| RT-DP-001 | dp | DP 依赖双测 / 双顶双底等结构边界，而不是区间中部随机双测 | ninetrans_book.pdf | high | "A pullback that gives a long entry after a double bottom or a short entry after a double top" | 在双底后给出做多回调入场，或在双顶后给出做空回调入场。 | 直接支撑 DP 的双顶/双底回调入场定义。 |
| RT-DP-002 | dp | 若第二次测试后并未失败而是直接突破延续，则不再按 DP 处理 | ninetrans_book.pdf | high | "A DP is a kind of fBO that results from two failed attempts ... to break a barrier ... So while the DP at b63 is clear, its important to note that ... DPs only fade trading ranges and never extend them." | DP 属于一种 fBO，来自两次突破屏障失败后的结构；因此真正的 DP 只用于反做区间，不会用来延伸区间本身。 | 直接支撑“若结构转成突破延续，就不再按 DP 处理”的边界规则。 |
| RT-FBO-001 | fbo | fBO 的核心是先有 breakout，再有 failed breakout | ninetrans_book.pdf | high | "There are only four kinds of trades: Reversals, continuations, breakouts and failed breakouts." | 交易只有四类：反转、延续、突破和假突破。 | fBO 分类主锚点。 |
| RT-FBO-002 | fbo | breakout pullback 与 failed breakout 需要区分，前者可走 MM，后者为反向 setup | ninetrans_book.pdf | high | "...gave a breakout pullback... moved to a measured move target." | 突破回调给出入场，并移动到测量目标。 | 用于与 fBO 做边界区分：BP 是顺突破方向，fBO 是突破失败后反向。 |
| RT-OPN-002 | cross | 1PB 是开盘后重要波段入场语境，可作为 W1P / 开盘训练主锚点 | ninetrans_book.pdf | high | "1PB is often the best swing entry of the day. The protective stop above 1PB is not violated for the rest of the day." | 1PB 往往是全天最佳的波段入场；其保护止损在余下交易日中通常不会再被触及。 | 开盘决策树主锚点。 |
| RT-CONFLICT-001 | cross | setup 冲突时先看市场状态，市场结构是总过滤器 | ninetrans_book.pdf | high | "Market structure is your filter and overall guide ensuring you dont take trades in the wrong direction." | 市场结构是你的过滤器和总体指南，确保你不在错误方向交易。 | 冲突决策树“先判状态”主锚点。 |

#### 13.4.2 v2 使用规则

- `confidence: high` 表示已有较直接的 PDF 锚点支撑当前规则。
- `confidence: medium` 表示该 quote 可支持该规则，但仍建议后续补成更精确的逐字定义句。
- 若后续在 PDF 中找到更精确的对应句，直接替换当前 `medium` 锚点，不改变 `ruleId`。

#### 13.4.3 v2 仍待精炼的条目

1. 若后续在 PDF 中找到更适合的逐字定义句，可继续替换现有 W1P / DP 条目，但当前版本已达到实现可用级。
2. opening / conflict 条款仍可继续细化到“每个分支一条 quote”。


---

## 14. 验收标准（编码阶段）

### 14.1 功能验收

1. 可按 setup 依序学习，不可跳过先修门槛
2. 每个 setup 均有 8 段统一结构
3. 每个 setup 均有 4 类训练题
4. 每题均显示“为什么对 / 为什么错”
5. 进度可持久化（localStorage）

### 14.2 内容验收

1. 所有关键规则可追溯到 PDF 引用
2. TXT 引用有辅助标识（非最终权威）
3. 不引入书外交易体系

### 14.3 质量验收

1. TypeScript 无错误
2. 页面路由完整可达
3. 移动端可用
4. 无阻塞性 UI 缺陷

---

## 15. 实施顺序（后续编码计划）

1. 建立 v2 路由与数据骨架
2. 完成 A2 模块全量落地（作为模板）
3. 接入 A2 训练与通过门槛
4. 再复制模板落地 W1P / DP / fBO
5. 最后统一优化 UI 与题库质量

---

*文档版本: v2.6 (clean)*
*用途: 无重复、顺序正确的主规格文档，供后续追溯补齐与编码引用*