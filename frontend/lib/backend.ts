const backendDomain = `http://${process.env.BACKEND_DOMAIN}:8083`;
const InternalApiKey = process.env.INTERNAL_API_KEY;
if (!backendDomain) {
  throw new Error("Backend Domain belum diset di environment server");
}
type BackendOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  accessToken?: string;
};
export async function backendFetch<anyParam>(
  path: string,
  opts: BackendOptions = {},
): Promise<{ ok: boolean; status: number; data: anyParam }> {
  try {
    const res = await fetch(`${backendDomain}${path}`, {
      method: opts.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Api-Key": InternalApiKey ?? "",
        ...(opts.accessToken
          ? { Authorization: `Bearer ${opts.accessToken}` }
          : {}),
      },
      credentials: "include",
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as anyParam;
    return { ok: res.ok, status: res.status, data };
  } catch {
    const data = { error: "Tidak dapat terhubung ke server" } as anyParam;
    return { ok: false, status: 0, data: data };
  }
}
