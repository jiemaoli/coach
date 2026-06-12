# 交易手法固化练习系统 · 实现计划 v2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建纯前端单文件 HTML 应用，帮助交易者按固定流程练习交易 setup，记录每笔交易（支持分批平仓）、按入场原因统计各种打法的表现、分阶段固化手法、最终自动判断是否达到实盘标准。

**Architecture:** 单文件 HTML（HTML + CSS + JS），IndexedDB 本地持久化，Canvas API 绘制图表，JSON 文件导出/导入备份。支持多 setup 并行管理、入场原因跨 setup 横向统计、可编辑参考速查表、纪律提醒横幅。

**Tech Stack:** 纯前端（零依赖、零安装），IndexedDB，Canvas 2D API，FileReader/Blob API。

**输出文件:** `C:\Users\18502\trading-practice-tracker\index.html`

---

## 文件结构（单文件内部模块划分）

```
index.html  (~8000-10000 行)
├── <style>        CSS (~1000 行)
└── <script>       JavaScript (~7000-9000 行)
    ├── §1 常量与配置
    ├── §2 IndexedDB 数据层（7 个 store）
    ├── §3 业务逻辑（手续费、盈亏、阶段判定、统计、固化）
    ├── §4 UI 渲染引擎
    ├── §5 标签页：仪表盘（含纪律横幅）
    ├── §6 标签页：录入交易（支持分批平仓）
    ├── §7 标签页：细节表管理
    ├── §8 标签页：入场原因管理
    ├── §9 标签页：统计分析（按入场原因 + 细节要点）
    ├── §10 标签页：参考速查表（市场状态×方向矩阵）
    ├── §11 标签页：数据管理（导入/导出）
    ├── §12 标签页：设置
    ├── §13 Canvas 图表引擎
    └── §14 初始化与事件绑定
```

---

## 数据模型（IndexedDB）

### 数据库: `TradingPracticeDB` v1

**Store: `setups`** | keyPath: `id` (autoIncrement) | index: `name` (unique)
```
{ id, name, description, createdAt, detailTableLocked, detailTableVersion }
```

**Store: `details`** | keyPath: `id` (autoIncrement) | index: `setupId`
```
{ id, setupId, category: 'entry'|'exit'|'stop_loss'|'take_profit', text, sortOrder, createdAt }
```

**Store: `entryReasons`** | keyPath: `id` (autoIncrement)
```
{ id, text, sortOrder, createdAt }
// 预置一条: "不知道为什么开仓"
```

**Store: `trades`** | keyPath: `id` (autoIncrement) | indexes: `setupId`, `[setupId, tradeNumber]`, `entryReasonId`
```
{
  id, setupId, tradeNumber, date,
  direction: 'long'|'short',
  entryPrice, quantity,                     // 总数量 = exitQty1 + exitQty2

  // === 分批平仓 leg 1（必填）===
  exitPrice1, exitQty1, exitFeeType1: 'maker'|'taker',
  // === 分批平仓 leg 2（可选，留空=不启用）===
  exitPrice2 (nullable), exitQty2 (nullable), exitFeeType2: 'maker'|'taker' (nullable),

  // === 自动计算 ===
  grossPnL,                                  // 两段合计毛盈亏
  entryFee, exitFee1, exitFee2, totalFee,    // 各腿手续费 + 合计
  netPnL,                                    // 净盈亏
  pnlStatus: 'win'|'loss'|'be',             // 自动判定：盈/亏/保本(BE)

  // === 交易元数据 ===
  entryReasonId,                             // 入场原因（外键 → entryReasons）
  entryReasonText,                           // 冗余存储，方便显示
  entryRationale,                            // 入场理由（文字）
  tradeType,                                 // 类型（文字）
  exitRationale,                             // 离场理由/方式（文字）
  notes,                                     // 备注
  supplementaryNotes,                        // 补充说明

  // === 合规与检查 ===
  checkedDetailIds: [number],                // 勾选的细节要点 ID 列表
  isCompliant: boolean,                      // 是否符合《开平细节表》全部规则

  timestamp, phaseAtTime
}
```

