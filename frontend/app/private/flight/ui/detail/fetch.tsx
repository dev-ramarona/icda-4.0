import { ListAgregates } from "../../handlers/flight";
import { queryFlightType } from "../../models/model";
import Detail from "./detail";

export default async function FetchDetail({
  querys,
  verifyPermit,
}: {
  querys: queryFlightType;
  verifyPermit?: boolean;
}) {
  // Dijalankan paralel, bukan berurutan
  if (verifyPermit) return null;
  const [resAgregates] = await Promise.all([ListAgregates(querys)]);
  return <Detail querys={querys} dataAgregates={resAgregates.data} />;
}
