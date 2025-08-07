export interface FeesObject {
  id?: number;
  payer_type: string;
  name: string;
  rate: number;
  created_on: string;
  category: string;
  service_code: string;
  chart_of_account: string;
  supports_variable_amount: boolean;
  currency: string;
}
