import {
  ListAccounts,
  ListRoles,
  ListFormats,
  ListPermits,
  ListKeyRoles,
  ListKeyFormats,
  ListKeyPermits,
} from "../../handlers/user";
import Configure from "./configure";
import { queryUserType } from "../../models/model";

export default async function FetchConfigure({
  querys,
  verifyPermit,
}: {
  querys: queryUserType;
  verifyPermit?: boolean;
}) {
  // Dijalankan paralel, bukan berurutan
  if (verifyPermit) return null;
  const [resAccounts, resRoles, resFormats, resPermits] = await Promise.all([
    ListAccounts(querys),
    ListRoles(querys),
    ListFormats(querys),
    ListPermits(querys),
  ]);
  const [keyRoles, keyFormats, keyPermits] = await Promise.all([
    ListKeyRoles(),
    ListKeyFormats(),
    ListKeyPermits(),
  ]);

  return (
    <Configure
      dataAccounts={resAccounts.data}
      dataRoles={resRoles.data}
      dataFormats={resFormats.data}
      dataPermits={resPermits.data}
      totalAccounts={resAccounts.total}
      totalRoles={resRoles.total}
      totalFormats={resFormats.total}
      totalPermits={resPermits.total}
      keyRoles={keyRoles}
      keyFormats={keyFormats}
      keyPermits={keyPermits}
      querys={querys}
    />
  );
}
