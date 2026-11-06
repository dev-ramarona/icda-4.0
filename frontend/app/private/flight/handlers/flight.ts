import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/session";
import {
  agregatesType,
  initialsType,
  InsightType,
  queryFlightType,
} from "../models/model";
import { LibFormatNumberToDate } from "@/lib/format";

// Get list Initials
export async function ListInitial() {
  const token = await getAccessToken();
  const nullApps: initialsType = {
    airlines: [],
    regions: [],
    dates: [],
  };
  const res = await backendFetch<any>(`/icda/v1/flight/initials`, {
    accessToken: token,
  });
  if (!res.ok) return nullApps;
  return res.data as initialsType;
}

// Get list Agregates
export async function ListAgregates(querys: queryFlightType) {
  const token = await getAccessToken();
  const nullApps: LibRespage<agregatesType[]> = { data: [], total: 0 };
  const res = await backendFetch<any>(
    `/icda/v1/flight/agregates?page=${querys.page || 1}&limit=${querys.limit || 10}&search=${querys.search || ""}`,
    { accessToken: token },
  );
  if (!res.ok) return nullApps;
  return res.data.agregates as LibRespage<agregatesType[]>;
}

// Get list Agregates
export async function GroupInsight(
  querys: queryFlightType,
  initialData: initialsType,
) {
  const token = await getAccessToken();
  const nullApps: InsightType = {
    card_kpi: {
      rph: 0,
      rphprv: 0,
      rpp: 0,
      rppprv: 0,
      pax: 0,
      paxprv: 0,
      lf: 0,
      lfprv: 0,
      flh: 0,
      flhprv: 0,
    },
    trend_revph: [],
    top_bottom: [],
    time_bucket: [],
  };
  const latestDot =
    querys.insight_dot ||
    LibFormatNumberToDate(initialData.dates[initialData.dates.length - 1]);
  const latestAirline = querys.airline_insight || initialData.airlines[0];
  const latestRegion = querys.region_insight || initialData.regions[0];
  const topBottom = querys.topbot_rank;
  const topBottomPeriod = querys.topbot_period || "monthly";
  const topBottomValue = querys.topbot_value || "score";
  const res = await backendFetch<any>(
    `/icda/v1/flight/insight?date_operating=${latestDot}&airline=${latestAirline}&region=${latestRegion}&topbot=${topBottom}&topbot_period=${topBottomPeriod}&topbot_value=${topBottomValue}`,
    { accessToken: token },
  );
  if (!res.ok) return nullApps;
  return res.data as InsightType;
}
