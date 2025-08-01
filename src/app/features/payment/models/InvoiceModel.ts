import { InvoiceItemObject } from "./InvoiceItem";

export interface InvoiceObject {
  invoice_number: string | null,
  uuid: string,
  unique_id: string,
  name: string,
  email: string,
  phone_number: string,
  amount: string,
  application_id: string,
  post_url: string | null,
  redirect_url: string | null,
  purpose: string,
  year: string,
  currency: string,
  due_date: string,
  status: string,
  notes: string,
  items: InvoiceItemObject[]
}
/**
 * 'invoice_number',
        'unique_id',
        'name',
        'email',
        'phone',
        'amount',
        'application_id',
        'post_url',
        'redirect_url',
        'purpose',
        'year',
        'currency',
        'due_date',
        'status',
        'notes'
 */
