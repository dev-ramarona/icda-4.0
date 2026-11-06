export function LibChartDomain(values: number[], zero?: number) {
  const valid = values.filter((v) => Number.isFinite(v));
  if (valid.length === 0) return [0, 10];
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  if (min === max) {
    const padding = Math.abs(max) * 0.05 || 1;
    return [Math.round(min - padding), max];
  }
  const padding = (max - min) * 0.5;
  return [zero ?? Math.round(min - padding), max];
}
