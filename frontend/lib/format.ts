export function LibFormatNumberToDate(date: number) {
  const str = String(date);
  return `20${str.slice(0, 2)}-${str.slice(2, 4)}-${str.slice(4, 6)}`;
}

export function LibFormatNumber(
  value: number | string,
  digit: number = 2,
): string {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0";
  const abs = Math.abs(number);
  const sign = number < 0 ? "-" : "";
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(digit)}B`;
  } else if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(digit)}M`;
  }
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(number);
}

export function LibFormatPercent(
  value: number | string,
  digit: number = 2,
): string {
  const number = Number(value);
  if (!Number.isFinite(number)) return "0%";
  return `${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  }).format(number)}%`;
}

// export function LibFormatRphcph(rph: number, rph: number): string {
//   const number = Number(value);
//   if (!Number.isFinite(number)) return "0";
//   return new Intl.NumberFormat("id-ID", {
//     maximumFractionDigits: 0,
//   }).format(number);
// }
