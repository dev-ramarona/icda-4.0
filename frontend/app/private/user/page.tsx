import AssetHeader from "@/assets/header";
import { ListInfo } from "./handlers/user";
import Access from "./ui/access/access";
import { queryUserType } from "./models/model";
import { getAccessToken, verifyAccessToken } from "@/lib/session";
import FetchConfigure from "./ui/configure/fetch";

export default async function Page(props: {
  searchParams: Promise<queryUserType>;
}) {
  const accessToken = await getAccessToken();
  const verifyToken = await verifyAccessToken(accessToken);
  const querys = await props.searchParams;
  const verifyPermit = !verifyToken.permitkey.includes(
    "PMT_USER_GET_INFO_VIEW",
  );
  const userInfo = await ListInfo();

  return (
    <main className="min-h-fit">
      <AssetHeader title="USER" desc="User and Role Configuration Access" />
      <FetchConfigure querys={querys} verifyPermit={verifyPermit} />
      <Access userInfo={userInfo} />
    </main>
  );
}
