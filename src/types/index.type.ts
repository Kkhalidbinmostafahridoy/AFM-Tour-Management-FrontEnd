import type { ComponentType } from "react";

export type { ISendOtp } from "./auth.type";
export type { IRegister } from "./auth.type";
export type { ILogin } from "./auth.type";

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export type TRole = "SUPER_ADMIN" | "ADMIN" | "USER";
