# 知识点覆盖矩阵 v4（Setup-Driven，基于 clean v2.6 + Rule Traceability v2 复核）

**基线文档**: `docs/ninetrans_book.pdf`（主），`docs/ninetrans_book.txt`（辅）
**评估对象**: `docs/coach-requirements-and-design-v2.6-clean.md`（内容目标版本 v2.6 clean）
**评估目标**: 在 clean v2.6 主规格与 Rule Traceability v2 首轮分支级补齐后，复核“可交易 setup 学习系统”是否已达到编码前高完整度状态，并识别最后剩余缺口。

---

## 1) 评估口径

- **Green**：规则、边界、执行、失败、考核、题库蓝图已达到可实现级，且已有较稳定追溯支撑。
- **Yellow**：主规则已成型，但仍缺更精确原文锚点、完整题面、图例资产、或实现时会反复回看文档的整理项。
- **Red**：关键规格仍缺失，不建议编码该部分。

---

## 2) v3 → v4 变化总览

| 领域 | v3 | v4 | 变化说明 |
|---|---|---|---|
| A2 | Green | Green | 保持稳定，仍是模板模块 |
| W1P | Green | Green | 规则稳定，追溯支撑增强 |
| DP | Green | Green | 规则稳定，追溯支撑增强 |
| fBO | Green | Green | 规则稳定，追溯支撑增强 |
| 开盘结构整合 | Green | Green | 保持稳定 |
| Rule-of-10 / readiness | Green | Green | 保持稳定 |
| Rule Traceability | Yellow | Yellow / 接近 Green | 已补分支级条目，但部分仍为 support anchor（medium） |
| 内容资产化（题面/图例） | Yellow | Yellow | 蓝图完整，但题面与图例资产仍未全量落地 |
| 文档完整性/结构整理 | Yellow | Green | 主规格已整理为 clean v2.6 线性版本 |
| 编码启动准备度 | Green | Green / 更稳 | 规则层和结构层已明显高于 v3 |

---

## 3) Setup 级覆盖明细

## 3.1 A2

| 子项 | 状态 | 备注 |
|---|---|---|
| 定义与边界 | Green | near EMA / too far / third push / A22 / fA2 均已明确 |
| 识别 / 过滤 / 执行 / 失败 | Green | 四层识别、硬过滤、执行、失败分支完整 |
| 通过门槛 | Green | 样本量、准确率、硬错误、稳定性门槛齐全 |
| 题库蓝图 | Green | bucket、占比、最小场景覆盖完整 |
| 原文追溯 | Green | 仍是全系统追溯最完整模块 |

**A2 小结**：仍然是最完整、最可直接实现的模板模块。

## 3.2 W1P

| 子项 | 状态 | 备注 |
|---|---|---|
| 定义与定位 | Green | 已实现级 |
| 4 层识别 + 自动过滤 | Green | 已实现级 |
| 执行 / 失败分支 | Green | 已实现级 |
| 与 A2 / DP 区分 | Green | 已列必考 |
| 题库蓝图 | Green | bucket、占比、场景覆盖齐全 |
| 原文追溯 | Yellow / 接近 Green | 已有 `RT-W1P-*` 支撑，但目前仍属 support anchor，建议后续替换为更逐字化 quote |

## 3.3 DP

| 子项 | 状态 | 备注 |
|---|---|---|
| 定义与定位 | Green | 已实现级 |
| 4 层识别 + 自动过滤 | Green | 已实现级 |
| 执行 / 失败分支 | Green | 已实现级 |
| 与 W1P / fBO 区分 | Green | 已列必考 |
| 题库蓝图 | Green | bucket、占比、场景覆盖齐全 |
| 原文追溯 | Yellow / 接近 Green | 已有 `RT-DP-*` 首轮条目，但仍需更精确双顶/双底回调入场 quote |

## 3.4 fBO

| 子项 | 状态 | 备注 |
|---|---|---|
| 定义与定位 | Green | 已实现级 |
| 突破 → 失败 → 反向入场流程 | Green | 已实现级 |
| 执行 / 失败分支 | Green | 已实现级 |
| 与 A2 / DP 区分 | Green | 已列必考 |
| 题库蓝图 | Green | bucket、占比、场景覆盖齐全 |
| 原文追溯 | Green / 轻 Yellow | 已有 `RT-FBO-*` 主分类与 BP 对照锚点，完成度高于 W1P / DP |

---

## 4) 跨 setup 能力覆盖

| 能力 | 状态 | 说明 |
|---|---|---|
| Setup 冲突优先级决策 | Green | 已有状态 → 时序 → 结构 → 事件 → 延续裁决顺序 |
| 统一执行语义（±1t / 1R / T1/T2） | Green | 全 setup 一致 |
| 统一失败语义（不追价 / 等待 / 重评） | Green | 已贯穿 A2 / W1P / DP / fBO |
| 纪律系统（2/5 / Two Swing Wait） | Green | 已嵌入学习路径并有追溯 |
| 开盘结构状态机（1Rev / 1PB / A2 / W1P） | Green | 已有统一决策树与场景考核 |
| readiness 评分卡（Rule of 10） | Green | 已定义结构、门槛、回退机制、UI 要求 |
| 证据追溯（规则 → 原文） | Yellow / 接近 Green | 主干与分支均已成型，但少数分支仍是 medium/support anchor |
| 题面 / 图例资产化 | Yellow | 蓝图已足够，内容资产仍未落地 |
| 页面与 IA 映射 | Green | 路由、导航顺序、模块边界已清晰 |
| 数据模型实现准备度 | Green | SetupModule / DrillQuestion / RuleTrace / RuleOf10Scorecard 已就绪 |