**Store: `solidification`** | keyPath: `id` (autoIncrement) | index: `setupId`
```
{ id, setupId, groupNumber, currentStreak, isComplete, scoreAwarded, startedAt, completedAt }
```

**Store: `quickReference`** | keyPath: `id` (autoIncrement)
```
{ id, rowLabel, colLabel, cellValue }
// rowLabel: '上涨'|'横盘'|'下跌'|'突破'|'假突破'|'趋势转换'
// colLabel: '做多'|'横盘'|'做空'
```

**Store: `settings`** | keyPath: `key`
```
{ key, value }
// makerFeeRate (0.00018), takerFeeRate (0.00045)
// evalStart (1), evalEnd (500)
// bannerLine1 ("若判断错误，只需等待..."), bannerLine2 ("接受亏损，然后继续")
```

---

## 业务逻辑

### 手续费与盈亏计算（支持分批平仓）

```javascript
// 入场手续费
entryFee = entryPrice × quantity × (isEntryMaker ? makerRate : takerRate)

// 离场段 1
grossPnL1 = direction === 'long'
  ? (exitPrice1 − entryPrice) × exitQty1
  : (entryPrice − exitPrice1) × exitQty1
exitFee1 = exitPrice1 × exitQty1 × (exitFeeType1 === 'maker' ? makerRate : takerRate)

// 离场段 2（如果有）
grossPnL2 = direction === 'long'
  ? (exitPrice2 − entryPrice) × exitQty2
  : (entryPrice − exitPrice2) × exitQty2
exitFee2 = exitPrice2 × exitQty2 × (exitFeeType2 === 'maker' ? makerRate : takerRate)

// 合计
grossPnL = grossPnL1 + (grossPnL2 || 0)
totalFee = entryFee + exitFee1 + (exitFee2 || 0)
netPnL = grossPnL − totalFee

// 盈亏状态
pnlStatus = netPnL > 0 ? 'win' : netPnL < 0 ? 'loss' : 'be'
```

### 阶段判定

| 阶段 | 条件（tradeCount = 当前 setup 的已录入笔数） |
|------|---------------------------------------------|
| A — 建表 | tradeCount === 0 |
| B — 探索期 | 1 ≤ tradeCount ≤ 100 |
| C — 巩固期 | 101 ≤ tradeCount ≤ 400 |
| D — 评估 | 401 ≤ tradeCount ≤ 500 |
| E — 固化期 | tradeCount ≥ 501 |

### 统计公式

```
胜率 = 盈利笔数 / 总笔数  （netPnL > 0 为盈利笔）
BE 笔 = netPnL === 0 的笔数（不计入胜率分子，但计入分母）
平均盈利 = Σ(盈利笔 netPnL) / 盈利笔数
平均亏损 = Σ(|亏损笔 netPnL|) / 亏损笔数
盈亏比 = 平均盈利 / 平均亏损
每笔期望 = 胜率 × 平均盈利 − 败率 × 平均亏损
满足交易者方程 ⇔ 每笔期望 > 0

要点成功率 = 用到该要点且盈利的笔数 / 用到该要点的总笔数

入场原因统计（每个入场原因一行）：
  使用次数、胜率、盈亏比、平均盈利、平均亏损、累计盈亏金额
  支持按胜率或盈亏比排序
  默认跨 setup 汇总，也可按 setup 筛选
```

### 固化期逻辑（阶段 E）

- 从第 501 笔起，以 50 笔为一组
- 每笔必须 `isCompliant === true`
- 任意一笔不合规 → 当前组作废，streak 归零，下一笔开始新组
- 连续 50 笔全合规 = 计 1 分
- 已得分保留，不要求组连续
- 累计 10 分 → 该 setup 已固化，显示「可以实盘」

---

## 任务分解

### Task 1: HTML 骨架、CSS 设计系统、纪律横幅

**文件:** `index.html`（新建）

**HTML 骨架：**
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>交易手法固化练习系统</title>
  <style>/* CSS here */</style>
