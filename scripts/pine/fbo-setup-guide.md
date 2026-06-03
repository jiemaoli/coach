# fBO TradingView Helper

This guide explains how to use `scripts/pine/fbo-setup-pro.pine` as a learning aid for failed breakout setups.

The author describes fBO as one of the hardest setups. It is mainly a trading-range setup, not something to force inside a strong trend.

It also plots the 20 EMA and optional session bar count labels, so it can replace separate EMA and bar-count indicators on TradingView free plans.

## What fBO Means

For a short fBO:

1. Price is in a trading range.
2. Price breaks above the range.
3. The breakout fails and price closes back into the range.
4. A bearish signal bar triggers below its low.

For a long fBO:

1. Price is in a trading range.
2. Price breaks below the range.
3. The breakout fails and price closes back into the range.
4. A bullish signal bar triggers above its high.

## Labels

`fBO`: Failed breakout candidate.

`fBO2`: A second failed-breakout attempt. The author often prefers second attempts unless the first attempt has an excellent signal bar or extreme location.

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

If you want every bar numbered, set `Show every Nth bar number` to `1`.

If the chart gets crowded, keep the default `5`; it shows `b1`, `b5`, `b10`, and so on.

If you only want regular trading hours, change `Bar count session` to your market session, for example `0930-1600`.

Increase `Bar count label offset ATR` if labels overlap candles.

## Main Parameters

### `Trading range lookback`

Default: `20`

Controls how many prior bars define the range high and low.

### `Breakout beyond range ATR`

Default: `0.10`

Controls how far beyond the prior range price must go before it counts as a breakout.

### `Min range height ATR`

Default: `1.20`

Filters out ranges that are too small to be worth studying.

### `Max range height ATR`

Default: `4.00`

Filters out very wide action that may not be a simple range.

### `Bars allowed for breakout failure`

Default: `3`

Controls how quickly the breakout must fail. Shorter values catch immediate failures. Larger values allow slower failures but create more false positives.

## Study Checklist

When an `fBO` label appears, ask:

1. Was the market actually in a trading range?
2. Did the breakout occur at an obvious range edge or prior extreme?
3. Did price clearly fail back into the range?
4. Is this a first attempt or second attempt?
5. Is the signal bar good enough, or is it a doji/overlap in the middle of the range?

Beginners should use fBO labels mainly for review. A2 and W1P are usually better first study targets.
