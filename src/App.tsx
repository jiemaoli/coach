import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type BlogImage = {
  url: string;
  localPath: string | null;
  publicPath?: string | null;
  filename: string;
};

type NormalizedTags = {
  content_type: string;
  market: string[];
  setup: string[];
  topic: string[];
  level: string;
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
  normalizedTags?: NormalizedTags;
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
  resources?: StudyResource[];
  tags: string[];
};

type StudyResource = {
  id: string;
  title: string;
  kind: "markdown";
  markdownUrl: string;
  label?: string;
};

type StageEntry =
  | {
      id: string;
      title: string;
      label: string;
      kind: "post";
      post: BlogPost;
    }
  | {
      id: string;
      title: string;
      label: string;
      kind: "resource";
      resource: StudyResource;
    };

function flattenNormalizedTags(tags: NormalizedTags | undefined) {
  if (!tags) return [];

  const values = [
    tags.content_type,
    tags.level,
    ...tags.market,
    ...tags.setup,
    ...tags.topic
  ];

  return values.flatMap((value) => {
    const normalized = value.toLowerCase();
    const spaced = normalized.replace(/_/g, " ");
    return spaced === normalized ? [normalized] : [normalized, spaced];
  });
}

const TAG_DIMENSIONS = [
  { key: "content_type", label: "Type", single: true, values: ["daily", "theory", "reference"] },
  { key: "market", label: "Market", single: false, values: ["trend", "range", "chop", "channel", "general"] },
  { key: "setup", label: "Setup", single: false, values: ["A2", "W1P", "DP", "fBO", "1PB", "1Rev", "G2", "BP", "1CBO", "general"] },
  { key: "topic", label: "Topic", single: false, values: ["execution", "trade_mgmt", "psychology", "risk", "openers", "general"] },
  { key: "level", label: "Level", single: true, values: ["beginner", "intermediate", "advanced"] },
] as const;

const archiveBase = "/ninetrans-blog";

