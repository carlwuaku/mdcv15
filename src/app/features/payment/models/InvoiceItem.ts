import { DataActionsButton } from "src/app/shared/components/load-data-list/data-actions-button.interface";

export interface InvoiceItemObject {
  id: string;
  name: string;
  service_code: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}
export type InvoiceItemTableObject = InvoiceItemObject & { actions: DataActionsButton[] };
