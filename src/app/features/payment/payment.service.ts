import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { InvoiceItemObject } from './models/InvoiceItem';
import { InvoiceObject } from './models/InvoiceModel';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private dbService: HttpService) {


  }

  /**
   * Returns a preview of the invoices for the given purpose and uuids.
   * This will return the default fee for the given purpose and uuids.
   * @param data An object containing the purpose and uuids.
   * @returns An object containing the message and the data, which is a record
   *   of the uuids with the invoice items as values.
   */
  previewInvoices(data: { purpose: string, uuids: string[] }): Observable<{ message: string, data: Record<string, InvoiceItemObject[]> }> {
    return this.dbService.post(`payment/invoices/default-fees`, data)
  }

  submitInvoice(data: { dueDate: string, additionalItems: InvoiceItemObject[], uuids: string[], purpose: string }): Observable<{ message: string }> {
    return this.dbService.post(`payment/invoices/preset`, data)
  }

  /**
   * Submits a generic invoice.
   * @param data An object containing the due date, invoice items, unique id, purpose, and payment options.
   * @returns An observable containing the message.
   */
  submitGenericInvoice(data: { due_date: string, items: InvoiceItemObject[], unique_id: string, purpose: string, paymentOptions: string[], description: string }): Observable<{ message: string }> {
    return this.dbService.post(`payment/invoices`, data)
  }

  getInvoice(uuid: string): Observable<{ data: InvoiceObject }> {
    return this.dbService.get(`payment/invoices/${uuid}`)
  }

  deleteInvoice(uuid: string): Observable<{ message: string }> {
    return this.dbService.delete(`payment/invoices/${uuid}`)
  }

  deletePaymentUpload(id: string): Observable<{ message: string }> {
    return this.dbService.delete(`payment/payment-uploads/${id}`)
  }

  approvePaymentUpload(id: string): Observable<{ message: string }> {
    return this.dbService.post(`payment/payment-uploads/${id}/approve`, {})
  }

  getInvoicePrintouts(data: { uuids: string[], template_name: string }): Observable<{ data: string[], message: string }> {
    return this.dbService.post(`payment/invoices/printout`, data)
  }
}
