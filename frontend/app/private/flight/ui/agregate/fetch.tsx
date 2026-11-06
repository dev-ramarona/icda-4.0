import { ListAgregates } from "../../handlers/flight";
import { queryFlightType } from "../../models/model";
import Agregate from "./agregate";

export default async function FetchAgregate({
  querys,
  verifyPermit,
}: {
  querys: queryFlightType;
  verifyPermit?: boolean;
}) {
  // Dijalankan paralel, bukan berurutan
  if (verifyPermit) return null;
  const [resAgregates] = await Promise.all([ListAgregates(querys)]);
  return <Agregate querys={querys} dataAgregates={resAgregates.data} />;
}
