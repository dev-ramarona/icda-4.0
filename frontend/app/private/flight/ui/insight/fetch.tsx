import { GroupInsight } from "../../handlers/flight";
import { initialsType, queryFlightType } from "../../models/model";
import Insight from "./insight";

export default async function FetchInsight({
  querys,
  verifyPermit,
  initialData,
}: {
  querys: queryFlightType;
  verifyPermit?: boolean;
  initialData: initialsType;
}) {
  // Dijalankan paralel, bukan berurutan
  if (verifyPermit) return null;
  const [resInsight] = await Promise.all([GroupInsight(querys, initialData)]);
  return (
    <Insight
      querys={querys}
      dataInsight={resInsight}
      initialData={initialData}
    />
  );
}
