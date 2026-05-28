import { useEffect, useMemo, useRef, useState } from "react";

type BlogImage = {
  url: string;
  localPath: string | null;
  publicPath?: string | null;
  filename: string;
};

type BlogPost = {
  id: string;
  title: string;
  published: string;
  updated: string;
  url: string;
  htmlPath: string;
  textPath: string;
  labels: string[];
  setupCandidates: string[];
  excerpt: string;
  imageCount: number;
  images: BlogImage[];
  searchText?: string;
};

type BlogManifest = {
  source: string;
  generatedAt: string;
  postCount: number;
  imageCount: number;
  posts: BlogPost[];
};

type StudyStage = {
  id: string;
  title: string;
  authorEvidence: string;
  postIds: string[];
  tags: string[];
};

const archiveBase = "/ninetrans-blog";

const studyPath: StudyStage[] = [
  {
    id: "start",
    title: "01 起步：Rule of Ten 与 SIM",
    authorEvidence: "作者写给 rank beginner：first step 是 SIM；并明确说 start with A2 and stick to A2 only. My best trades are A2, W1P, DP and fBO.",
    postIds: [
      "nt-2011-01-29-the-rule-of-ten-a-trading-plan",
      "nt-2011-01-17-four-trades-off-nine-transitions",
      "nt-2011-01-25-the-very-best-trades"
    ],
    tags: ["beginner", "SIM", "Rule of Ten"]
  },
  {
    id: "basics",
    title: "02 读图基础：Price Action Basics",
    authorEvidence: "The very first thing to learn about price action trading is signal bar selection. 作者专门写了 10 篇 Price Action Basics 系列。",
    postIds: [
      "nt-2011-09-13-price-action-basics-i-bar-selection",
      "nt-2011-09-14-price-action-basics-ii-reversals-and-pullbacks-in-trends",
      "nt-2011-09-15-price-action-basics-iii-1st-reversal-or-opening-reversal",
      "nt-2011-09-26-price-action-basics-iv-trading-ranges-trends-fbos-and-bps",
      "nt-2011-09-27-price-action-basics-v-the-open-gaps",
      "nt-2011-09-28-price-action-basics-vi-the-first-bar",
      "nt-2011-09-29-price-action-basics-vii-the-initial-trend-1rev-and-1pb",
      "nt-2011-09-30-price-action-basics-viii-the-opening-range-and-its-measured-move",
      "nt-2011-10-03-price-action-basics-ix-scalp-and-swing-entries",
      "nt-2011-10-05-price-action-basics-x-more-than-bars"
    ],
    tags: ["signal bar", "reversal", "pullback", "trading range", "trend"]
  },
  {
    id: "market-state",
    title: "03 市场状态：趋势与盘整",
    authorEvidence: "The first principles: 先区分市场什么时候 tradeable，什么时候 not tradeable.",
    postIds: [
      "nt-2014-01-23-the-first-principles",
      "nt-2014-02-21-trend-and-chop",
      "nt-2011-07-25-trading-barb-wire",
      "nt-2011-05-17-barb-wire",
      "nt-2011-04-26-spike-and-channel",
      "nt-2015-09-22-trading-a-choppy-day"
    ],
    tags: ["trend", "chop", "barb wire", "spike", "channel"]
  },
  {
    id: "a2",
    title: "04 A2 专题：新手唯一推荐",
    authorEvidence: "Rule of Ten: You should start with A2 and stick to A2 only. 作者明确说 A2 is my favorite entry. 新手只做 A2。",
    postIds: [
      "nt-2011-02-08-the-classic-a2",
      "nt-2011-01-03-a2-as-a-reversible-trade",
      "nt-2011-06-24-a2-variants",
      "nt-2011-06-02-failed-a2",
      "nt-2011-08-23-two-legged-pullbacks-vs-a2-vs-g2",
      "nt-2011-05-20-the-most-swingable-setups",
      "nt-2013-12-02-smaller-stops-larger-gains",
      "nt-2014-01-16-tight-stops-and-other-simplifications"
    ],
    tags: ["A2", "pullback", "entry", "swing", "2-legged"]
  },
  {
    id: "w1p",
    title: "05 W1P 专题：楔形反转后回撤",
    authorEvidence: "My best trades are A2, W1P, DP and fBO. 掌握 A2 后再学 W1P. W1P is a much better trade than W.",
    postIds: [
      "nt-2011-02-23-wedge-reversals-and-w1p",
      "nt-2011-04-06-two-legged-w1p",
      "nt-2011-05-16-strong-wedge",
      "nt-2011-05-25-wedge-pullback",
      "nt-2011-04-19-failed-wedges",
      "nt-2011-07-12-a-wedge-reversal-of-a-weak-trend-may-generate-a-strong-trend"
    ],
    tags: ["W1P", "wedge", "reversal", "overshoot"]
  },
  {
    id: "dp",
    title: "06 DP 专题：双顶/双底回撤",
    authorEvidence: "My best trades are A2, W1P, DP and fBO. DPs are often trend generators and work best in the direction of the previous trend.",
    postIds: [
      "nt-2011-03-17-double-top-and-double-bottoms",
      "nt-2011-07-21-double-bottom-pullbacks",
      "nt-2012-03-09-anticipating-dp-setups",
      "nt-2012-02-09-trend-termination-tt-double-top"
    ],
    tags: ["DP", "double top", "double bottom", "trend generator"]
  },
  {
    id: "fbo",
    title: "07 fBO 专题：失败突破",
    authorEvidence: "My best trades are A2, W1P, DP and fBO. Most first attempts to breakout fail. 大多数突破会失败。",
    postIds: [
      "nt-2011-01-27-optimal-trading-of-breakouts-and-failed-breakouts",
      "nt-2011-03-10-failed-breakouts",
      "nt-2011-03-14-breakout-pullbacks-vs-failed-breakouts",
      "nt-2011-09-23-good-and-bad-fbo",
      "nt-2011-05-23-wedge-failed-breakout-wfbo",
      "nt-2011-09-09-wedge-failed-breakouts"
    ],
    tags: ["fBO", "breakout", "failed breakout", "BP"]
  },
  {
    id: "openers",
    title: "08 1PB / Openers：开盘交易",
    authorEvidence: "1PB is usually the best setup for new traders, if they can skip days without a clear 1PB. 开盘交易需要更多经验。",
    postIds: [
      "nt-2011-05-11-the-first-pullback",
      "nt-2011-05-09-the-first-reversal",
      "nt-2011-05-12-the-various-types-of-1pb",
      "nt-2015-09-17-the-openers-1w-first-wedge-and-1p-the-first-pullback-in-a-trend",
      "nt-2014-02-18-the-openers-1w",
      "nt-2015-09-16-openers-ib2"
    ],
    tags: ["1PB", "1Rev", "1W", "openers"]
  },
  {
    id: "execution",
    title: "09 执行与风险：少而好",
    authorEvidence: "Fewer, better trades: 新手最大错误之一是 overtrading. 新 setup 要先在 disciplined SIM 中验证.",
    postIds: [
      "nt-2011-11-09-fewer-better-trades",
      "nt-2011-11-13-two-strikes",
      "nt-2011-12-05-overconfidence",
      "nt-2011-05-05-optimizing-your-stop-size",
      "nt-2011-04-12-anatomy-of-a-trading-day"
    ],
    tags: ["overtrading", "two strikes", "SIM", "stop"]
  },
  {
    id: "trade-mgmt",
    title: "10 交易管理：止损、目标、持仓",
    authorEvidence: "止损和目标是交易系统的核心组成部分。作者专门讨论了 scalp vs swing 的区别。",
    postIds: [
      "nt-2011-02-07-exiting-a-swing-position",
      "nt-2011-03-23-the-swing-view",
      "nt-2011-06-28-choosing-trades-to-swing",
      "nt-2011-06-01-holding-swings",
      "nt-2011-11-03-choosing-scalp-and-swing-entries",
      "nt-2012-06-28-choosing-target-for-w-and-wfbo",
      "nt-2013-01-09-creating-a-trading-system-vi-stops-targets-and-winrate"
    ],
    tags: ["stop", "target", "scalp", "swing", "trade management"]
  },
  {
    id: "intraday-patterns",
    title: "11 日内形态：趋势日与盘整日",
    authorEvidence: "作者区分了趋势日、盘整日、通道等不同市场形态，需要不同的交易策略。",
    postIds: [
      "nt-2011-03-29-classic-trend-day",
      "nt-2011-03-31-determining-trend-day-versus-trading-range-day",
      "nt-2011-03-30-trading-ranges-breakouts-fbo-bp-and-tt-trend-terminations",
      "nt-2011-12-10-slow-down-on-soft-trend-days",
      "nt-2011-01-10-large-open-bar-is-a-trading-range",
      "nt-2011-01-26-large-overlaps-are-trading-ranges",
      "nt-2011-08-11-trading-plan-trend-day",
      "nt-2011-08-12-trading-plan-trading-range-day",
      "nt-2011-11-02-trading-range-day-as-a-series-of-fbo"
    ],
    tags: ["trend day", "trading range day", "soft trend", "hard trend"]
  },
  {
    id: "channels",
    title: "12 通道： Spike & Channel",
    authorEvidence: "作者专门写了 Channel Theory 系列，通道是常见的市场结构。",
    postIds: [
      "nt-2011-05-24-channels-are-trends",
      "nt-2011-07-01-spike-and-channel-day",
      "nt-2012-10-04-channel-theory-i-defining-channels",
      "nt-2012-10-05-channel-theory-ii-origin",
      "nt-2012-10-08-channel-theory-iii-transitions",
      "nt-2012-10-12-channel-theory-iv-tradable-channels",
      "nt-2012-10-15-channel-theory-v-1st-channel-breakouts-usually-fail",
      "nt-2012-10-19-channel-theory-vi-channels-are-forever"
    ],
    tags: ["channel", "spike", "trend channel"]
  },
  {
    id: "psychology",
    title: "13 心理与纪律",
    authorEvidence: "交易心理是成功的关键因素。作者专门讨论了纪律、耐心、过度交易等问题。",
    postIds: [
      "nt-2011-12-01-discipline",
      "nt-2011-12-03-trading-discipline",
      "nt-2012-08-24-the-hard-road-to-consistency-viii-the-tyranny-of-psychology",
      "nt-2012-09-05-the-hard-road-to-consistency-x-the-elusiveness-of-discipline",
      "nt-2013-05-02-trendline-discipline",
      "nt-2015-10-23-patience-and-discipline-as-keys-to-trading"
    ],
    tags: ["psychology", "discipline", "patience", "emotions"]
  },
  {
    id: "other-setups",
    title: "14 其他形态：G2、BP、1CBO",
    authorEvidence: "除了四大核心交易，还有其他形态如 G2（二次缺口）、BP（突破回撤）、1CBO（首次通道突破）。",
    postIds: [
      "nt-2011-01-12-first-reversal-vs-first-pullback-vs-first-channel-breakout",
      "nt-2011-02-04-first-channel-breakouts",
      "nt-2012-01-04-the-opening-fbo",
      "nt-2012-01-30-opening-range-1rev-vs-1pb-vs-fbo"
    ],
    tags: ["G2", "BP", "1CBO", "WFBO", "other setups"]
  },
  {
    id: "daily-analysis",
    title: "15 每日行情分析（349篇）",
    authorEvidence: "作者对每日市场走势的详细分析和复盘，是学习 price action 的最佳实战素材。按时间排序，从 2010 年 12 月到 2018 年 4 月。",
    postIds: [
      "nt-2010-12-09-a-hard-wedge-reversal",
      "nt-2010-12-10-slow-down-on-soft-trend-days",
      "nt-2010-12-13-trading-range-day",
      "nt-2010-12-14-fomc-day",
      "nt-2010-12-15-traps",
      "nt-2010-12-16-the-expanding-triangle-open",
      "nt-2010-12-17-trading-breakouts-and-tight-trading-ranges",
      "nt-2010-12-20-trend-reversal",
      "nt-2010-12-21-the-glacier",
      "nt-2010-12-22-another-soft-trend-glacier-day",
      "nt-2010-12-23-small-doji-day",
      "nt-2010-12-27-the-importance-of-catching-the-early-move",
      "nt-2010-12-28-the-first-reversal",
      "nt-2010-12-29-opening-range-breakout-and-pullback",
      "nt-2010-12-30-trend-respawn",
      "nt-2010-12-31-trend-breaks-and-trend-births",
      "nt-2011-01-04-trend-from-first-bar",
      "nt-2011-01-05-first-pullbacks-and-breakout-tests",
      "nt-2011-01-06-the-gapless-open",
      "nt-2011-01-07-trading-with-trend",
      "nt-2011-01-11-buying-limits",
      "nt-2011-01-13-the-various-kinds-of-reversals",
      "nt-2011-01-14-signs-of-trend-strength",
      "nt-2011-01-18-consolidation-and-breakout",
      "nt-2011-01-19-tight-trading-ranges-on-hard-trend-days",
      "nt-2011-01-20-handling-unclear-signals",
      "nt-2011-01-21-entering-on-l1-and-h1-in-a-strong-trend",
      "nt-2011-01-22-trading-first-reversal-video",
      "nt-2011-01-24-trading-channels",
      "nt-2011-01-28-trading-hard-trends",
      "nt-2011-01-31-determining-continuation-versus-reversal",
      "nt-2011-02-01-detecting-and-trading-extremely-strong-trends",
      "nt-2011-02-02-breaking-bad",
      "nt-2011-02-03-prison-break-breakouts-from-horizontal-flags",
      "nt-2011-02-05-developing-your-trading-skills",
      "nt-2011-02-09-one-legged-moves-to-ema",
      "nt-2011-02-10-lunch-money",
      "nt-2011-02-11-climax-and-exhaustion-bars",
      "nt-2011-02-14-weak-wedges",
      "nt-2011-02-16-managing-trades-that-go-bad",
      "nt-2011-02-17-on-vacation",
      "nt-2011-02-24-inside-bars",
      "nt-2011-02-25-expecting-pullbacks",
      "nt-2011-02-28-a-weak-move-off-the-first-pullback-may-indicate-first-reversal-ahead",
      "nt-2011-03-01-keep-the-trend-type-in-context-while-trading",
      "nt-2011-03-02-wedges-without-overshoots-reversal-bars-or-pullbacks",
      "nt-2011-03-03-correctly-trading-a-soft-trend",
      "nt-2011-03-04-trend-terminations-and-breakouts",
      "nt-2011-03-07-oio-reversals-and-failures",
      "nt-2011-03-08-the-obvious-first-reversal",
      "nt-2011-03-09-the-poor-first-reversal-and-triangle-open",
      "nt-2011-03-11-triangle-breakouts",
      "nt-2011-03-15-wide-range-days",
      "nt-2011-03-16-trading-strong-bear-days",
      "nt-2011-03-18-buy-above-bull-bars-sell-below-bear-bars",
      "nt-2011-03-21-ttr-trend-terminations",
      "nt-2011-03-22-small-range-days",
      "nt-2011-03-24-ttrs-are-trading-ranges",
      "nt-2011-03-25-breakout-pullbacks-as-trend-generators",
      "nt-2011-03-28-late-trends",
      "nt-2011-04-01-trending-trading-ranges",
      "nt-2011-04-04-days-with-poor-bars",
      "nt-2011-04-05-trend-reversals",
      "nt-2011-04-07-breakout-tests-as-trend-continuations",
      "nt-2011-04-08-a-channel-like-trend-usually-has-a-second-similar-leg",
      "nt-2011-04-11-the-first-two-legged-pullback-of-the-day",
      "nt-2011-04-13-signs-of-trend-strength",
      "nt-2011-04-14-trend-trading",
      "nt-2011-04-15-trendline-breaks",
      "nt-2011-04-18-trading-ttr-breakouts",
      "nt-2011-04-20-consolidation-after-gap",
      "nt-2011-04-21-trading-tight-trading-range-days",
      "nt-2011-04-25-the-importance-of-getting-into-the-am-trend",
      "nt-2011-04-27-trend-strength-is-proportional-to-bar-size-and-trading-range-size",
      "nt-2011-04-28-fading-two-legged-moves-in-a-trading-range",
      "nt-2011-04-29-the-importance-of-good-signal-bars",
      "nt-2011-05-02-a-second-failed-bp-is-a-trend-generator",
      "nt-2011-05-03-choosing-the-right-reversal",
      "nt-2011-05-04-large-bars-on-open",
      "nt-2011-05-06-huge-first-bar",
      "nt-2011-05-10-the-channel-open",
      "nt-2011-05-13-obnoxious-overshoots",
      "nt-2011-05-18-strong-trends",
      "nt-2011-05-19-tcl-test-on-open",
      "nt-2011-05-26-dont-fade-a-trend-till-after-a-trendline-break",
      "nt-2011-05-27-1pb-as-a-reversible-trade",
      "nt-2011-05-31-channel-on-reversal",
      "nt-2011-06-03-major-reversal-trendline-break-and-test",
      "nt-2011-06-06-1rev-and-1pb-considerations",
      "nt-2011-06-07-late-swingers",
      "nt-2011-06-08-a-simple-trading-range-day-trading-plan",
      "nt-2011-06-09-reversal-bars-in-a-strong-trend",
      "nt-2011-06-10-failed-h1-l1-in-a-strong-trend",
      "nt-2011-06-13-failed-wedges",
      "nt-2011-06-14-large-gaps",
      "nt-2011-06-15-large-reversal-bars-are-trading-ranges",
      "nt-2011-06-16-major-reversal-double-tl-break",
      "nt-2011-06-18-triangle-breakouts",
      "nt-2011-06-20-anticipating-trend-from-the-1st-bar",
      "nt-2011-06-21-g2-after-a-deep-pullback-in-a-strong-trend",
      "nt-2011-06-22-reversal-of-the-extreme-of-the-prior-day-as-a-trend-generator",
      "nt-2011-06-23-trend-acceleration",
      "nt-2011-06-27-final-flags",
      "nt-2011-06-29-two-legged-pullback-to-ema-on-open",
      "nt-2011-06-30-chop-barb-wire",
      "nt-2011-07-03-eliminating-your-mistakes-one-by-one",
      "nt-2011-07-05-2-legged-pullbacks-in-a-trading-range",
      "nt-2011-07-06-whipsaw",
      "nt-2011-07-07-trade-only-with-trend-when-bars-are-tiny",
      "nt-2011-07-08-a-2-legged-pullback-after-breakout-is-a-good-indication-of-a-reversal",
      "nt-2011-07-11-trends-dont-turn-around-easily",
      "nt-2011-07-13-tcl-failure",
      "nt-2011-07-14-trendline-breaks-end-the-trend-but-do-not-imply-reversal",
      "nt-2011-07-15-bw-midrange",
      "nt-2011-07-18-trendline-breaks",
      "nt-2011-07-19-limit-entries",
      "nt-2011-07-20-micro-channels",
      "nt-2011-07-22-ttrs-break-the-trend",
      "nt-2011-07-26-wedge-pullback",
      "nt-2011-07-27-hard-trend-identification-and-trading",
      "nt-2011-07-28-channel-after-a-trendline-break",
      "nt-2011-07-30-inside-bars",
      "nt-2011-08-01-small-bars",
      "nt-2011-08-02-inside-bar-after-breakout-bar",
      "nt-2011-08-03-trending-dojis",
      "nt-2011-08-04-day-full-of-large-bars",
      "nt-2011-08-05-other-options-on-wide-range-days",
      "nt-2011-08-08-bear-rallies",
      "nt-2011-08-09-risks-and-rewards-of-extreme-volatility",
      "nt-2011-08-10-large-inside-day",
      "nt-2011-08-15-failed-breakouts-and-breakout-pullbacks",
      "nt-2011-08-16-comparison-of-alternate-charts",
      "nt-2011-08-17-hard-turn",
      "nt-2011-08-18-trading-large-gaps",
      "nt-2011-08-19-large-triangle-breakouts",
      "nt-2011-08-22-catching-the-am-trend",
      "nt-2011-08-24-confirming-signs-after-weak-signal-bar",
      "nt-2011-08-25-a-failed-1rev-can-be-a-1pb",
      "nt-2011-08-26-managing-risk-on-days-with-huge-bars",
      "nt-2011-08-30-poor-1pb-setups-on-soft-trend-days",
      "nt-2011-08-30-rationale-of-the-first-reversal",
      "nt-2011-08-31-5tf-9tf-and-1tf",
      "nt-2011-09-02-the-most-recent-reversal-determines-direction-of-1pb",
      "nt-2011-09-07-extremely-strong-trends",
      "nt-2011-09-08-large-bars-could-turn-into-spike-and-channel",
      "nt-2011-09-12-major-reversal-bear-trendline-break-and-hl",
      "nt-2011-09-16-price-action-indicator",
      "nt-2011-09-19-overlapping-bars-produce-poor-signals",
      "nt-2011-09-20-early-and-late-trend-breaks",
      "nt-2011-09-22-risk-of-pullbacks-and-failures",
      "nt-2011-10-04-runaway-trends",
      "nt-2011-10-06-traps-i-bars-in-the-wrong-place",
      "nt-2011-10-07-traps-ii-overlaps",
      "nt-2011-10-10-traps-iii-poor-signal-bars",
      "nt-2011-10-11-trend-breakage",
      "nt-2011-10-12-inside-bar-reversals",
      "nt-2011-10-13-final-flags",
      "nt-2011-10-14-limit-entries-in-a-channel",
      "nt-2011-10-17-adding-on",
      "nt-2011-10-18-kinds-of-1rev",
      "nt-2011-10-19-the-am-and-the-pm-trends",
      "nt-2011-10-20-anticipating-mid-day-reversals",
      "nt-2011-10-21-channel-pullbacks",
      "nt-2011-10-24-after-the-trendline-break",
      "nt-2011-10-25-huge-open-bars",
      "nt-2011-10-26-anticipating-am-trend-reversals",
      "nt-2011-10-27-very-large-gap-up",
      "nt-2011-10-28-1tf-point-to-change-in-direction",
      "nt-2011-10-31-anticipating-late-trend-breaks",
      "nt-2011-11-01-buying-below-and-selling-above-overlaps-on-a-tr-day",
      "nt-2011-11-04-2-failures-to-close-gap",
      "nt-2011-11-07-three-push-legs",
      "nt-2011-11-08-failed-continuations-confirm-reversals",
      "nt-2011-11-10-fire-and-forget",
      "nt-2011-11-11-trend-termination-tt",
      "nt-2011-11-14-the-first-two-legged-pullback",
      "nt-2011-11-15-reversal-bars",
      "nt-2011-11-16-double-wedge",
      "nt-2011-11-19-vacation",
      "nt-2011-11-24-greed",
      "nt-2011-11-27-fear",
      "nt-2011-11-29-impatience",
      "nt-2011-12-19-going-on-tilt",
      "nt-2011-12-21-the-need-to-be-right",
      "nt-2011-12-29-ab-cd-measured-move",
      "nt-2012-01-03-the-january-effect",
      "nt-2012-01-05-a-higher-low-after-bullish-reversal-is-the-best-swing-entry",
      "nt-2012-01-06-trading-on-small-days",
      "nt-2012-01-09-the-grind",
      "nt-2012-01-10-inside-bar-after-bo-bar",
      "nt-2012-01-11-2br-signal-bars",
      "nt-2012-01-13-measured-move-of-opening-range",
      "nt-2012-01-17-trading-range-bo-vs-fbo",
      "nt-2012-01-18-pause-bars-after-breakout",
      "nt-2012-01-19-trend-breaks-do-not-imply-reversal",
      "nt-2012-01-20-the-first-close-beyond-the-ema",
      "nt-2012-01-23-reading-weak-reversal-signals",
      "nt-2012-01-24-signs-of-counter-trend-strength-in-a-gap-open",
      "nt-2012-01-25-trading-large-and-outside-bars",
      "nt-2012-01-26-microtrendlines-mtl",
      "nt-2012-01-27-the-most-dangerous-price-action",
      "nt-2012-01-31-trend-termination-tt-failed-reversal-followed-by-failed-a2",
      "nt-2012-02-01-deep-vs-shallow-pullbacks",
      "nt-2012-02-02-horizontal-tight-trading-range-ttr-or-dojistan",
      "nt-2012-02-03-trading-range-as-a-series-of-fbo",
      "nt-2012-02-06-liquidity-effect",
      "nt-2012-02-07-trend-termination-tt-ttr",
      "nt-2012-02-08-a2-variants-on-small-bar-days",
      "nt-2012-02-10-narrow-range-days-distort-your-perception",
      "nt-2012-02-11-i-understand-the-setups-but-am-unable-to-trade",
      "nt-2012-02-13-freezing-inability-to-pull-the-trigger",
      "nt-2012-02-14-when-reversal-bars-dont-trigger",
      "nt-2012-02-15-trigger-happy",
      "nt-2012-02-16-when-reversal-bars-don-t-trigger-ii",
      "nt-2012-02-17-choice-of-trading-instrument-is-thinner-better",
      "nt-2012-02-25-donations",
      "nt-2012-02-27-breaks-of-steep-trends",
      "nt-2012-02-28-getting-shaken-out-part-i-large-risk",
      "nt-2012-02-29-getting-shaken-out-ii-poor-setup-bar",
      "nt-2012-03-05-the-first-bar-trend-bar",
      "nt-2012-03-06-3-small-pushes-channels-micro-wedges-and-wedges",
      "nt-2012-03-07-getting-shaken-out-iii-not-taking-the-early-profit",
      "nt-2012-03-08-preferring-deep-pullbacks",
      "nt-2012-03-12-kryptonite-days",
      "nt-2012-03-13-trading-fomc",
      "nt-2012-03-14-getting-shaken-out-iv-recent-losing-trade",
      "nt-2012-03-15-the-ideal-first-reversal",
      "nt-2012-03-16-first-bar-doji-tight-days",
      "nt-2012-03-19-simple-1pb",
      "nt-2012-03-20-getting-shaken-out-v-mid-bar-decisions",
      "nt-2012-03-21-unable-to-hold-exiting-early-i-drawn-out-move",
      "nt-2012-03-22-the-first-opposing-trend-bar-in-a-channel",
      "nt-2012-03-23-unable-to-hold-exiting-early-ii-recency-bias",
      "nt-2012-03-26-signs-of-an-extremely-strong-trend",
      "nt-2012-03-27-trading-on-tilt-and-prevention",
      "nt-2012-03-28-unable-to-hold-exiting-early-iii-recent-losses",
      "nt-2012-03-29-two-swing-trades-a-day",
      "nt-2012-03-30-revenge-trading-i-reversing-where-you-would-be-stopped-out",
      "nt-2012-04-02-late-entries-in-a-channel",
      "nt-2012-04-03-early-strength-indicates-strength-late-in-the-day",
      "nt-2012-04-04-fading-a-strong-trend-instead-of-trading-with-trend",
      "nt-2012-04-05-trading-a-broken-trend",
      "nt-2012-04-07-webinar-for-donors-price-action-basics",
      "nt-2012-04-09-first-bar-reversal-bar",
      "nt-2012-04-10-first-bar-outside-bar",
      "nt-2012-04-11-bar-strengtheners-5tf",
      "nt-2012-04-12-trading-a-trend-from-the-first-bar",
      "nt-2012-04-13-your-trading-edge",
      "nt-2012-04-23-webinar-for-donors-2012-04-23",
      "nt-2012-04-24-spikes-as-trading-ranges",
      "nt-2012-04-25-failed-trades-reveal-market-information",
      "nt-2012-04-30-predicting-breakouts",
      "nt-2012-05-01-climax-top",
      "nt-2012-05-02-alternative-instruments-i-micro-contracts",
      "nt-2012-05-03-alternative-instruments-ii-thin-volume-contracts",
      "nt-2012-05-04-trendline-tests-and-break",
      "nt-2012-05-07-types-of-trading-errors",
      "nt-2012-05-08-definitive-signs-of-successful-reversal",
      "nt-2012-05-24-selecting-the-optimal-entry",
      "nt-2012-05-31-exiting-and-adding-on",
      "nt-2012-06-01-channel-risks",
      "nt-2012-06-04-small-or-no-gap",
      "nt-2012-06-05-letting-a-winner-turn-into-a-loser",
      "nt-2012-06-06-adding-to-a-losing-position",
      "nt-2012-06-07-reversing-your-postion-on-a-loss",
      "nt-2012-06-12-correctly-reading-a-breakout-test",
      "nt-2012-06-25-channel-risks",
      "nt-2012-06-27-wierd-old-trick-for-estimating-targets",
      "nt-2012-07-02-spike-and-inverted-channel",
      "nt-2012-07-06-channel-types",
      "nt-2012-07-09-exiting-early",
      "nt-2012-07-13-breakeven-odds",
      "nt-2012-07-16-stop-and-scalp-size-for-swing-trading",
      "nt-2012-07-17-the-ideal-price-action",
      "nt-2012-07-19-risks-of-fbo",
      "nt-2012-07-20-the-hard-road-to-consistency-i-overtrading",
      "nt-2012-07-24-the-hard-road-to-consistency-ii-the-off-day",
      "nt-2012-07-30-the-hard-road-to-consistency-iii-the-heavy-cost-of-education",
      "nt-2012-08-03-the-hard-road-to-consistency-iv-very-few-low-risk-trades",
      "nt-2012-08-06-the-hard-road-to-consistency-v-poor-price-action-days",
      "nt-2012-08-09-the-hard-road-to-consistency-vi-your-equity-curve-as-a-price-chart",
      "nt-2012-08-13-the-hard-road-to-consistency-vii-no-good-signal-bars",
      "nt-2012-09-03-the-hard-road-to-consistency-ix-the-need-to-re-learn-lessons-over-and-over",
      "nt-2012-09-22-the-road-ahead",
      "nt-2012-09-27-components-of-a-successful-trade",
      "nt-2012-10-20-predicting-longer-term-moves",
      "nt-2012-10-27-the-trader-s-mind-i-the-trading-contradiction",
      "nt-2012-10-31-the-trader-s-mind-ii-the-rush",
      "nt-2012-11-08-the-trader-s-mind-iii-eagerness-and-dispair",
      "nt-2012-11-09-the-trader-s-mind-iv-the-bargain",
      "nt-2012-11-12-the-trader-s-mind-v-the-anchor",
      "nt-2012-11-13-the-trader-s-mind-vi-conviction-and-doubt",
      "nt-2012-11-14-the-trader-s-mind-vii-the-chase",
      "nt-2012-11-15-the-trader-s-mind-viii-the-basics-of-emotions",
      "nt-2012-11-16-the-trader-s-mind-ix-the-consistent-trader",
      "nt-2012-11-18-the-trader-s-mind-x-the-transition-to-success",
      "nt-2012-12-02-creating-a-trading-system-i-a-new-beginning",
      "nt-2012-12-05-creating-a-trading-system-ii-trading-versus-investing",
      "nt-2012-12-09-creating-a-trading-system-iii-price-action-trading",
      "nt-2012-12-12-creating-a-trading-system-iv-the-basics",
      "nt-2013-01-07-creating-a-trading-system-v-a-mathematical-model",
      "nt-2013-01-16-creating-a-trading-system-vii-scalping",
      "nt-2013-01-18-creating-a-trading-system-viii-fading-overlaps-in-chop",
      "nt-2013-01-25-creating-a-trading-system-ix-the-best-setups",
      "nt-2013-01-29-creating-a-trading-system-x-trend-trading",
      "nt-2013-02-04-small-and-large-targets",
      "nt-2013-02-05-trading-narrow-ranges",
      "nt-2013-02-06-trend-acceleration",
      "nt-2013-02-08-fading-overlaps",
      "nt-2013-02-11-breakout",
      "nt-2013-02-12-the-illusion-of-versatility",
      "nt-2013-02-14-the-nature-of-experimentation",
      "nt-2013-02-15-large-stop-fading",
      "nt-2013-03-04-structure-before-pattern",
      "nt-2013-03-07-targets-and-turning-points",
      "nt-2013-03-10-late-12-2010-and-01-2011-posts-restored",
      "nt-2013-03-22-alternative-rss-reader",
      "nt-2013-03-23-the-first-few-weeks",
      "nt-2013-04-01-building-blocks",
      "nt-2013-04-03-location",
      "nt-2013-04-04-pattern",
      "nt-2013-04-08-bar",
      "nt-2013-05-08-location-trading-a-trendline",
      "nt-2013-05-09-the-key-to-confidence",
      "nt-2013-08-02-patience-and-agility",
      "nt-2013-08-07-single-trade-rule-a-cure-for-overtrading",
      "nt-2013-08-09-trading-without-ema",
      "nt-2013-08-14-multi-targets",
      "nt-2013-08-27-sizing",
      "nt-2013-10-04-shallow-and-deep-pullbacks-with-trendlines",
      "nt-2013-10-11-trendlines-and-tcls-as-targets",
      "nt-2013-10-16-targets-on-multiple-contracts",
      "nt-2013-11-01-quick-breakeven-exit-strategy-for-experimental-trades",
      "nt-2013-11-28-choppy-waters",
      "nt-2013-12-10-random-walks-and-predictable-trends",
      "nt-2014-03-06-classes-of-knowledge",
      "nt-2015-09-08-market-types-and-setups",
      "nt-2015-09-09-my-trading-philosophy",
      "nt-2015-09-14-the-open-trendlines-gap-and-setups",
      "nt-2015-09-22-waiting-for-chop-to-end",
      "nt-2015-09-24-large-inside-bar-on-1w",
      "nt-2015-09-25-small-trend-bars-in-a-hard-trend",
      "nt-2015-09-29-the-shallowest-trendline-from-the-prior-day",
      "nt-2017-06-10-nine-transitions-the-book",
      "nt-2018-04-09-trading-crypto",
      "nt-page-glossary",
      "nt-page-setup-chart",
      "nt-page-stages-of-mastering-price-action",
      "nt-page-trading-guide"
    ],
    tags: ["daily analysis", "case study", "实战"]
  }
];