</head>
<body>
  <!-- 纪律提醒横幅 -->
  <div id="discipline-banner">
    <div class="banner-line" contenteditable="true">若判断错误，只需等待，除非可反向操作</div>
    <div class="banner-line" contenteditable="true">接受亏损，然后继续</div>
    <button id="save-banner-btn" title="保存横幅文字">💾</button>
  </div>

  <header id="app-header">
    <h1>📊 交易手法固化练习系统</h1>
    <div id="setup-selector"><!-- 下拉选 setup + 新建按钮 --></div>
    <div id="phase-indicator"><!-- 阶段指示器 --></div>
  </header>

  <nav id="tab-nav">
    <button data-tab="dashboard" class="active">📊 仪表盘</button>
    <button data-tab="trade-entry">📝 录入交易</button>
    <button data-tab="detail-table">📋 细节表</button>
    <button data-tab="entry-reasons">🏷️ 入场原因</button>
    <button data-tab="statistics">📈 统计分析</button>
    <button data-tab="quick-ref">📐 速查表</button>
    <button data-tab="data-mgmt">💾 数据管理</button>
    <button data-tab="settings">⚙️ 设置</button>
  </nav>

  <main id="tab-content"><!-- 8 个 tab-panel --></main>
  <div id="toast-container"></div>
  <div id="modal-overlay" class="hidden"><div id="modal-box"></div></div>

  <script>/* JS here */</script>
</body>
</html>
```

**CSS 变量（深色主题）：**
```css
:root {
  --bg: #0f1117; --surface: #1a1d27; --surface2: #242836;
  --border: #2a2e3a; --text: #e1e4eb; --text2: #8b90a0;
  --green: #00c853; --red: #ff1744; --blue: #448aff;
  --yellow: #ffd740; --orange: #ff9100; --be: #9e9e9e;
  --radius: 8px; --radius-sm: 4px; --shadow: 0 2px 8px rgba(0,0,0,0.3);
}
```

**纪律横幅：** 固定在页面顶部，深色背景 + 黄色文字，可编辑，保存按钮写入 settings store。

---

### Task 2: IndexedDB 数据层（7 个 Store）

**在 `<script>` 中实现：**

`openDB()` 创建数据库，onupgradeneeded 创建所有 stores 和 indexes：

```
stores: setups, details, entryReasons, trades, solidification, quickReference, settings
```

**CRUD 封装函数（每个 store 一套）：**
```javascript
// 通用模式
function dbPut(storeName, obj) { return db.transaction(storeName, 'readwrite').objectStore(storeName).put(obj); }
function dbGetAll(storeName) { return db.transaction(storeName).objectStore(storeName).getAll(); }
function dbGet(storeName, id) { return db.transaction(storeName).objectStore(storeName).get(id); }
function dbDelete(storeName, id) { return db.transaction(storeName, 'readwrite').objectStore(storeName).delete(id); }
function dbClear(storeName) { return db.transaction(storeName, 'readwrite').objectStore(storeName).clear(); }
function dbGetByIndex(storeName, indexName, value) { ... }
function dbGetAllByIndex(storeName, indexName, value) { ... }
```

**预置数据写入：**
- `entryReasons`: 预置 "不知道为什么开仓"
- `quickReference`: 预置 6 行 × 3 列空矩阵
- `settings`: 预置默认费率、评估区间、横幅文字

---

### Task 3: 业务逻辑层（所有纯函数）

**函数清单：**

```javascript
// === 手续费 ===
function calcLegFee(price, qty, feeType, makerRate, takerRate) → number
function calcTotalFee(entryPrice, qty, isEntryMaker,
                       exitPrice1, exitQty1, exitFeeType1,
                       exitPrice2, exitQty2, exitFeeType2,
                       makerRate, takerRate) → { entryFee, exitFee1, exitFee2, totalFee }

// === 盈亏 ===
function calcGrossPnL(direction, entryPrice, exitPrice1, exitQty1, exitPrice2, exitQty2) → number
function calcNetPnL(grossPnL, totalFee) → number
function getPnlStatus(netPnL) → 'win'|'loss'|'be'

