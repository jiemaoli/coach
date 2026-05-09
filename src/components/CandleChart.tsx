import type { ChartCase } from "../data/content";

type CandleChartProps = {
  chartCase: ChartCase;
  compact?: boolean;
};

const toneColors = {
  good: "var(--green)",
  warn: "var(--amber)",
  bad: "var(--red)",
  info: "var(--blue)"
};

export function CandleChart({ chartCase, compact = false }: CandleChartProps) {
  const width = 760;
  const height = compact ? 340 : 420;
  const padding = { top: 58, right: 38, bottom: 72, left: 42 };
  const allPrices = [...chartCase.bars.flatMap((bar) => [bar.high, bar.low]), ...chartCase.ema];
  const minPrice = Math.min(...allPrices) - 4;
  const maxPrice = Math.max(...allPrices) + 4;
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const step = plotWidth / chartCase.bars.length;

  function xFor(index: number) {
    return padding.left + step * index + step / 2;
  }

  function yFor(price: number) {
    return padding.top + ((maxPrice - price) / (maxPrice - minPrice)) * plotHeight;
  }

  const emaPath = chartCase.ema
    .map((price, index) => `${index === 0 ? "M" : "L"} ${xFor(index).toFixed(1)} ${yFor(price).toFixed(1)}`)
    .join(" ");

  return (
    <svg className="candle-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chartCase.title}>
      <rect x="0" y="0" width={width} height={height} rx="6" className="chart-bg" />
      <rect x={padding.left} y="14" width={plotWidth} height="28" rx="4" className="chart-rail" />
      <text x={padding.left + 10} y="33" className="rail-label">{chartCase.setup}</text>
      <text x={width - padding.right - 160} y="33" className="rail-label">EMA(20) dashed line</text>
      {[0, 1, 2, 3, 4].map((line) => {
        const y = padding.top + (plotHeight / 4) * line;
        const price = maxPrice - ((maxPrice - minPrice) / 4) * line;
        return (
          <g key={line}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="grid-line" />
            <text x={8} y={y + 4} className="axis-label">{Math.round(price)}</text>
          </g>
        );
      })}
      <path d={emaPath} className="ema-line" />

      {chartCase.bars.map((bar, index) => {
        const x = xFor(index);
        const yOpen = yFor(bar.open);
        const yClose = yFor(bar.close);
        const yHigh = yFor(bar.high);
        const yLow = yFor(bar.low);
        const bullish = bar.close >= bar.open;
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(4, Math.abs(yClose - yOpen));
        return (
          <g key={`${chartCase.id}-${index}`}>
            <line x1={x} x2={x} y1={yHigh} y2={yLow} className={bullish ? "bull-stem" : "bear-stem"} />
            <rect
              x={x - Math.min(14, step * 0.28)}
              y={bodyTop}
              width={Math.min(28, step * 0.56)}
              height={bodyHeight}
              rx="2"
              className={bullish ? "bull-body" : "bear-body"}
            />
            {bar.signal && (
              <rect
                x={x - Math.min(19, step * 0.36)}
                y={yHigh - 8}
                width={Math.min(38, step * 0.72)}
                height={yLow - yHigh + 16}
                rx="4"
                className={`signal-frame ${chartCase.kind}`}
              />
            )}
          </g>
        );
      })}

      {chartCase.kind === "skip" && <rect x={padding.left + 10} y={padding.top + 62} width={plotWidth * 0.62} height={plotHeight * 0.5} className="zone-bad" />}
      {chartCase.kind === "valid" && chartCase.setup.includes("Breakout") && <line x1={padding.left} y1={yFor(112)} x2={width - padding.right} y2={yFor(112)} className="breakout-line" />}

      {chartCase.annotations.map((annotation) => {
        const x = xFor(annotation.barIndex);
        const plotBottom = height - padding.bottom;
        const markerTop = plotBottom + 8;
        const markerBottom = plotBottom + 14;
        const markerY = plotBottom + 26;
        return (
          <g key={`${annotation.barIndex}-${annotation.price}-${annotation.label}`}>
            <line x1={x} y1={markerTop} x2={x} y2={markerBottom} stroke={toneColors[annotation.tone]} strokeWidth="1.25" />
            <circle cx={x} cy={markerY} r="8" fill={toneColors[annotation.tone]} className="annotation-dot" />
            <text x={x} y={markerY + 4} textAnchor="middle" className="annotation-number">
              {annotation.label}
            </text>
          </g>
        );
      })}
      <rect x={padding.left} y={height - 32} width={plotWidth} height="18" rx="4" className="chart-rail" />
      {chartCase.bars.map((bar, index) => {
        const x = xFor(index);
        return bar.label ? (
          <text key={`${chartCase.id}-label-${index}`} x={x} y={height - 18} textAnchor="middle" className="bar-label">
            {bar.label}
          </text>
        ) : null;
      })}
    </svg>
  );
}
