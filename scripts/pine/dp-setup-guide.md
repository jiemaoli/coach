# DP TradingView Helper

This guide explains how to use `scripts/pine/dp-setup-pro.pine` as a learning aid for double top and double bottom pullback setups.

The author treats double tops and double bottoms as important trend terminators. A DP is the pullback after a double top or double bottom, often acting like a failed breakout and potentially reaching the other side of the range.

It also plots the 20 EMA and optional session bar count labels, so it can replace separate EMA and bar-count indicators on TradingView free plans.

## What DP Means

For a bullish DP:

1. Price forms a double bottom.
2. Price bounces from the double bottom.
3. A small pullback forms without fully breaking the double bottom.
4. A bullish signal bar triggers.

For a bearish DP:

1. Price forms a double top.
2. Price rejects from the double top.
3. A small pullback forms without fully breaking the double top.
4. A bearish signal bar triggers.

## Labels

`DP` below a bar: double-bottom pullback long candidate.

`DP` above a bar: double-top pullback short candidate.

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

### `Double top/bottom tolerance ATR`

Default: `0.25`

Controls how close two swing points must be to count as a double top or double bottom.

Raise it to catch looser double points. Lower it for cleaner, tighter doubles.

### `Min pullback depth ATR`

Default: `0.15`

Requires the pullback after the double point to be visible.

### `Max pullback depth ATR`

Default: `1.20`

Prevents deep moves from being treated as a simple DP.

### `Max bars between double points`

Default: `50`

Controls how far apart the two tops or bottoms may be.

## Study Checklist

When a `DP` label appears, ask:

1. Is the double top/bottom obvious to the eye?
2. Is it at a meaningful location: range edge, support/resistance, prior extreme, trendline, or EMA area?
3. Did price fail to break through the double point?
4. Is the pullback small enough to still count as a DP?
5. Is there room to move toward the other side of the range?
