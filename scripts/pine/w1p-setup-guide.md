# W1P TradingView Helper

This guide explains how to use `scripts/pine/w1p-setup-pro.pine` as a learning aid for W1P price-action reading.

The author describes W1P as the first pullback after a wedge reversal. It is usually easier to read than the wedge entry itself because the market has already shown reversal strength.

It also plots the 20 EMA and optional session bar count labels, so it can replace separate EMA and bar-count indicators on TradingView free plans.

## What W1P Means

W1P = Wedge + first pullback.

For a bullish W1P:

1. Price makes three pushes down.
2. The third push shows possible exhaustion or overshoot.
3. A bullish reversal appears.
4. Price pulls back for the first time after that reversal.
5. A bullish signal bar triggers above its high.

For a bearish W1P, reverse the logic: three pushes up, bearish reversal, first pullback, then a break below the signal bar.

## Labels

`W1P`: A cleaner W1P candidate.

`bwW1P`: W1P-like structure inside tight overlap or barb wire. Treat it as a warning label.

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

## Important Limits

This script approximates wedge behavior with three pivot pushes. It cannot truly draw and judge trend channel line overshoots the way a human reader can.

Use it as a spotlight, not as a verdict.

## Main Parameters

### `Pivot strength`

Default: `2`

Controls how many bars are required on each side of a swing point. Higher values find cleaner swings but delay and reduce signals.

### `Min wedge move in ATR`

Default: `1.20`

Requires the three-push wedge move to cover a meaningful distance. Raise it to filter weak, tiny three-push patterns.

### `Min third-push overshoot ATR`

Default: `0.10`

Requires the third push to go beyond the second push by at least this ATR amount. Raise it when too many weak wedges are marked.

### `Min first pullback depth ATR`

Default: `0.25`

The first pullback after reversal must be deep enough to matter. Raise it for cleaner W1Ps.

### `Max first pullback depth ATR`

Default: `1.80`

Prevents very deep pullbacks from being treated as simple first pullbacks. Lower it if the script marks pullbacks that look like the reversal has failed.

## Suggested Presets

Learning mode:

```pine
Pivot strength = 2
Min wedge move in ATR = 1.20
Min third-push overshoot ATR = 0.10
Min first pullback depth ATR = 0.25
Max first pullback depth ATR = 1.80
```

Strict mode:

```pine
Pivot strength = 3
Min wedge move in ATR = 1.80
Min third-push overshoot ATR = 0.20
Min first pullback depth ATR = 0.35
Max first pullback depth ATR = 1.40
```

## Study Checklist

When a `W1P` label appears, ask:

1. Can I see three pushes into the wedge?
2. Did the third push show exhaustion or an overshoot?
3. Was the reversal bar meaningful?
4. Is this truly the first pullback after reversal?
5. Does the entry have room to test the start of the wedge move?