// === 阶段 ===
function getPhase(tradeCount) → { phase: 'A'|'B'|'C'|'D'|'E', label: string, color: string }
function isDetailTableLocked(phase) → boolean

// === 统计（核心）===
function calcSetupStatistics(trades, details) → StatsObject
function calcEntryReasonStatistics(trades, reasons, setupId?) → ReasonStatsArray
function calcSolidificationProgress(trades, solidificationRecords) → SolidProgress

// === 固化 ===
function processSolidification(setupId, trades, existingRecords) → newRecords
```

**入场原因统计输出结构：**
```javascript
[
  {
    reasonId, reasonText,
    totalUses, winCount, lossCount, beCount,
    winRate,                            // 胜率 = winCount / totalUses
    avgWin, avgLoss, profitFactor,      // 盈亏比
    totalPnL,                           // 累计盈亏金额
    expectedValue                       // 每笔期望
  },
  // ... 按胜率或盈亏比排序
]
```

---

### Task 4: Setup 管理 + 全局 Header

**实现：**
- Header 中 setup `<select>` 下拉 + 「+ 新建」按钮
- 新建/编辑 setup modal
- 删除 setup（级联确认）
- 阶段指示器（5 个阶段圆点 + 当前阶段高亮 + 笔数）
- 切换 setup → 刷新所有面板
- 全局变量 `currentSetupId`

---

### Task 5: 细节表管理

**实现：**
- 4 个分类区域（进场/出场/止损/止盈），每区一个输入框 + 添加按钮
- 已添加条目列表：显示分类图标、文本、拖拽排序、删除按钮
- 锁定状态指示（🔒/🔓）
- 锁定时修改 → 确认对话框 → 重置固化进度
- Phase A 时空白状态提示

---

### Task 6: 交易录入表单（支持分批平仓）

**表单布局（两列）：**

```
左列：                              右列：
方向: [做多] [做空]                  日期: [date input 默认今天]
进场价格: [number]                   数量(总张数): [number]
入场原因: [<select> 从 entryReasons 加载]
入场理由: [textarea]
类型: [text]
开仓手续费: [挂单(maker)] [吃单(taker)]

——— 分批平仓 ———
离场段 1（必填）：                    离场段 2（可选）：
  离场价格 1: [number]                 离场价格 2: [number]
  平仓数量 1: [number]                 平仓数量 2: [number]
  手续费类型: [挂单] [吃单]             手续费类型: [挂单] [吃单]

是否符合规则: [合规] [不合规]
离场理由/方式: [textarea]
备注: [textarea]
补充说明: [textarea]

——— 实时预览 ———
毛盈亏: +123.45  |  开仓费: 1.23  |  平仓费1: 2.34  |  平仓费2: 0.00
总手续费: 3.57  |  净盈亏: +119.88  |  状态: 🟢 盈利

[保存交易] 按钮
```

**自动计算逻辑：**
- 任何价格/数量/手续费类型变化 → 实时重新计算
- exitQty1 + exitQty2 应等于 quantity，不等时给出提示
- 保存时：自动计算 grossPnL、各腿 fee、netPnL、pnlStatus

**交易历史表格：**
```
日期 | 笔数 | 方向 | 入场价 | 离场1 | 量1 | 离场2 | 量2 | 入场原因 | 净盈亏 | 状态 | 合规 | 操作
```

---

### Task 7: 入场原因管理页签

**实现：**
- 当前入场原因列表（显示序号 + 文字 + 使用次数）
- 添加新原因：输入框 + 添加按钮
- 每条原因：编辑、删除按钮
- 删除时检查是否被交易引用，提示确认
- "不知道为什么开仓" 不可删除（标记为默认项）
- 排序：可拖拽调整顺序

---

### Task 8: 阶段管理与锁表逻辑

**实现：**
- 每次交易增删改后重新计算阶段
- 阶段切换 → Toast 通知
- Phase C 入口提示「建议停止修改细节表」
- 自动锁定（Phase C/D/E）
- 锁表修改 → 警告 dialog → 确认后重置

---

### Task 9: 仪表盘（Dashboard）

**布局：**
```
[纪律横幅] ← 全宽，黄色文字，已在 Task 1 实现

