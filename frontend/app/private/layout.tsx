import AssetNavbar from "@/assets/navbar";
import { getAccessToken, verifyAccessToken } from "@/lib/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accessToken = await getAccessToken();
  const verifyToken = await verifyAccessToken(accessToken);

  return (
    <section className="flex min-h-screen flex-col justify-between">
      <AssetNavbar verifyToken={verifyToken} />
      <div className="pb-20 md:px-28 md:pb-0">{children}</div>
      <div className="flex h-20 w-full items-end justify-center pb-5">
        Internal Control Data Analyst - Lion Tower Lt.3
      </div>
    </section>
  );
}