const studyPath: StudyStage[] = [
  {
    id: "start",
    title: "Getting Started: Rule of Ten & SIM",
    authorEvidence: "Written for rank beginner: first step is SIM; explicitly says start with A2 and stick to A2 only. My best trades are A2, W1P, DP and fBO.",
    postIds: [
      "nt-2011-01-17-four-trades-off-nine-transitions",
      "nt-2011-01-25-the-very-best-trades",
      "nt-2011-01-29-the-rule-of-ten-a-trading-plan",
      "nt-page-setup-chart",
      "nt-2013-03-23-the-first-few-weeks"
    ],
    tags: ["beginner", "SIM", "Rule of Ten"]
  },
  {
    id: "basics",
    title: "Price Action Basics",
    authorEvidence: "The very first thing to learn about price action trading is signal bar selection. Author wrote 10 Price Action Basics series posts.",
    postIds: [
      "nt-page-stages-of-mastering-price-action",
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
    title: "Market State: Trend & Chop",
    authorEvidence: "The first principles: distinguish when market is tradeable vs not tradeable.",
    postIds: [
      "nt-2011-04-26-spike-and-channel",
      "nt-2011-05-17-barb-wire",
      "nt-2011-07-25-trading-barb-wire",
      "nt-2014-01-23-the-first-principles",
      "nt-2014-02-21-trend-and-chop",
      "nt-2015-09-22-trading-a-choppy-day"
    ],
    tags: ["trend", "chop", "barb wire", "spike", "channel"]
  },
  {
    id: "a2",
    title: "A2: Beginner's Only Recommended Setup",
    authorEvidence: "Rule of Ten: You should start with A2 and stick to A2 only. Author explicitly says A2 is my favorite entry.",
    postIds: [
      "nt-2011-01-03-a2-as-a-reversible-trade",
      "nt-2011-02-08-the-classic-a2",
      "nt-2011-05-20-the-most-swingable-setups",
      "nt-2011-06-02-failed-a2",
      "nt-2011-06-24-a2-variants",
      "nt-2011-08-23-two-legged-pullbacks-vs-a2-vs-g2",
      "nt-2013-12-02-smaller-stops-larger-gains",
      "nt-2014-01-16-tight-stops-and-other-simplifications"
    ],
    tags: ["A2", "pullback", "entry", "swing", "2-legged"]
  },
  {
    id: "w1p",
    title: "W1P: Wedge 1st Pullback",
    authorEvidence: "My best trades are A2, W1P, DP and fBO. Master A2 first, then learn W1P. W1P is a much better trade than W.",
    postIds: [
      "nt-2011-02-23-wedge-reversals-and-w1p",
      "nt-2011-04-06-two-legged-w1p",
      "nt-2011-04-19-failed-wedges",
      "nt-2011-05-16-strong-wedge",
      "nt-2011-05-25-wedge-pullback",
      "nt-2011-07-12-a-wedge-reversal-of-a-weak-trend-may-generate-a-strong-trend"
    ],
    tags: ["W1P", "wedge", "reversal", "overshoot"]
  },
  {
    id: "dp",
    title: "DP: Double Top/Bottom Pullback",
    authorEvidence: "My best trades are A2, W1P, DP and fBO. DPs are often trend generators and work best in the direction of the previous trend.",
    postIds: [
      "nt-2011-03-17-double-top-and-double-bottoms",
      "nt-2011-07-21-double-bottom-pullbacks",
      "nt-2012-02-09-trend-termination-tt-double-top",
      "nt-2012-03-09-anticipating-dp-setups"
    ],
    tags: ["DP", "double top", "double bottom", "trend generator"]
  },
  {
    id: "fbo",
    title: "fBO: Failed Breakout",
    authorEvidence: "My best trades are A2, W1P, DP and fBO. Most first attempts to breakout fail.",
    postIds: [
      "nt-2011-01-27-optimal-trading-of-breakouts-and-failed-breakouts",
      "nt-2011-03-10-failed-breakouts",
      "nt-2011-03-14-breakout-pullbacks-vs-failed-breakouts",
      "nt-2011-05-23-wedge-failed-breakout-wfbo",
      "nt-2011-09-09-wedge-failed-breakouts",
      "nt-2011-09-23-good-and-bad-fbo"
    ],
    tags: ["fBO", "breakout", "failed breakout", "BP"]
  },
  {
    id: "openers",
    title: "1PB / Openers: Opening Trades",
    authorEvidence: "1PB is usually the best setup for new traders, if they can skip days without a clear 1PB. Opening trades require more experience.",
    postIds: [
      "nt-2011-05-09-the-first-reversal",
      "nt-2011-05-11-the-first-pullback",
      "nt-2011-05-12-the-various-types-of-1pb",
      "nt-2014-02-18-the-openers-1w",
      "nt-2015-09-16-openers-ib2",
      "nt-2015-09-17-the-openers-1w-first-wedge-and-1p-the-first-pullback-in-a-trend"
    ],
    tags: ["1PB", "1Rev", "1W", "openers"]
  },
  {
    id: "execution",
    title: "Execution & Risk: Fewer, Better Trades",
    authorEvidence: "Fewer, better trades: one of beginner's biggest mistakes is overtrading. New setups should be validated in disciplined SIM first.",
    postIds: [
      "nt-2011-04-12-anatomy-of-a-trading-day",
      "nt-2011-05-05-optimizing-your-stop-size",
      "nt-2011-11-09-fewer-better-trades",
      "nt-2011-11-13-two-strikes",
      "nt-2011-12-05-overconfidence"
    ],
    tags: ["overtrading", "two strikes", "SIM", "stop"]
  },
  {
    id: "trade-mgmt",
    title: "Trade Management: Stop, Target, Hold",
    authorEvidence: "Stops and targets are core components of a trading system. Author discusses scalp vs swing differences.",
    postIds: [
      "nt-2011-02-07-exiting-a-swing-position",
      "nt-2011-03-23-the-swing-view",
      "nt-2011-06-01-holding-swings",
      "nt-2011-06-28-choosing-trades-to-swing",
      "nt-2011-11-03-choosing-scalp-and-swing-entries",
      "nt-2012-06-28-choosing-target-for-w-and-wfbo"
    ],
    tags: ["stop", "target", "scalp", "swing", "trade management"]
  },
  {
    id: "intraday-patterns",
    title: "Intraday Patterns: Trend & Range Days",
    authorEvidence: "Author distinguishes trend days, range days, channels and other market patterns requiring different trading strategies.",
    postIds: [
      "nt-2011-01-10-large-open-bar-is-a-trading-range",
      "nt-2011-01-26-large-overlaps-are-trading-ranges",
      "nt-2011-03-29-classic-trend-day",
      "nt-2011-03-30-trading-ranges-breakouts-fbo-bp-and-tt-trend-terminations",
      "nt-2011-03-31-determining-trend-day-versus-trading-range-day",
      "nt-2011-11-02-trading-range-day-as-a-series-of-fbo",
      "nt-2010-12-10-slow-down-on-soft-trend-days"
    ],
    tags: ["trend day", "trading range day", "soft trend", "hard trend"]
  },
  {
    id: "trading-plan",
    title: "Trading Plan",
    authorEvidence: "Trading plans for different market conditions: trend days, range days, hard trends, soft trends, and spike & channel days.",
    postIds: [
      "nt-2011-03-03-correctly-trading-a-soft-trend",
      "nt-2011-06-08-a-simple-trading-range-day-trading-plan",
      "nt-2011-07-01-spike-and-channel-day",
      "nt-2011-07-27-hard-trend-identification-and-trading",
      "nt-2011-08-11-trading-plan-trend-day",
      "nt-2011-08-12-trading-plan-trading-range-day",
      "nt-page-trading-guide"
    ],
    tags: ["trading plan", "strategy", "rules"]
  },
  {
    id: "channels",
    title: "Channels: Spike & Channel",
    authorEvidence: "Author wrote Channel Theory series. Channels are common market structures.",
    postIds: [
      "nt-2011-05-24-channels-are-trends",
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
    title: "Psychology & Discipline",
    authorEvidence: "Trading psychology is a key factor for success. Author discusses discipline, patience, overtrading and other issues.",
    postIds: [
      "nt-2011-12-01-discipline",
      "nt-2011-12-03-trading-discipline",
      "nt-2012-07-20-the-hard-road-to-consistency-i-overtrading",
      "nt-2012-07-24-the-hard-road-to-consistency-ii-the-off-day",
      "nt-2012-07-30-the-hard-road-to-consistency-iii-the-heavy-cost-of-education",
      "nt-2012-08-03-the-hard-road-to-consistency-iv-very-few-low-risk-trades",
      "nt-2012-08-06-the-hard-road-to-consistency-v-poor-price-action-days",
      "nt-2012-08-09-the-hard-road-to-consistency-vi-your-equity-curve-as-a-price-chart",
      "nt-2012-08-13-the-hard-road-to-consistency-vii-no-good-signal-bars",
      "nt-2012-08-24-the-hard-road-to-consistency-viii-the-tyranny-of-psychology",
      "nt-2012-09-03-the-hard-road-to-consistency-ix-the-need-to-re-learn-lessons-over-and-over",
      "nt-2012-09-05-the-hard-road-to-consistency-x-the-elusiveness-of-discipline",
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
      "nt-2013-05-02-trendline-discipline",
      "nt-2015-10-23-patience-and-discipline-as-keys-to-trading"
    ],
    tags: ["psychology", "discipline", "patience", "emotions"]
  },
  {
    id: "traps",
    title: "Traps Series",
    authorEvidence: "Common trading traps: bars in wrong place, overlaps, poor signal bars.",
    postIds: [
      "nt-2011-10-06-traps-i-bars-in-the-wrong-place",
      "nt-2011-10-07-traps-ii-overlaps",
      "nt-2011-10-10-traps-iii-poor-signal-bars"
    ],
    tags: ["traps", "errors", "avoid"]
  },
  {
    id: "shaken-out",
    title: "Getting Shaken Out",
    authorEvidence: "Common reasons for getting shaken out of trades and how to avoid them.",
    postIds: [
      "nt-2012-02-28-getting-shaken-out-part-i-large-risk",
      "nt-2012-02-29-getting-shaken-out-ii-poor-setup-bar",
      "nt-2012-03-07-getting-shaken-out-iii-not-taking-the-early-profit",
      "nt-2012-03-14-getting-shaken-out-iv-recent-losing-trade",
      "nt-2012-03-20-getting-shaken-out-v-mid-bar-decisions"
    ],
    tags: ["shaken out", "exit", "psychology"]
  },
  {
    id: "unable-to-hold",
    title: "Unable to Hold",
    authorEvidence: "Exiting early due to drawn out moves, recency bias, and recent losses.",
    postIds: [
      "nt-2012-03-21-unable-to-hold-exiting-early-i-drawn-out-move",
      "nt-2012-03-23-unable-to-hold-exiting-early-ii-recency-bias",
      "nt-2012-03-28-unable-to-hold-exiting-early-iii-recent-losses"
    ],
    tags: ["exit early", "hold", "psychology"]
  },
  {
    id: "revenge-trading",
    title: "Revenge Trading",
    authorEvidence: "The dangers of revenge trading and how to avoid it.",
    postIds: [
      "nt-2012-03-30-revenge-trading-i-reversing-where-you-would-be-stopped-out"
    ],
    tags: ["revenge", "tilt", "psychology"]
  },
  {
    id: "creating-system",
    title: "Creating a Trading System",
    authorEvidence: "Comprehensive guide to building a trading system from scratch.",
    postIds: [
      "nt-2012-12-02-creating-a-trading-system-i-a-new-beginning",
      "nt-2012-12-05-creating-a-trading-system-ii-trading-versus-investing",
      "nt-2012-12-09-creating-a-trading-system-iii-price-action-trading",
      "nt-2012-12-12-creating-a-trading-system-iv-the-basics",
      "nt-2013-01-07-creating-a-trading-system-v-a-mathematical-model",
      "nt-2013-01-09-creating-a-trading-system-vi-stops-targets-and-winrate",
      "nt-2013-01-16-creating-a-trading-system-vii-scalping",
      "nt-2013-01-18-creating-a-trading-system-viii-fading-overlaps-in-chop",
      "nt-2013-01-25-creating-a-trading-system-ix-the-best-setups",
      "nt-2013-01-29-creating-a-trading-system-x-trend-trading"
    ],
    tags: ["system", "building", "framework"]
  },
  {
    id: "building-blocks",
    title: "Building Blocks",
    authorEvidence: "Fundamental concepts: Building blocks, Location, Pattern, Bar.",
    postIds: [
      "nt-2013-04-01-building-blocks",
      "nt-2013-04-03-location",
      "nt-2013-04-04-pattern",
      "nt-2013-04-08-bar",
      "nt-2013-05-08-location-trading-a-trendline",
      "nt-2013-05-09-the-key-to-confidence"
    ],
    tags: ["fundamentals", "building blocks", "location", "pattern", "bar"]
  },
  {
    id: "other-setups",
    title: "Other Setups: G2, BP, 1CBO",
    authorEvidence: "Beyond the four core trades, there are other setups like G2 (2nd gap), BP (breakout pullback), 1CBO (1st channel breakout).",
    postIds: [
      "nt-2011-01-12-first-reversal-vs-first-pullback-vs-first-channel-breakout",
      "nt-2011-02-04-first-channel-breakouts",
      "nt-2012-01-04-the-opening-fbo",
      "nt-2012-01-30-opening-range-1rev-vs-1pb-vs-fbo",
      "nt-2012-05-02-alternative-instruments-i-micro-contracts",
      "nt-2012-05-03-alternative-instruments-ii-thin-volume-contracts"
    ],
    tags: ["G2", "BP", "1CBO", "WFBO", "other setups"]
  },
  {
    id: "references",
    title: "References",
    authorEvidence: "Static reference pages and announcements.",
    postIds: [
      "nt-2013-03-10-late-12-2010-and-01-2011-posts-restored",
      "nt-2013-03-22-alternative-rss-reader",
      "nt-2017-06-10-nine-transitions-the-book"
    ],
    tags: ["reference", "announcement"]
  },
  {
    id: "vocabulary",
    title: "Vocabulary",
    authorEvidence: "Trading vocabulary with search. Auto-parsed from vocabulary.md.",
    postIds: [
      "nt-page-glossary"
    ],
    resources: [
      {
        id: "resource-vocabulary",
        title: "Personal Vocabulary Notes",
        kind: "markdown",
        markdownUrl: "/vocabulary.md",
        label: "Study"
      }
    ],
    tags: ["vocabulary", "terms", "study"]
  },
  {
    id: "crypto",
    title: "Crypto Trading",
    authorEvidence: "Author's experience with cryptocurrency trading.",
    postIds: [
      "nt-2018-04-09-trading-crypto"
    ],
    tags: ["crypto", "bitcoin", "cryptocurrency"]
  },
  {
    id: "daily-analysis",
    title: "Daily Analysis (289 posts)",
    authorEvidence: "Author's detailed daily market analysis and review, best practical material for learning price action. Chronological order from Dec 2010 to Apr 2018.",
    postIds: [
      "nt-2010-12-09-a-hard-wedge-reversal",
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
      "nt-2012-03-05-the-first-bar-trend-bar",
      "nt-2012-03-06-3-small-pushes-channels-micro-wedges-and-wedges",
      "nt-2012-03-08-preferring-deep-pullbacks",
      "nt-2012-03-12-kryptonite-days",
      "nt-2012-03-13-trading-fomc",
      "nt-2012-03-15-the-ideal-first-reversal",
      "nt-2012-03-16-first-bar-doji-tight-days",
      "nt-2012-03-19-simple-1pb",
      "nt-2012-03-22-the-first-opposing-trend-bar-in-a-channel",
      "nt-2012-03-26-signs-of-an-extremely-strong-trend",
      "nt-2012-03-27-trading-on-tilt-and-prevention",
      "nt-2012-03-29-two-swing-trades-a-day",
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
      "nt-2012-09-22-the-road-ahead",
      "nt-2012-09-27-components-of-a-successful-trade",
      "nt-2012-10-20-predicting-longer-term-moves",
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
      "nt-2015-09-29-the-shallowest-trendline-from-the-prior-day"
    ],
    tags: ["daily analysis", "case study"]
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

function buildStageEntries(stage: StudyStage, postById: Map<string, BlogPost>) {
  const postEntries: StageEntry[] = stage.postIds
    .map((id) => postById.get(id))
    .filter((post): post is BlogPost => Boolean(post))
    .map((post) => ({
      id: post.id,
      title: post.title,
      label: post.published.slice(0, 10),
      kind: "post" as const,
      post
    }));

  const resourceEntries: StageEntry[] = (stage.resources ?? []).map((resource) => ({
    id: resource.id,
    title: resource.title,
    label: resource.label ?? "Resource",
    kind: "resource" as const,
    resource
  }));

  return [...postEntries, ...resourceEntries];
}

export function App() {
  const [manifest, setManifest] = useState<BlogManifest | null>(null);
  const [activeStageId, setActiveStageId] = useState(studyPath[0].id);
  const [activeItemId, setActiveItemId] = useState("");
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [zoomImage, setZoomImage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stagePanelCollapsed, setStagePanelCollapsed] = useState(false);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [tagFilters, setTagFilters] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(`${archiveBase}/manifest.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`manifest load failed: ${response.status}`);
        return response.json() as Promise<BlogManifest>;
      })
      .then((data) => {
        setManifest(data);
        const postById = new Map(data.posts.map((post) => [post.id, post]));
        const firstPathEntry = studyPath
          .flatMap((stage) => buildStageEntries(stage, postById))
          .find(Boolean);
        setActiveItemId(firstPathEntry?.id ?? data.posts[0]?.id ?? "");
      })
      .catch((error: Error) => setLoadError(error.message));
  }, []);

  const posts = manifest?.posts ?? [];
  const postById = useMemo(() => new Map(posts.map((post) => [post.id, post])), [posts]);
  const resourceById = useMemo(
    () => new Map(studyPath.flatMap((stage) => (stage.resources ?? []).map((resource) => [resource.id, resource] as const))),
    []
  );
  const activeStage = studyPath.find((stage) => stage.id === activeStageId) ?? studyPath[0];
  const stageEntries = useMemo(() => buildStageEntries(activeStage, postById), [activeStage, postById]);
  const activePost = postById.get(activeItemId) ?? null;
  const activeResource = resourceById.get(activeItemId) ?? null;
  const activeEntry = stageEntries.find((entry) => entry.id === activeItemId)
    ?? (activePost
      ? {
          id: activePost.id,
          title: activePost.title,
          label: activePost.published.slice(0, 10),
          kind: "post" as const,
          post: activePost
        }
      : activeResource
        ? {
            id: activeResource.id,
            title: activeResource.title,
            label: activeResource.label ?? "Resource",
            kind: "resource" as const,
            resource: activeResource
          }
        : null)
    ?? stageEntries[0]
    ?? null;

  const filteredPosts = useMemo(() => {
    const value = query.trim().toLowerCase();
    const hasFilters = Object.values(tagFilters).some(v => v.length > 0);

    return posts.filter((post) => {
      if (value) {
        const haystack = [
          post.title,
          post.published,
          post.excerpt,
          post.searchText,
          ...(post.setupCandidates ?? []),
          ...(post.labels ?? []),
          ...flattenNormalizedTags(post.normalizedTags)
        ].join(" ").toLowerCase();
        if (!haystack.includes(value)) return false;
      }

      if (hasFilters) {
        const tags = post.normalizedTags;
        if (!tags) return false;

        for (const [dim, filterVals] of Object.entries(tagFilters)) {
          if (!filterVals.length) continue;
          const postVal = tags[dim as keyof NormalizedTags];
          if (Array.isArray(postVal)) {
            if (!filterVals.some((fv) => postVal.includes(fv))) return false;
          } else {
            if (!filterVals.includes(postVal)) return false;
          }
        }
      }

      return true;
    });
  }, [posts, query, tagFilters]);

  function openEntry(entryId: string) {
    setActiveItemId(entryId);
  }

  function toggleFilter(dim: string, value: string) {
    setTagFilters((prev) => {
      const current = prev[dim] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [dim]: next };
    });
  }

  function clearFilters() {
    setTagFilters({});
  }

  const activeFilterEntries = useMemo(() => {
    const entries: { dim: string; label: string; value: string }[] = [];
    for (const [dim, vals] of Object.entries(tagFilters)) {
      const dimCfg = TAG_DIMENSIONS.find((d) => d.key === dim);
      for (const v of vals) {
        entries.push({ dim, label: dimCfg?.label ?? dim, value: v });
      }
    }
    return entries;
  }, [tagFilters]);

  if (loadError) return <main className="app-error">Failed to load blog archive: {loadError}</main>;
  if (!manifest || !activeEntry) return <main className="app-loading">Loading Nine Transitions archive...</main>;

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
            <strong>Nine Transition</strong>
            <small>{manifest.postCount} posts · {manifest.imageCount} images</small>
          </div>
          <button
            className="collapse-btn"
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title="Collapse sidebar"
          >
            «
          </button>
        </div>

        <nav className="stage-nav" aria-label="Learning Path">
          {studyPath.map((stage, index) => (
            <button
              key={stage.id}
              className={stage.id === activeStage.id ? "active" : ""}
              type="button"
              onClick={() => {
                setActiveStageId(stage.id);
                const first = buildStageEntries(stage, postById)[0];
                if (first) openEntry(first.id);
              }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>{" "}
              {stage.title}
            </button>
          ))}
        </nav>
      </aside>

      {sidebarCollapsed && (
        <button
          className="float-expand-btn sidebar-expand"
          type="button"
          onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
        >
          »
        </button>
      )}

      <main className="reader-main">
        <section className="workspace">
          <aside className="stage-panel">
            <div className="panel-title">
              <h2>{activeStage.title.split("：")[1] || activeStage.title}</h2>
              <span>{stageEntries.length}</span>
              <button
                className="collapse-btn"
                type="button"
                onClick={() => setStagePanelCollapsed(!stagePanelCollapsed)}
                title="Collapse stage posts"
              >
                «
              </button>
            </div>
            <div className="post-list">
              {stageEntries.map((entry) => (
                <button
                  key={entry.id}
                  className={entry.id === activeEntry.id ? "active" : ""}
                  type="button"
                  onClick={() => openEntry(entry.id)}
                >
                  <span>{entry.label}</span>
                  <strong>{entry.title}</strong>
                </button>
              ))}
            </div>
          </aside>

          {stagePanelCollapsed && (
            <button
              className="float-expand-btn stage-expand"
              type="button"
              onClick={() => setStagePanelCollapsed(false)}
              title="Expand stage posts"
            >
              »
            </button>
          )}

          <article className="reader-panel">
            {activeEntry.kind === "post" && (
              <header className="reader-header">
                <span>{activeEntry.post.published.slice(0, 10)}</span>
                <a href={activeEntry.post.url} target="_blank" rel="noreferrer">Original Post</a>
                <a href={publicUrl(activeEntry.post.textPath)} target="_blank" rel="noreferrer">TXT</a>
              </header>
            )}
            {activeEntry.kind === "resource" ? (
              <VocabularyViewer markdownUrl={activeEntry.resource.markdownUrl} />
            ) : (
              <OriginalPost post={activeEntry.post} onZoomImage={setZoomImage} />
            )}
          </article>

          <aside className="library-panel">
            <div className="panel-title">
              <h2>Library</h2>
              <span>{filteredPosts.length}</span>
              <button
                className={`filter-toggle-btn${showFilters ? " active" : ""}`}
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                title="Toggle filters"
              >
                Filter
              </button>
              <button
                className="collapse-btn"
                type="button"
                onClick={() => setLibraryCollapsed(!libraryCollapsed)}
                title="Collapse library"
              >
                »
              </button>
            </div>
            <label className="global-search">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search posts..."
              />
            </label>

            {showFilters && (
              <div className="filter-panel">
                {TAG_DIMENSIONS.map((dim) => (
                  <div className="filter-dimension" key={dim.key}>
                    <span className="filter-dim-label">{dim.label}</span>
                    <div className="filter-dim-options">
                      {dim.values.map((val) => {
                        const active = (tagFilters[dim.key] ?? []).includes(val);
                        return (
                          <button
                            key={val}
                            className={`filter-chip${active ? " active" : ""}`}
                            type="button"
                            onClick={() => toggleFilter(dim.key, val)}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {activeFilterEntries.length > 0 && (
                  <button className="filter-clear-btn" type="button" onClick={clearFilters}>
                    Clear all
                  </button>
                )}
              </div>
            )}

            {activeFilterEntries.length > 0 && (
              <div className="active-filters">
                {activeFilterEntries.map(({ dim, label, value }) => (
                  <button
                    key={`${dim}-${value}`}
                    className="active-filter-chip"
                    type="button"
                    onClick={() => toggleFilter(dim, value)}
                    title={`Remove ${value} filter`}
                  >
                    {value} ×
                  </button>
                ))}
              </div>
            )}

            <div className="post-list">
              {filteredPosts.slice(0, 300).map((post) => (
                <button
                  key={post.id}
                  className={post.id === activeEntry.id ? "active" : ""}
                  type="button"
                  onClick={() => openEntry(post.id)}
                >
                  <span>{post.published.slice(0, 10)}</span>
                  <strong>{post.title}</strong>
                  {post.normalizedTags && (
                    <span className="post-tags">
                      {post.normalizedTags.content_type}
                      {post.normalizedTags.level !== "intermediate" && ` · ${post.normalizedTags.level}`}
                      {post.normalizedTags.setup.length > 0 && post.normalizedTags.setup[0] !== "general" && ` · ${post.normalizedTags.setup.join(",")}`}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {libraryCollapsed && (
            <button
              className="float-expand-btn library-expand"
              type="button"
              onClick={() => setLibraryCollapsed(false)}
              title="Expand library"
            >
              «
            </button>
          )}
        </section>
      </main>

      {zoomImage && (
        <button className="image-lightbox" type="button" onClick={() => setZoomImage("")} aria-label="Close image zoom">
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

type VocabEntry = {
  word: string;
  type: string;
  meaning: string;
  context: string;
  isCore?: boolean;
};

function parseVocabularyMarkdown(markdown: string): { sections: { title: string; entries: VocabEntry[] }[] } {
  const lines = markdown.split("\n");
  const sections: { title: string; entries: VocabEntry[] }[] = [];
  let currentSection: { title: string; entries: VocabEntry[] } | null = null;
  let currentEntry: Partial<VocabEntry> | null = null;
  let contextBuffer: string[] = [];

  function flushEntry() {
    if (currentEntry && currentSection) {
      currentSection.entries.push({
        word: currentEntry.word || "",
        type: currentEntry.type || "TERM",
        meaning: currentEntry.meaning || "",
        context: contextBuffer.join(" ").trim(),
        isCore: currentEntry.isCore
      });
    }
    currentEntry = null;
    contextBuffer = [];
  }

  function flushSection() {
    if (currentSection) {
      flushEntry();
      if (currentSection.entries.length > 0) {
        sections.push(currentSection);
      }
    }
    currentSection = null;
  }

  // Default section if no header found
  let hasHeader = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
      hasHeader = true;
      flushSection();
      const title = trimmed.replace(/^#+\s*/, "");
      currentSection = { title, entries: [] };
      continue;
    }

    if (!trimmed || trimmed.startsWith("---")) continue;

    // Skip header row
    if (trimmed.startsWith("|") && (trimmed.includes("单词/短语") || trimmed.includes("Word/Phrase"))) {
      // If no section yet, create default one
      if (!currentSection) {
        currentSection = { title: "Vocabulary", entries: [] };
      }
      continue;
    }

    if (trimmed.startsWith("|") && !trimmed.startsWith("|---")) {
      // If no section yet, create default one
      if (!currentSection) {
        currentSection = { title: "Vocabulary", entries: [] };
      }

      const cells = trimmed.split("|").filter(c => c.trim()).map(c => c.trim());

      if (cells.length >= 3) {
        flushEntry();
        const word = cells[0];
        const meaning = cells[1];
        const context = cells[2] || "";

        const isCore = ["A2", "W1P", "DP", "fBO", "W", "1CBO"].some(t => word.includes(t));

        let type = "TERM";
        if (word.includes("SIM") || word.includes("beginner")) type = "CONCEPT";
        else if (meaning.includes("交易") && !meaning.includes("术语")) type = "SETUP";
        else if (meaning.includes("心态") || meaning.includes("心理")) type = "PSYCH";

        currentEntry = { word, meaning, type, isCore };
        contextBuffer = [context];
      }
    } else if (currentEntry && trimmed) {
      contextBuffer.push(trimmed);
    }
  }

  flushSection();
  return { sections };
}

function VocabularyViewer({ markdownUrl }: { markdownUrl: string }) {
  const [data, setData] = useState<{ sections: { title: string; entries: VocabEntry[] }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(markdownUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        return res.text();
      })
      .then(text => {
        const parsed = parseVocabularyMarkdown(text);
        setData(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [markdownUrl]);

  const filteredData = useMemo(() => {
    if (!data || !searchQuery.trim()) return data;
    
    const q = searchQuery.toLowerCase().trim();
    const filtered = data.sections.map(section => ({
      ...section,
      entries: section.entries.filter(entry =>
        entry.word.toLowerCase().includes(q) ||
        entry.meaning.toLowerCase().includes(q) ||
        entry.context.toLowerCase().includes(q) ||
        entry.type.toLowerCase().includes(q)
      )
    })).filter(section => section.entries.length > 0);
    
    return { sections: filtered };
  }, [data, searchQuery]);

  if (loading) return <div className="vocab-loading">Loading vocabulary...</div>;
  if (error) return <div className="vocab-error">Error: {error}</div>;
  if (!data) return null;

  const totalEntries = data.sections.reduce((sum, s) => sum + s.entries.length, 0);
  const coreCount = data.sections.reduce((sum, s) => sum + s.entries.filter(e => e.isCore).length, 0);
  const filteredCount = filteredData?.sections.reduce((sum, s) => sum + s.entries.length, 0) ?? totalEntries;

  return (
    <div className="vocabulary-viewer">
      <div className="vocab-header">
        <h1>Trading Vocabulary</h1>
        <div className="vocab-stats">
          <span className="stat-item"><span className="number">{totalEntries}</span> terms</span>
          <span className="stat-item"><span className="number">{coreCount}</span> core</span>
        </div>
        <div className="vocab-search">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          {searchQuery && (
            <span className="search-count">{filteredCount}/{totalEntries}</span>
          )}
        </div>
      </div>

      {filteredData && filteredData.sections.length === 0 && (
        <div className="vocab-no-results">
          No results for "{searchQuery}"
        </div>
      )}

      {filteredData?.sections.map((section, sIdx) => (
        <div key={sIdx} className="vocab-section">
          {section.title !== "Vocabulary" && <h2 className="section-title">{section.title}</h2>}
          <div className="vocab-grid">
            {section.entries.map((entry, eIdx) => (
              <div key={eIdx} className={`vocab-card ${entry.isCore ? "core-setup" : ""}`}>
                <div className="vocab-term">
                  <span className="vocab-word">{entry.word}</span>
                  <span className="vocab-type">{entry.type}</span>
                  {entry.isCore && <span className="core-badge">CORE</span>}
                </div>
                <div className="vocab-meaning">{entry.meaning}</div>
                {entry.context && (
                  <div className="vocab-context">
                    {entry.context}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )      )}
    </div>
  );
}
