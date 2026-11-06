import { backendFetch } from "@/lib/backend";
import { getAccessToken } from "@/lib/session";
import {
  infoType,
  permitsType,
  accountsType,
  rolesType,
  formatsType,
  queryUserType,
} from "../models/model";

// Get user info
export async function ListInfo() {
  const token = await getAccessToken();
  const nullApps: infoType = {
    permits: [],
    role: "",
    formats: [],
    filters: [],
  };
  const res = await backendFetch<any>("/icda/v1/user/info", {
    accessToken: token,
  });
  if (!res.ok) return nullApps;
  return res.data.caps as infoType;
}

// Get list accounts
export async function ListAccounts(querys: queryUserType) {
  const token = await getAccessToken();
  const nullApps: LibRespage<accountsType[]> = { data: [], total: 0 };
  if (querys.config != "accounts" && querys.config) return nullApps;
  const res = await backendFetch<any>(
    `/icda/v1/user/accounts?page=${querys.page || 1}&limit=${querys.limit || 10}&search=${querys.search || ""}`,
    {
      accessToken: token,
    },
  );
  if (!res.ok) return nullApps;
  return res.data.accounts as LibRespage<accountsType[]>;
}

// Get user roles
export async function ListRoles(querys: queryUserType) {
  const token = await getAccessToken();
  const nullApps: LibRespage<rolesType[]> = { data: [], total: 0 };
  if (querys.config != "roles") return nullApps;
  const res = await backendFetch<any>(
    `/icda/v1/user/roles?page=${querys.page || 1}&limit=${querys.limit || 10}&search=${querys.search || ""}`,
    {
      accessToken: token,
    },
  );
  if (!res.ok) return nullApps;
  return res.data.roles as LibRespage<rolesType[]>;
}

// Get user formats
export async function ListFormats(querys: queryUserType) {
  const token = await getAccessToken();
  const nullApps: LibRespage<formatsType[]> = { data: [], total: 0 };
  if (querys.config != "formats") return nullApps;
  const res = await backendFetch<any>(
    `/icda/v1/user/formats?page=${querys.page || 1}&limit=${querys.limit || 10}&search=${querys.search || ""}`,
    {
      accessToken: token,
    },
  );
  if (!res.ok) return nullApps;
  return res.data.formats as LibRespage<formatsType[]>;
}

// Get user permits
export async function ListPermits(querys: queryUserType) {
  const token = await getAccessToken();
  const nullApps: LibRespage<permitsType[]> = { data: [], total: 0 };
  if (querys.config != "permits") return nullApps;
  const res = await backendFetch<any>(
    `/icda/v1/user/permits?page=${querys.page || 1}&limit=${querys.limit || 10}&search=${querys.search || ""}`,
    {
      accessToken: token,
    },
  );
  if (!res.ok) return nullApps;
  return res.data.permits as LibRespage<permitsType[]>;
}

// Get user roles key
export async function ListKeyRoles() {
  const token = await getAccessToken();
  const nullApps: string[] = [];
  const res = await backendFetch<any>(`/icda/v1/user/keyroles`, {
    accessToken: token,
  });
  if (!res.ok) return nullApps;
  return res.data.keyroles as string[];
}

// Get user formats key
export async function ListKeyFormats() {
  const token = await getAccessToken();
  const nullApps: string[] = [];
  const res = await backendFetch<any>(`/icda/v1/user/keyformats`, {
    accessToken: token,
  });
  if (!res.ok) return nullApps;
  return res.data.keyformats as string[];
}

// Get user permits key
export async function ListKeyPermits() {
  const token = await getAccessToken();
  const nullApps: string[] = [];
  const res = await backendFetch<any>(`/icda/v1/user/keypermits`, {
    accessToken: token,
  });
  if (!res.ok) return nullApps;
  return res.data.keypermits as string[];
}
