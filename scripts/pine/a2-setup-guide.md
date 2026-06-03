# A2 TradingView Helper

This guide explains how to use `scripts/pine/a2-setup-pro.pine` as a learning aid for A2 price-action reading.

The script is not an automated trading system. Its purpose is to mark likely A2 candidates so you can pause, inspect the chart, and train your eye.

It also plots the 20 EMA and optional session bar count labels, so it can replace separate EMA and bar-count indicators on TradingView free plans.

## What A2 Means

A2 is a trend-continuation setup:

1. A trend exists or has recently broken out.
2. Price pulls back in two legs toward the 20 EMA.
3. The first attempt to resume the trend fails.
4. The second attempt creates a signal bar near the EMA.
5. The next bar breaks beyond the signal bar and triggers the setup.

For a long A2, price is in an uptrend and pulls back down toward the EMA. The trigger is a break above the prior signal bar.

For a short A2, also labeled `M2S`, price is in a downtrend and pulls back up toward the EMA. The trigger is a break below the prior signal bar.

## Labels

`A2`: A cleaner long A2 candidate. Review the trend, two-leg pullback, EMA location, signal bar, and room to prior high.

`M2S`: A cleaner short A2 candidate. Review the trend, two-leg pullback, EMA location, signal bar, and room to prior low.

`bwA2`: A2-like structure inside a barb-wire or tight overlapping area. Beginners should usually treat this as a warning label, not an entry label.

`bwM2S`: Short-side version of `bwA2`.

`fA2`: Failed A2. The setup triggered, then price reversed through the signal bar stop before timing out or reaching the target area. Use this to study how failed continuation setups can reveal market information.

## Built-In EMA And Bar Count

The script plots the 20 EMA by default.

It also includes a session bar count:

```pine
showBarCount = true
barCountSession = "0000-2359"
barCountEvery = 5
barCountShowFirst = true
barCountMax = 120
barCountOffsetAtr = 0.25
```

`barCountSession` controls when counting starts and stops. The default counts the full chart day. If you only want regular trading hours, change it to your market session, for example `0930-1600`.

`barCountEvery` controls label density. `5` means show b5, b10, b15, and so on. Set it to `1` if you want every bar numbered, but the chart will get crowded quickly.

If you want every bar numbered, set `Show every Nth bar number` to `1`.

If the chart gets crowded, keep the default `5`; it shows `b1`, `b5`, `b10`, and so on.

If you only want regular trading hours, change `Bar count session` to your market session, for example `0930-1600`.

`barCountShowFirst` keeps `b1` visible even when `barCountEvery` is larger than 1.

`barCountMax` stops numbering after that many bars in one session.

`barCountOffsetAtr` moves labels above the bar. Increase it if labels overlap candles.

## Default Learning Parameters

The main learning defaults are intentionally moderate:

```pine
nearBelowAtr = 0.80
minPullbackAtr = 0.35
bwRangeAtr = 1.50
```

These are not magic values from the author. The author defines A2 by price-action structure, not fixed ATR numbers. The parameters convert the idea into a useful chart scan.

## Parameter Guide

### `nearBelowAtr`

Default: `0.80`

Controls how far price may poke beyond the 20 EMA and still count as near the average.

For long A2, the pullback low may go below the EMA by up to `nearBelowAtr * ATR`.

For short A2, the pullback high may go above the EMA by up to `nearBelowAtr * ATR`.

Raise it when:

- You want to catch deeper pullbacks.
- Your market commonly overshoots the EMA before reversing.
- You are using the script as a broad candidate scanner.

Lower it when:

- You only want cleaner, tighter A2s.
- The script marks too many deep pullbacks that already look like trend breaks.
- You are practicing strict classic A2 recognition.

Suggested strict value: `0.60`

### `minPullbackAtr`

Default: `0.35`

Controls the minimum pullback depth. This prevents tiny pauses near the EMA from being marked as A2.

For long A2, the distance from the prior swing high to the pullback low must be at least `minPullbackAtr * ATR`.

For short A2, the distance from the prior swing low to the pullback high must be at least `minPullbackAtr * ATR`.

Raise it when:

- The script marks too many shallow wiggles.
- You want only obvious two-leg pullbacks.
- You are practicing high-quality A2s with better reward-to-risk.

Lower it when:

- You study hard trends or soft trends where pullbacks are naturally shallow.
- You want more candidates for review.

Suggested strict value: `0.50`

### `bwRangeAtr`

Default: `1.50`

Controls barb-wire detection. The script labels a zone as barb wire when recent bars are compressed and include multiple dojis.

Lower it when:

- You want stricter warnings for tight overlap.
- You are a beginner and want fewer trades in chop.
- The chart often produces small overlapping bars that trap entries.

Raise it when:

- The script marks too many normal slow-trend pullbacks as barb wire.
- You trade a volatile instrument where normal pullbacks occupy more ATR.

Suggested strict value: `1.25`

## Recommended Presets

### Learning Mode

Use this while building pattern recognition. It shows more candidates and lets you practice saying yes or no.

```pine
nearBelowAtr = 0.80
minPullbackAtr = 0.35
bwRangeAtr = 1.50
```

### Strict Classic A2 Mode

Use this when you want fewer, cleaner examples.

```pine
nearBelowAtr = 0.60
minPullbackAtr = 0.50
bwRangeAtr = 1.25
```

### Broad Review Mode

Use this when replaying charts and collecting examples. Expect more false positives.

```pine
nearBelowAtr = 1.00
minPullbackAtr = 0.25
bwRangeAtr = 1.75
```

## How To Study With The Script

When an `A2` or `M2S` label appears, ask five questions:

1. Is there a real trend, or is price just drifting around the EMA?
2. Can you see two legs in the pullback?
3. Did the pullback reach or overlap the 20 EMA area?
4. Is the signal bar good enough: correct direction, decent body, not too large, not too small?
5. Is there enough room to test the prior swing high or low?

If the answer is unclear, mark the chart and review it later. The goal is to improve your read, not to obey the label.

## Known Limits

The script cannot fully judge trendlines, trend-channel overshoots, trend termination, failed breakouts, W1P, DP, or broader market type. Those remain human price-action reading tasks.

Use the labels as a spotlight, not as a verdict.
