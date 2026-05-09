# A2 Coach Autoplan

## Premises

- `docs/ninetrans_book.pdf` is the source of truth for the trading method.
- The app is a learning and deliberate-practice system for E-mini price action, not a signal service, broker tool, or automated trading system.
- Phase 1 focuses on A2 mastery, market-structure filters, signal-bar quality, discipline rules, glossary recall, and scenario quizzes.
- The product should run as a static browser app with local progress only.

## Decision Audit Trail

| # | Phase | Decision | Principle | Rationale | Rejected |
|---|-------|----------|-----------|-----------|----------|
| 1 | CEO | Build an actual training workspace instead of a marketing site | Choose completeness | The user wants operational learning that transfers to chart reading | Landing page |
| 2 | Design | Use dense dark app UI with chart-first examples | Explicit over clever | Trading learners need scanning, contrast, and repeated practice | Hero/card-heavy SaaS layout |
| 3 | Eng | Use React + TypeScript + Vite static SPA | Pragmatic | Matches the spec and keeps deployment simple | Backend or database |
| 4 | Eng | Store learning progress in localStorage | Boil lakes | Covers progress, quiz history, checklist state with no infrastructure | No persistence |
| 5 | Eng | Include PDF-derived quotes in structured content | Choose completeness | Keeps the app anchored to the book rather than generic trading advice | Freeform paraphrase only |

## Architecture

```text
docs/*.md + PDF excerpts
        |
        v
src/data/content.ts
        |
        +--> App navigation and learning modules
        +--> Quiz engine
        +--> Glossary search
        +--> SVG chart drills
        |
        v
localStorage progress
```

## Test Plan

- Build must type-check with `tsc` and bundle with Vite.
- Manual checks: navigate all modules, mark sections complete, toggle Rule of 10, answer quiz questions, filter glossary terms, inspect responsive layout.
- Edge cases: empty search results, quiz answer reveal before/after, localStorage unavailable fallback, long bilingual quote wrapping.

## Not In Scope

- Real-time market data, broker integration, Telegram bot, trade execution, personalized financial advice, and PDF full-text reproduction.

## Review Scores

- CEO: clean, scope aligned with learning outcome.
- Design: 8/10 after choosing app-workspace layout and explicit interaction states.
- Eng: clean for static SPA; main risk is content coverage depth, not architecture.

## Redesign Note — 2026-05-09

The first implementation was too close to a summarized reading page. The redesign changes the product into a learning and examination system:

- Course units now require five parts: deep explanation, mastery goal, decision checklist, common traps, and source grounding.
- Chart cases are first-class data with OHLC bars, EMA values, annotations, verdicts, and step-by-step reading.
- Exams are split into concept, chart-case, and execution modes.
- Every answer includes why the correct answer is right and why the selected wrong answer fails.
- The app goal is no longer "browse concepts"; it is "learn a setup well enough to identify, reject, and execute it from a chart."

## A2 Mastery Scope

Phase 1 is not complete unless A2 covers the full trade lifecycle:

- Vocabulary: Leg1, L1, fL1, Leg2, L2/fL2, signal bar, entry, initial stop, target, first target, breakeven stop, fA2.
- Recognition: trend context, two-leg pullback, EMA/trendline location, signal bar quality, and automatic skip filters.
- Execution: Buy Stop / Sell Stop trigger, no-trigger handling, A22 handling, stop placement, and invalidation.
- Management: target 4 ticks or more, first target, half-size/balance handling, breakeven stop, swing portion, early exit when BW/OL or reversal risk appears.
- Failure: fA2, wait two swings or wait for price to move away, 2/5 daily stop rules, and when not to immediately reverse.

## A2 Coverage Revision

Five lessons are not enough for the user's target. They can introduce A2, but they do not cover the PDF's practical A2 branches well enough for a beginner to identify, execute, manage, and reject setups without rereading the book.

The revised Phase 1 scope expands A2 into ten trainable units:

