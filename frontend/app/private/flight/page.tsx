import AssetHeader from "@/assets/header";
import { getAccessToken, verifyAccessToken } from "@/lib/session";
import { queryFlightType } from "./models/model";
import FetchAgregate from "./ui/agregate/fetch";
import FetchDetail from "./ui/detail/fetch";
import FetchInsight from "./ui/insight/fetch";
import { ListInitial } from "./handlers/flight";
import { LibFormatNumberToDate } from "@/lib/format";

export default async function Page(props: {
  searchParams: Promise<queryFlightType>;
}) {
  const initialData = await ListInitial();
  const accessToken = await getAccessToken();
  const verifyToken = await verifyAccessToken(accessToken);
  const querys = await props.searchParams;
  const lastIdxDate = initialData.dates.length - 1;
  const nowDate = initialData.dates[lastIdxDate];
  querys.insight_dot = querys.insight_dot || LibFormatNumberToDate(nowDate);
  querys.trend_metric = querys.trend_metric ?? "rph";
  querys.topbot_rank = querys.topbot_rank ?? "bottom";
  querys.topbot_period = querys.topbot_period ?? "daily";
  querys.topbot_value = querys.topbot_value ?? "score";
  querys.tbucket_period = querys.tbucket_period ?? "daily";
  querys.tbucket_value = querys.tbucket_value ?? "lf";
  const verifyPermit = !verifyToken.permitkey.includes(
    "PMT_FLIGHT_GET_INSIGHT_VIEW",
  );

  return (
    <main className="min-h-fit">
      <AssetHeader title="FLIGHT" desc="Revenue and Manifest dashboard" />
      <FetchInsight
        querys={querys}
        verifyPermit={verifyPermit}
        initialData={initialData}
      />
      <FetchAgregate querys={querys} />
      <FetchDetail querys={querys} />
    </main>
  );
}