function normalizePath(path: string | null | undefined) {
  if (!path) return "";
  return path.replace(/^docs\/ninetrans-blog\//, "").replace(/^public\/ninetrans-blog\//, "");
}

function publicUrl(path: string | null | undefined) {
  const normalized = normalizePath(path);
  return normalized ? `${archiveBase}/${normalized}` : "";
}

export function App() {
  const [manifest, setManifest] = useState<BlogManifest | null>(null);
  const [activeStageId, setActiveStageId] = useState(studyPath[0].id);
  const [activePostId, setActivePostId] = useState("");
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [zoomImage, setZoomImage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stagePanelCollapsed, setStagePanelCollapsed] = useState(false);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);

  useEffect(() => {
    fetch(`${archiveBase}/manifest.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`manifest load failed: ${response.status}`);
        return response.json() as Promise<BlogManifest>;
      })
      .then((data) => {
        setManifest(data);
        const firstPathPost = studyPath.flatMap((stage) => stage.postIds)
          .map((id) => data.posts.find((post) => post.id === id))
          .find(Boolean);
        setActivePostId(firstPathPost?.id ?? data.posts[0]?.id ?? "");
      })
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  const posts = manifest?.posts ?? [];
  const postById = useMemo(() => new Map(posts.map((post) => [post.id, post])), [posts]);
  const activeStage = studyPath.find((stage) => stage.id === activeStageId) ?? studyPath[0];
  const activePost = postById.get(activePostId) ?? posts[0];
  const pathPosts = activeStage.postIds.map((id) => postById.get(id)).filter((post): post is BlogPost => Boolean(post));

  const filteredPosts = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return posts;
    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.published,
        post.excerpt,
        post.searchText,
        ...(post.setupCandidates ?? []),
        ...(post.labels ?? [])
      ].join(" ").toLowerCase();
      return haystack.includes(value);
    });
  }, [posts, query]);

  function openPost(postId: string) {
    setActivePostId(postId);
  }

  if (loadError) return <main className="app-error">博客归档加载失败：{loadError}</main>;
  if (!manifest || !activePost) return <main className="app-loading">正在读取 Nine Transitions 本地归档...</main>;

  const shellClass = [
    "reader-shell",
    sidebarCollapsed && "sidebar-collapsed",
    stagePanelCollapsed && "stage-collapsed",
    libraryCollapsed && "library-collapsed"
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClass}>
      <aside className="reader-sidebar">
        <div className="brand-block">
          <span>NT</span>
          <div>
            <strong>Nine Transitions Reader</strong>
            <small>{manifest.postCount} posts · {manifest.imageCount} images</small>
          </div>
          <button
            className="collapse-btn"
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="折叠侧边栏"
          >
            «
          </button>
        </div>

        <nav className="stage-nav" aria-label="学习路径">
          {studyPath.map((stage, index) => (
            <button
              key={stage.id}
              className={stage.id === activeStage.id ? "active" : ""}
              type="button"
              onClick={() => {
                setActiveStageId(stage.id);
                const first = stage.postIds.map((id) => postById.get(id)).find(Boolean);
                if (first) openPost(first.id);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>{" "}
              {stage.title}
            </button>
          ))}
        </nav>

        <section className="path-context">
          <p>{activeStage.authorEvidence}</p>
          <div>
            {activeStage.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </section>
      </aside>

      {sidebarCollapsed && (
        <button
          className="float-expand-btn sidebar-expand"
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          title="展开侧边栏"
        >
          »
        </button>
      )}

      <main className="reader-main">
        <section className="workspace">
          <aside className="stage-panel">
            <div className="panel-title">
              <h2>{activeStage.title.split("：")[1] || activeStage.title}</h2>
              <span>{pathPosts.length}</span>
              <button
                className="collapse-btn"
                type="button"
                onClick={() => setStagePanelCollapsed(!stagePanelCollapsed)}
                title="折叠阶段文章"
              >
                «
              </button>
            </div>
            <div className="post-list">
              {pathPosts.map((post) => (
                <button
                  key={post.id}
                  className={post.id === activePost.id ? "active" : ""}
                  type="button"
                  onClick={() => openPost(post.id)}
                >
                  <span>{post.published.slice(0, 10)}</span>
                  <strong>{post.title}</strong>
                </button>
              ))}
            </div>
          </aside>

          {stagePanelCollapsed && (
            <button
              className="float-expand-btn stage-expand"
              type="button"
              onClick={() => setStagePanelCollapsed(false)}
              title="展开阶段文章"
            >
              »
            </button>
          )}

          <article className="reader-panel">
            <header className="reader-header">
              <span>{activePost.published.slice(0, 10)}</span>
              <a href={activePost.url} target="_blank" rel="noreferrer">博客原文</a>
              <a href={publicUrl(activePost.textPath)} target="_blank" rel="noreferrer">TXT</a>
            </header>
            <OriginalPost post={activePost} onZoomImage={setZoomImage} />
          </article>

          <aside className="library-panel">
            <div className="panel-title">
              <h2>文章库</h2>
              <span>{filteredPosts.length}</span>
              <button
                className="collapse-btn"
                type="button"
                onClick={() => setLibraryCollapsed(!libraryCollapsed)}
                title="折叠文章库"
              >
                »
              </button>
            </div>
            <label className="global-search">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索文章..."
              />
            </label>
            <div className="post-list">
              {filteredPosts.slice(0, 300).map((post) => (
                <button
                  key={post.id}
                  className={post.id === activePost.id ? "active" : ""}
                  type="button"
                  onClick={() => openPost(post.id)}
                >
                  <span>{post.published.slice(0, 10)}</span>
                  <strong>{post.title}</strong>
                </button>
              ))}
            </div>
          </aside>

          {libraryCollapsed && (
            <button
              className="float-expand-btn library-expand"
              type="button"
              onClick={() => setLibraryCollapsed(false)}
              title="展开文章库"
            >
              «
            </button>
          )}
        </section>
      </main>

      {zoomImage && (
        <button className="image-lightbox" type="button" onClick={() => setZoomImage("")} aria-label="关闭图片放大">
          <img src={zoomImage} alt="" />
        </button>
      )}
    </div>
  );
}

function OriginalPost({ post, onZoomImage }: { post: BlogPost; onZoomImage: (src: string) => void }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  function wireImageZoom() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    doc.querySelectorAll("img").forEach((image) => {
      image.style.cursor = "zoom-in";
      image.addEventListener("click", () => {
        const src = image.getAttribute("src");
        if (src) onZoomImage(new URL(src, window.location.origin).href);
      });
    });
  }

  return (
    <section className="source-frame">
      <iframe ref={iframeRef} title={post.title} src={publicUrl(post.htmlPath)} onLoad={wireImageZoom} />
    </section>
  );
}