- Signal bar qualification: strength, overlap, stop width, context, and BW/TTR rejection.
- A2 core recognition: Leg1, L1/fL1, Leg2, L2/fL2, near EMA/trendline, signal bar, entry and stop.
- Structure rejection: TTR/BW, trading range internals, and when to wait for breakout/BP.
- A2 quality filtering: clean/classic A2, pullback trendline break, Doji/overlap downgrade, soft-trend exception, far-from-EMA third-push risk.
- A22: second entry logic after weak first A2, large stop, overlap, or no-follow-through.
- Short A2 mirror: H1, fH1, H2/fH2, Sell Stop, short-side stop and targets.
- BP A2: post-breakout two-leg pullback, not range-internal A2, measured-move target logic.
- Trend termination: DT/DB, TTR, weak reversal followed by weak A2, fRev + fA2, exit/stay-out behavior.
- fA2 discipline: failed A2, wait two swings, no immediate revenge reversal, 2/5 rule.
- Lifecycle management: trigger/no-trigger, initial stop, target, first target, breakeven stop, swing portion, early exit.

Coverage map against PDF-derived A2 references:

| PDF Topic | App Coverage |
| --- | --- |
| A2 definition near EMA as second failed pullback reversal | `a2-core`, `case-clean-a2-long` |
| A22 second entry when first signal is weak/overlapped/large stop | `a22-second-entry`, `case-a22-second-entry` |
| Classic A2 and pullback trendline break | `a2-quality-filter`, `case-classic-a2-trendline-break` |
| Doji/overlap A2 downgrade and soft-trend caveat | `signal-bar`, `a2-quality-filter`, `case-doji-overlap` |
| Far-from-EMA A2 may become third push / W pullback | `a2-quality-filter`, `case-far-from-ema` |
| New traders should focus on A2 first | Dashboard metrics, `a2-core`, glossary |
| Normal trend A2 vs hard-trend H1/L1 scarcity | `a2-core`, `case-one-leg-not-a2`, glossary |
| Trading range/BW internals should be skipped | `ttr-bw`, `case-bw-trap` |
| Breakout pullback A2 and measured move target | `bp-a2`, `case-breakout-pullback` |
| Short-side mirror using H1/fH1/H2 | `a2-short-mirror`, `case-clean-a2-short` |
| Trend termination: DT/DB, TTR, weak reversal + weak A2 | `a2-trend-termination`, `case-trend-termination-weak-a2` |
| fA2 and waiting after failure | `fa2-discipline`, `case-fa2` |
| Entry/stop/target/breakeven stop/swing management | `a2-management`, `case-a2-trade-management` |

## Full A2 Readiness Addendum

The latest revision closes the remaining A2 gaps required for "learn the PDF A2 content, start with SIM, eventually prepare for live trading":

- Opening strategy: opening and gap topics are complex; conservative traders may wait for the first two-legged pullback.
- fA2 reversal boundary: failed A2 can imply two more legs in the new direction, but failed trades should not be reversed unless the setup is reversible; otherwise wait two swings or wait for price to move away.
- Trend mode filter: normal trend is the A2 training target; hard trend H1/L1 and soft trend overlapping fL2 are taught as exceptions to recognize, not as early live-trading permissions.
- Tick-level execution: Coach uses the PDF's relative tick language (`+1t`, `-1t`, `4 ticks or more`, `-1.5/+2 points`) rather than adding external contract-spec conversions.
- SIM and live-readiness gates: the app now includes pre-trade 10-question checklist, SIM gates, and Rule of 10 milestones without introducing a market outside the PDF.

The practical standard is:

1. Complete all A2 lessons.
2. Use exams only to check understanding; they do not replace SIM or Rule of 10.
3. Mark urgency-to-enter signals on the chart and review them at end of day, as the PDF recommends.
4. Trade only A2 in SIM with 2/5 discipline, no-chase behavior, and wait-two-swings after losses.
5. Satisfy Rule of 10 before considering live trading, while staying within the PDF's E-mini market scope.
