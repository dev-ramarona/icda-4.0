import { AssetLayoutFix } from "@/assets/layout";
import TrendChartInsight from "./trend";
import TopbotChartInsight from "./topten";
import TbucketChartInsight from "./tbucket";
import { InsightType, queryFlightType } from "../../../models/model";
import { useState } from "react";
import { ChevronLeftCircleIcon, ChevronRightCircleIcon } from "lucide-react";

export default function ChartInsight({
  querys,
  dataInsight,
}: {
  querys: queryFlightType;
  dataInsight: InsightType;
}) {
  const [isOpen, isOpenSet] = useState<1 | 2 | undefined>();
  const fncOpen = (val: 1 | 2) => {
    isOpenSet((prev) => (prev == val ? undefined : val));
  };
  return (
    <div className="grid h-fit w-full grid-cols-1 gap-3">
      <div className="h-160 xl:h-100">
        <AssetLayoutFix className="h-full w-full">
          <TrendChartInsight
            querys={querys}
            dataInsight={dataInsight.trend_revph}
            expanded={true}
          />
        </AssetLayoutFix>
      </div>
      <div className="flex flex-col items-center justify-center gap-3 xl:flex-row">
        <div
          className={`relative h-130 w-full xl:h-96 ${isOpen == 1 ? "xl:w-9/12" : isOpen == 2 ? "xl:w-3/12" : "xl:w-1/2"} duration-300`}
        >
          <AssetLayoutFix className="h-full w-full">
            <TopbotChartInsight
              querys={querys}
              dataInsight={dataInsight.top_bottom}
              expanded={true}
            />
          </AssetLayoutFix>
          <div className="absolute right-0 bottom-0" onClick={() => fncOpen(1)}>
            {isOpen == 1 ? (
              <ChevronLeftCircleIcon className="-translate-0.5 text-slate-500" />
            ) : (
              <ChevronRightCircleIcon className="-translate-0.5 text-slate-500" />
            )}
          </div>
        </div>
        <div
          className={`relative h-120 w-full xl:h-96 ${isOpen == 2 ? "xl:w-9/12" : isOpen == 1 ? "xl:w-3/12" : "xl:w-1/2"} duration-300`}
        >
          <AssetLayoutFix className="h-full w-full">
            <TbucketChartInsight
              querys={querys}
              dataInsight={dataInsight.time_bucket}
              expanded={true}
            />
          </AssetLayoutFix>
          <div className="absolute right-0 bottom-0" onClick={() => fncOpen(2)}>
            {isOpen == 2 ? (
              <ChevronRightCircleIcon className="-translate-0.5 text-slate-500" />
            ) : (
              <ChevronLeftCircleIcon className="-translate-0.5 text-slate-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
