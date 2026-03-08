import { LucideIcon } from "lucide-react";

export interface RoleUser {
  id: string;
  name: string;
  avatar: string;
}

export type RoleStatus = "Active" | "InActive";
export type RoleType = "DEFAULT" | "CUSTOM" | "SYSTEM-CUSTOM";

export interface UserRole {
  id: string;
  name: string;
  type: RoleType;
  dateCreated: string;
  status: RoleStatus;
  users: RoleUser[];
}

export interface ActiveRole {
  id: string;
  name: string;
  lastActive: string;
  isDefault: boolean;
}

export type EmailOption = "account" | "alternative";
export type CheckedMap = Record<string, boolean>;

export interface NavItem {
  label: string;
  icon: LucideIcon;
  badge?: number;
  active?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
}

export interface ApiError {
  error: string;
}

export interface CreateRolePayload {
  name: string;
  type: RoleType;
}

export interface UpdateRolePayload {
  name?: string;
  status?: RoleStatus;
}
