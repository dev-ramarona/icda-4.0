"use client";

import AssetLayoutGrid from "@/assets/layout";
import { initialsType, InsightType, queryFlightType } from "../../models/model";
import ChartInsight from "./chart/chart";
import CardInsight from "./card";
import { SwitchInsightAirline, SwitchInsightRegion } from "./switch";

export default function Insight({
  querys,
  initialData,
  dataInsight,
}: {
  querys: queryFlightType;
  initialData: initialsType;
  dataInsight: InsightType;
}) {
  return (
    <AssetLayoutGrid label="Insight">
      <SwitchInsightAirline
        config={querys.airline_insight}
        airlines={initialData.airlines}
      />
      <SwitchInsightRegion
        config={querys.region_insight}
        regions={initialData.regions}
      />
      <CardInsight
        querys={querys}
        initialData={initialData}
        totalDataPrv={dataInsight.trend_revph.length - 1}
        dataInsight={dataInsight.card_kpi}
      />
      <ChartInsight querys={querys} dataInsight={dataInsight} />
    </AssetLayoutGrid>
  );
}