---

## 5) Rule Traceability 复核（v4）

## 相比 v3 已完成的提升

- 已在主规格内加入 `Rule Traceability v2` 分支级条目。
- `W1P / DP / fBO / opening / conflict` 不再只是“待规划”，而是已有实际 `ruleId` 与 quote 填充。
- 高频跨 setup 条款继续由 PDF 高置信锚点支撑。
- 追溯系统现在已足以支持编码阶段做“规则 -> UI内容 -> drill解释”的映射。

## 仍待完成的部分

1. `RT-W1P-001`、`RT-W1P-002` 仍更偏支持性引用，而不是最理想的逐字定义句。
2. `RT-DP-001`、`RT-DP-002` 仍需要更直接的 double top / double bottom pullback 级别 quote。
3. 少数 opening / conflict 条款虽然已有锚点，但仍可进一步细化到“每个分支一条 quote”。
4. 当前追溯表仍在主规格文档内，后续若进入实现，建议拆成独立数据文件更稳。

**结论**：追溯体系已从“框架已成”升级为“可用首版”，剩余差距主要是精度优化，而不是缺失。

---

## 6) 关键剩余缺口（v4）

### P0.8 / 仍建议编码前补一轮，但已不是结构性阻塞

1. **W1P / DP 的更精确 PDF quote 替换**
   - 当前可用，但部分仍属 support anchor。
   - 这会影响“严格逐规则可追溯性”的质量上限，不太影响页面与引擎实现。

### P1 / 内容资产缺口

2. **W1P / DP / fBO 完整题面生成**
   - 目前有蓝图、桶、占比、最小场景清单。
   - 但还没有完整 question text + options + answer + rationale 数据资产。

3. **全 setup 图例 / SVG / 案例数据资产库**
   - 当前有场景覆盖清单。
   - 仍缺完整案例库（标准例、反例、混淆例、失败例）。

4. **Rule Traceability 独立资产化**
   - 目前已能用，但仍嵌在主规格中。
   - 真正实现时，拆成独立结构化内容源会更利于维护。

### P2 / 实现期再优化即可

5. **题目解析风格统一模板**
   - 文档已要求“为什么对 / 为什么错”。
   - 但尚未制定统一写作模板与字段约束。

6. **图例到题目桶的映射表**
   - 蓝图和场景都有，但还没形成“某场景供哪些题桶复用”的资产矩阵。

---

## 7) 当前可执行结论（v4）

- **从规则系统角度看**：已经达到高完整度，主干与分支结构都足以进入实现。
- **从文档结构角度看**：clean v2.6 已解决此前“重复、错位、误读风险”的问题。
- **从追溯角度看**：已进入“首版可用”状态，不再是只有框架没有内容。
- **从真正产品落地角度看**：最后的大头缺口已不再是规格，而是内容资产化。

换句话说：

- **规则系统**：ready
- **页面 / 数据模型 / 路由骨架**：ready
- **题库蓝图系统**：ready
- **原文追溯系统**：usable but still polishable
- **题面 / 图例资产系统**：not fully ready

因此，v4 阶段的核心判断是：

> 现在如果开始编码，风险已不再是“规则理解不完整”，而是“内容资产仍需持续补数”。

---

## 8) 覆盖率快照（v4）

- A2：**95%（Green）**
- W1P：**90%（Green）**
- DP：**89%（Green）**
- fBO：**90%（Green）**
- 开盘结构与 readiness：**92%（Green）**
- 跨 setup 决策与纪律：**92%（Green）**
- 追溯系统：**84%（Yellow，接近 Green）**
- 内容资产化：**76%（Yellow）**
- 文档完整性：**94%（Green）**

**整体（面向“可交易学习系统”）**：**91%（Green）**

> 解释：v4 相比 v3 的主要提升不在 setup 规则本身，而在于 clean v2.6 清理了主规格结构，同时 Rule Traceability v2 已从“规划状态”进入“首版可用状态”。当前剩余不足主要集中在题面、图例、以及少量分支 quote 精修，而不是规格主干缺失。

---

## 9) 下一步建议（不编码版，v4 后）

按收益排序，下一轮建议只做这 3 件事：

1. **补 W1P / DP 的更精确分支级 PDF quotes**
2. **开始生成 W1P / DP / fBO 的完整题面资产**
3. **建立全 setup 图例 / 案例资产清单与映射表**

完成这轮后，整体覆盖率有机会接近 **94%-96%**，届时再进入编码，内容侧返工会更少。

---

*版本: v4*
*用途: clean v2.6 + Traceability v2 首版完成后的编码前复核*