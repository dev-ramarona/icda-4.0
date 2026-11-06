"use server";

import { backendFetch } from "@/lib/backend";
import { getAccessToken, TokenPair } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { filtersType } from "../models/model";

export type actionState = {
  error?: string;
  success?: string;
};

// Create / Update account
export async function ActionAccount(
  _prevState: { error?: string },
  formData: FormData,
): Promise<actionState> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  const namefull = String(formData.get("namefull") ?? "");
  const email = String(formData.get("email") ?? "");
  const role = String(formData.getAll("role") ?? "");
  const status = String(formData.get("status") ?? "");
  const action = String(formData.get("action") ?? "");

  // Logic gate
  const errField = { error: "Semua field wajib di isi" };
  if (action == "create" && !password) return errField;
  if (!namefull || !email || !role || !status || !username) return errField;

  // Create api
  let api: string;
  if (action == "create") {
    api = "/icda/v1/user/create/account";
  } else api = "/icda/v1/user/update/account";

  // Hit API
  const token = await getAccessToken();
  const res = await backendFetch<TokenPair & { error?: string }>(api, {
    accessToken: token,
    method: action == "create" ? "POST" : "PATCH",
    body: { username, password, namefull, email, role, status },
  });

  // failed
  if (!res.ok) {
    if (res.status == 0) return { error: "Server offline" };
    if (res.data.error) return { error: res.data.error };
    return { error: "Server not found" };
  }

  // Success
  revalidatePath("/private/user");
  return { success: `Success Account`, error: "" };
}

// Create / Update role
export async function ActionRole(
  _prevState: { error?: string },
  formData: FormData,
): Promise<actionState> {
  const rolekey = String(formData.get("rolekey") ?? "");
  const field = formData.getAll("field") ?? [""];
  const operator = formData.getAll("operator") ?? [""];
  const value = formData.getAll("value") ?? [""];
  const formats = formData.getAll("formats") ?? [""];
  const permits = formData.getAll("permits") ?? [""];
  const status = String(formData.get("status") ?? "");
  const action = String(formData.get("action") ?? "");

  // Logic gate
  const errField = { error: "Semua field wajib di isi" };
  if (!rolekey || !formats || !permits || !status) return errField;

  // Logic filters
  const filters: filtersType[] = [];
  for (let i = 0; i < field.length; i++) {
    if (!field[i]) return errField;
    if (!operator[i]) return errField;
    if (!value[i]) return errField;
    const filter: filtersType = {
      field: String(field[i]),
      operator: String(operator[i]),
      value: String(value[i]).split("|"),
    };
    filters.push(filter);
  }

  // Create api
  let api: string;
  if (action == "create") {
    api = "/icda/v1/user/create/role";
  } else api = "/icda/v1/user/update/role";

  // Hit API
  const token = await getAccessToken();
  const res = await backendFetch<TokenPair & { error?: string }>(api, {
    accessToken: token,
    method: action == "create" ? "POST" : "PATCH",
    body: { rolekey, filters, formats, permits, status },
  });

  // failed
  if (!res.ok) {
    if (res.status == 0) return { error: "Server offline" };
    if (res.data.error) return { error: res.data.error };
    return { error: "Server not found" };
  }

  // Success
  revalidatePath("/private/user");
  return { success: `Success ${action} Role`, error: "" };
}

// Create / Update Format
export async function ActionFormat(
  _prevState: { error?: string },
  formData: FormData,
): Promise<actionState> {
  const formatkey = String(formData.get("formatkey") ?? "");
  const formatttl = String(formData.get("formatttl") ?? "");
  const fields = formData.getAll("fields") ?? [""];
  const status = String(formData.get("status") ?? "");
  const action = String(formData.get("action") ?? "");

  // Logic gate
  const errField = { error: "Semua field wajib di isi" };
  if (!formatkey || !formatttl || !fields || !status) return errField;

  // Logic fields
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i]) return errField;
  }

  // Create api
  let api: string;
  if (action == "create") {
    api = "/icda/v1/user/create/format";
  } else api = "/icda/v1/user/update/format";

  // Hit API
  const token = await getAccessToken();
  const res = await backendFetch<TokenPair & { error?: string }>(api, {
    accessToken: token,
    method: action == "create" ? "POST" : "PATCH",
    body: { formatkey, formatttl, fields, status },
  });

  // failed
  if (!res.ok) {
    if (res.status == 0) return { error: "Server offline" };
    if (res.data.error) return { error: res.data.error };
    return { error: "Server not found" };
  }

  // Success
  revalidatePath("/private/user");
  return { success: `Success ${action} Format`, error: "" };
}

// Create / Update permit
export async function ActionPermit(
  _prevState: { error?: string },
  formData: FormData,
): Promise<actionState> {
  const permitkey = String(formData.get("permitkey") ?? "");
  const endpoint = String(formData.get("endpoint") ?? "");
  const method = String(formData.get("method") ?? "");
  const screen = String(formData.get("screen") ?? "");
  const status = String(formData.get("status") ?? "");
  const action = String(formData.get("action") ?? "");

  // Logic gate
  const errField = { error: "Semua field wajib di isi" };
  if (!permitkey || !endpoint || !method || !screen || !status) return errField;

  // Create api
  let api: string;
  if (action == "create") {
    api = "/icda/v1/user/create/permit";
  } else api = "/icda/v1/user/update/permit";

  // Hit API
  const token = await getAccessToken();
  const res = await backendFetch<TokenPair & { error?: string }>(api, {
    accessToken: token,
    method: action == "create" ? "POST" : "PATCH",
    body: { permitkey, endpoint, method, screen, status },
  });

  // failed
  if (!res.ok) {
    if (res.status == 0) return { error: "Server offline" };
    if (res.data.error) return { error: res.data.error };
    return { error: "Server not found" };
  }

  // Success
  revalidatePath("/private/user");
  return { success: `Success ${action} Permit`, error: "" };
}