[阶段进度条] A → B → C → D → E（当前阶段高亮 + 笔数）

[关键指标卡片行 1] 总笔数 | 胜率 | 盈亏比 | 每笔期望
[关键指标卡片行 2] 平均盈利 | 平均亏损 | 总净盈亏 | 交易者方程

[固化进度卡片]（仅 Phase E 显示）
  当前组连续合规: 32/50  ████████░░░░░░░░
  累计得分: 3/10 ⭐⭐⭐☆☆☆☆☆☆

[最近 10 笔交易快速列表]

[入场原因表现 Top 5 卡片]
```

---

### Task 10: Canvas 图表引擎

**4 张图表：**

1. **胜率走势图**（折线）- X=笔数, Y=累计胜率, 50% 参考线
2. **累计净盈亏曲线**（面积图）- X=笔数, Y=累计净盈亏, 正绿负红
3. **要点成功率排行**（横向条形图）- 按成功率降序，颜色按分类
4. **入场原因对比图**（横向条形图）- 按胜率降序，标注使用次数

**ChartEngine 类：**
```javascript
class ChartEngine {
  static drawLineChart(canvas, datasets, options) { ... }     // 支持多线
  static drawAreaChart(canvas, data, options) { ... }         // 正负双色填充
  static drawHBarChart(canvas, items, options) { ... }        // 横向条形
  // options: { width, height, padding, colors, labels, ... }
  // 自动处理 DPI 缩放、坐标轴、刻度、标签截断
}
```

---

### Task 11: 统计分析面板

**子标签（统计分析页内）：**

**子标签 1: 「按入场原因统计」⭐（用户最看重）**
- 大表格，每行一个入场原因：
  ```
  入场原因 | 使用次数 | 胜率 | 盈亏比 | 平均盈利 | 平均亏损 | 累计盈亏 | 每笔期望
  牛旗或熊旗    | 23      | 69.6% | 2.45  | +85.30  | -34.80   | +860.50  | +12.50
  EMA20+H/L1  | 15      | 53.3% | 1.80  | +62.10  | -34.50   | +210.30  | +8.20
  不知道为什么  | 7       | 28.6% | 0.52  | +15.20  | -29.30   | -95.40   | -12.30
  ```
- 可点击表头按「胜率」或「盈亏比」排序
- Setup 筛选器：全部 / 按 setup 筛选
- 可选：只显示使用 ≥ N 次的原因（过滤小样本）

**子标签 2: 「按细节要点统计」**
- 要点成功率排行表（正字法）

**子标签 3: 「完整统计 + 图表」**
- 胜率走势图
- 累计盈亏曲线
- Phase D 评估报告（区间可调）

---

### Task 12: Phase D 评估 + Phase E 固化引擎

**Phase D 评估：**
- 当 tradeCount >= evalEnd（默认 500）时触发
- 评估模态框/面板：完整统计 + 交易者方程 + 结论
- 结论文字：「满足方程 → 可进入固化」或「不满足 → 建议优化」

**Phase E 固化引擎：**
```javascript
function processSolidification(setupId, trades, existingRecords) {
  const phaseETrades = trades.filter(t => t.tradeNumber >= 501)
                              .sort((a, b) => a.tradeNumber - b.tradeNumber);
  // 跳过已完成 group 对应的交易
  // 从最后一个未完成 group 开始检查
  // 逐笔判定 isCompliant → 累积或作废 → 计分
  // 返回更新后的 records
}
```

---

### Task 13: 参考速查表页签

**6 行 × 3 列可编辑矩阵：**

```
              做多          横盘          做空
