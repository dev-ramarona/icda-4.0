import { AssetInput } from "@/assets/input";
import { AssetLayoutFix } from "@/assets/layout";
import AssetSummaries from "@/assets/summaries";
import {
  CalendarArrowDown,
  CalendarDaysIcon,
  ChevronDown,
  ChevronsUpDown,
  Clock3,
  DollarSign,
  Gauge,
  UsersRound,
} from "lucide-react";
import {
  initialsType,
  InsightTypeKpi,
  queryFlightType,
} from "../../models/model";
import { LibFormatNumberToDate } from "@/lib/format";

export default function CardInsight({
  querys,
  initialData,
  dataInsight,
  totalDataPrv,
}: {
  querys: queryFlightType;
  initialData: initialsType;
  dataInsight: InsightTypeKpi;
  totalDataPrv: number;
}) {
  return (
    <div className="grid grid-cols-2 justify-center gap-3 xl:grid-cols-3 2xl:grid-cols-6">
      <AssetLayoutFix>
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="text-center text-sm font-semibold text-slate-600">
            Select date global
          </div>
          <AssetInput
            className="h-8 w-33"
            queryKey="insight_dot"
            typeData="date"
            rangeDate={initialData.dates}
            queryVal={
              querys.insight_dot ||
              LibFormatNumberToDate(
                initialData.dates[initialData.dates.length - 1],
              )
            }
            needQuery={true}
          >
            <CalendarDaysIcon className="text-slate-400" />
          </AssetInput>
        </div>
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Revenue per hour"
          amount={dataInsight.rph}
          previous={dataInsight.rphprv}
          day={totalDataPrv}
          icon={<DollarSign />}
          formatValue={(v: number) =>
            "Rp " + new Intl.NumberFormat("id-ID").format(v)
          }
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Revenue per pax"
          amount={dataInsight.rpp}
          previous={dataInsight.rppprv}
          day={totalDataPrv}
          icon={<DollarSign />}
          formatValue={(v: number) =>
            "Rp " + new Intl.NumberFormat("id-ID").format(v)
          }
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Total Passenger"
          amount={dataInsight.pax}
          previous={dataInsight.paxprv}
          day={totalDataPrv}
          icon={<UsersRound />}
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Load factor"
          amount={dataInsight.lf}
          previous={dataInsight.lfprv}
          day={totalDataPrv}
          icon={<Gauge />}
          formatValue={(v: number) => v + "%"}
        />
      </AssetLayoutFix>
      <AssetLayoutFix>
        <AssetSummaries
          title="Total flight hour"
          amount={dataInsight.flh}
          previous={dataInsight.flhprv}
          day={totalDataPrv}
          icon={<Clock3 />}
        />
      </AssetLayoutFix>

      {/* <AssetLayoutFix>
        <div className="text-base font-semibold">Total permit</div>
        <div className="flex h-full w-full flex-wrap items-center justify-start gap-3">
          <FileSliders className="h-10 w-10 rounded-xl bg-sky-200 p-2 text-sky-800 ring ring-white" />
          <div className="flex items-center text-2xl">
            <span className="font-mono">123K</span>
          </div>
          <div className="ml-3 flex flex-col items-center justify-center">
            <span>
              <ChevronsUp className="text-green-600" strokeWidth={3} />
            </span>
            <span className="text-sm">52%</span>
          </div>
          <div className="p-1">
            <div>Prev AVG 30 day</div>
            <div>123K</div>
          </div>
        </div>
      </AssetLayoutFix>
      <AssetLayoutFix>
        <div className="text-base font-semibold">Total account</div>
        <div className="flex h-full w-full flex-wrap items-center justify-start gap-3">
          <KeyRound className="h-10 w-10 rounded-xl bg-sky-200 p-2 text-sky-800 ring ring-white" />
          <div className="flex items-center text-2xl">
            <span className="font-mono">48</span>
          </div>
          <div className="ml-3 flex flex-col items-center justify-center">
            <span>
              <ChevronsUp className="text-green-600" strokeWidth={3} />
            </span>
            <span className="text-sm">52%</span>
          </div>
          <div className="p-1">
            <div>Prev AVG 30 day</div>
            <div>48</div>
          </div>
        </div>
      </AssetLayoutFix> */}
    </div>
  );
}
