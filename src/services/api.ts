/// <reference types="vite/client" />
import {
  ApiResponse,
  CreateRolePayload,
  UpdateRolePayload,
  UserRole,
  ActiveRole,
} from "../types/index";

const BASE_URL: string = import.meta.env.VITE_API_URL ?? "/api";
console.log(BASE_URL);

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error((err as { error: string }).error ?? `HTTP ${res.status}`);
  }
  return (res.json() as Promise<ApiResponse<T>>).then((d) => d.data);
}

export const rolesApi = {
  getAll: (params: Record<string, string> = {}): Promise<UserRole[]> => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/roles${qs ? `?${qs}` : ""}`).then(
      handleResponse<UserRole[]>,
    );
  },

  getById: (id: string): Promise<UserRole> =>
    fetch(`${BASE_URL}/roles/${id}`).then(handleResponse<UserRole>),

  getActiveList: (): Promise<ActiveRole[]> =>
    fetch(`${BASE_URL}/roles/active/list`).then(handleResponse<ActiveRole[]>),

  create: (payload: CreateRolePayload): Promise<UserRole> =>
    fetch(`${BASE_URL}/roles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse<UserRole>),

  update: (id: string, payload: UpdateRolePayload): Promise<UserRole> =>
    fetch(`${BASE_URL}/roles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(handleResponse<UserRole>),

  delete: (id: string): Promise<{ message: string }> =>
    fetch(`${BASE_URL}/roles/${id}`, { method: "DELETE" }).then(
      handleResponse<{ message: string }>,
    ),
};
