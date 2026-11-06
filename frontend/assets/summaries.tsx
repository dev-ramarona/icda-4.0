import {
  ChevronsDown,
  ChevronsLeftRight,
  ChevronsUp,
  LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export default function AssetSummaries({
  title,
  amount,
  icon,
  previous,
  label,
  day,
  formatValue = (v: number) => new Intl.NumberFormat("id-ID").format(v),
  className = "",
}: {
  title: string;
  amount: number | string;
  icon: ReactNode;
  previous: number | string;
  label?: string;
  day?: number;
  formatValue?: (value: number) => string;
  className?: string;
}) {
  const amountText = typeof amount === "number" ? formatValue(amount) : amount;
  const previousText =
    typeof previous === "number" ? formatValue(previous) : previous;

  // Persentase perubahan hanya dihitung kalau keduanya number
  let percent: string | null = null;
  if (
    typeof amount === "number" &&
    typeof previous === "number" &&
    previous !== 0
  )
    percent = `${Math.abs(((amount - previous) / previous) * 100).toFixed(1)}%`;
  const trendNow =
    amount > previous ? "up" : amount < previous ? "down" : "flat";

  const trendStyle: Record<
    "up" | "down" | "flat",
    { className: string; label: string; icon: LucideIcon }
  > = {
    up: {
      className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
      icon: ChevronsUp,
      label: label ?? `Higher than Prev AVG ${day ?? 30} Day`,
    },
    down: {
      className: "bg-rose-50 text-rose-700 ring-rose-600/20",
      icon: ChevronsDown,
      label: label ?? `Lower than Prev AVG ${day ?? 30} Day`,
    },
    flat: {
      className: "bg-slate-50 text-slate-700 ring-slate-600/20",
      icon: ChevronsLeftRight,
      label: label ?? "Last action is",
    },
  };
  const trendStyleNow = trendStyle[trendNow];
  return (
    <div
      className={`relative flex h-full min-w-0 flex-col rounded-xl p-1 ${className}`}
    >
      <div
        className="absolute right-0 z-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-200 text-sky-800 opacity-0 ring ring-white sm:opacity-100 [&>svg]:h-5 [&>svg]:w-5"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="z-10 flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-sm leading-5 font-semibold wrap-break-word text-slate-500">
          <span className="rounded-full bg-slate-100/30 pr-1 backdrop-blur-sm">
            {title}
          </span>
        </h3>
      </div>

      <div
        className="z-10 mt-2 min-w-0"
        style={{ containerType: "inline-size" }}
      >
        <p
          className="leading-tight font-semibold tracking-tight text-slate-900 tabular-nums"
          style={{
            fontSize: "clamp(1rem, 9cqw, 1.875rem)",
            overflowWrap: "anywhere",
          }}
          title={amountText}
        >
          <span className="rounded-full bg-slate-100/30 pr-1 backdrop-blur-sm">
            {amountText}
          </span>
        </p>
      </div>

      {/* Footer: selalu nempel di bawah card, jadi sejajar antar card */}
      <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-4 text-xs">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1 ring-inset ${
            trendStyleNow.className
          }`}
        >
          {<trendStyleNow.icon />}
          {percent ?? trendNow}
        </span>
        <span className="flex min-w-0 flex-col items-start justify-center wrap-break-word text-slate-500">
          <div>{trendStyleNow.label}</div>
          <div className="font-medium text-slate-700 tabular-nums">
            {previousText}
          </div>
        </span>
      </div>
    </div>
  );
}
