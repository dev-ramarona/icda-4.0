import { GroupInsight, ListAgregates } from "../../handlers/flight";
import {
  agregatesType,
  initialsType,
  queryFlightType,
} from "../../models/model";
import Info from "./info";

export default async function FetchInfo({
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
  const [resInsight, resAgregates] = await Promise.all([
    GroupInsight(querys, initialData),
    ListAgregates(querys),
  ]);
  return <Info arrayObj={resAgregates.data} />;
}
