import { Params } from "@angular/router";
import { IFormGenerator } from "../components/form-generator/form-generator-interface";

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  children: DashboardItem[];
  active_children?: boolean;
  urlParams?: Params;
}

export interface DashboardItem extends MenuItem {
  apiCountUrl?: string;
  color?: string;
  description?: string;
  apiCountText?: string;
  permissions: string[]
}

export interface RenewalStageItems extends DashboardItem {
  permission: string,
  printable: boolean,
  onlineCertificatePrintable: boolean,
  allowedTransitions: string[],
  fields: IFormGenerator[]
}

export const menuItems: MenuItem[] = [

]
