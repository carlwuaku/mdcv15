import { HousemanshipPostingDetail } from "./Housemanship_posting_detail.model";

export type HousemanshipPosting = {
  id?: string;
  uuid: string;
  license_number: string;
  type: string;
  category?: string;
  session: string;
  created_on?: string;
  letter_template: string;
  details?: HousemanshipPostingDetail[];
  first_name?: string;
  last_name?: string;
  year?: string;
}