上涨      [可编辑单元格] [可编辑单元格] [可编辑单元格]
横盘      [可编辑单元格] [可编辑单元格] [可编辑单元格]
下跌      [可编辑单元格] [可编辑单元格] [可编辑单元格]
突破      [可编辑单元格] [可编辑单元格] [可编辑单元格]
假突破    [可编辑单元格] [可编辑单元格] [可编辑单元格]
趋势转换  [可编辑单元格] [可编辑单元格] [可编辑单元格]
```

- 点击单元格 → 变为可编辑（contenteditable 或 textarea）
- 失焦自动保存到 `quickReference` store
- 预置空内容，用户自己填

---

### Task 14: 数据管理（导出/导入）

**导出：**
- 「导出全部数据 (JSON)」→ 下载 `trading-backup-YYYY-MM-DD.json`（包含所有 7 个 store）
- 「导出交易记录 (CSV)」→ 下载 CSV（Excel 可打开）

**导入：**
- 「导入数据 (JSON)」→ 选择文件 → 验证 → 预览摘要 → 确认 → 写入
- 导入前备份当前数据（在内存中保留，可撤销）

**其他：**
- 「重置所有数据」→ 二次确认（输入文字确认）→ 清空数据库

---

### Task 15: 设置面板

**设置项：**
- Maker 手续费率（% 显示，小数存储，默认 0.018%）
- Taker 手续费率（% 显示，小数存储，默认 0.045%）
- 评估区间起始笔数（默认 1）
- 评估区间结束笔数（默认 500）
- 纪律横幅第 1 行文字
- 纪律横幅第 2 行文字
- 「恢复默认设置」按钮

---

### Task 16: 初始化、收尾、端到端测试

**App.init() 流程：**
```
1. openDB() → 获取 db 引用
2. 初始化默认 settings（如不存在）
3. 初始化默认 entryReasons（如不存在则写入 "不知道为什么开仓"）
4. 初始化 quickReference 空矩阵（如不存在）
5. 加载 setups → 选择第一个（或提示创建）
6. 加载纪律横幅文字 → 渲染
7. 切换到仪表盘标签页
8. 绑定全局事件
```

**端到端测试流程：**
1. 创建 setup → 建细节表
2. 录入 5 笔交易（含分批平仓）→ 检查统计
3. 添加入场原因 → 按原因统计
4. 编辑速查表 → 刷新确认
5. 导出 JSON → 清空 → 导入 → 数据一致
6. 修改细节表（锁定状态）→ 确认警告
7. 模拟固化期逻辑（通过直接添加交易数据）

---

## 自查清单（实现完成后逐项核对）

### 第一遍：逻辑正确性
- [ ] 阶段按「第几笔」自动正确切换（A/B/C/D/E）
- [ ] 分批平仓两段计算正确（毛盈亏 + 各腿手续费 + 净盈亏）
- [ ] 固化期「50 笔一组」的作废/重置/计分/累计到 10 分的逻辑正确
- [ ] 「符合规则」与「盈亏」被正确区分（连亏但合规的组应判定有效）
- [ ] 锁表后修改触发重新统计
- [ ] 盈亏状态三分类正确：盈(>0) / 亏(<0) / BE(=0)
- [ ] 入场原因统计跨 setup 汇总 + 按 setup 筛选均可工作
- [ ] "不知道为什么开仓" 不可删除

### 第二遍：统计与健壮性
- [ ] 胜率/盈亏比/每笔期望/交易者方程/要点成功率/入场原因统计公式正确，全部含手续费
- [ ] 数据持久化可靠（刷新页面数据不丢）
- [ ] 导出/导入功能正常（含新增的 entryReasons、quickReference）
- [ ] 空数据、删除某笔、修改某笔后，统计自动更新
- [ ] 分批平仓各字段留空时正确处理（不崩溃、不误算）
- [ ] 纪律横幅编辑后保存成功，刷新后保持
- [ ] 速查表编辑后保存成功，刷新后保持
- [ ] 主要流程完整跑通，无 JS 报错

---

## 实施说明

每完成一个 Task，立即在浏览器中打开 `index.html` 验证功能是否正常。所有 JS 错误必须当场修复后再进入下一个 Task。
