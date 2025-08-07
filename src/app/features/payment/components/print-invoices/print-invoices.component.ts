import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { InvoiceObject } from '../../models/InvoiceModel';
import { Subject } from 'rxjs';
import { Template } from 'src/app/shared/components/print-table/Template.model';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from '../../payment.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { openHtmlInNewWindow } from 'src/app/shared/utils/helper';

@Component({
  selector: 'app-print-invoices',
  templateUrl: './print-invoices.component.html',
  styleUrls: ['./print-invoices.component.scss']
})
export class PrintInvoicesComponent {
  @Input() objects: InvoiceObject[] = [];
  destroy$: Subject<boolean> = new Subject();
  selectedTemplate: string | null = null;
  selectedTemplateContent: string | null = null;
  @ViewChild('invoiceDialog') invoiceDialog!: TemplateRef<any>;

  constructor(private dialog: MatDialog, private notify: NotifyService, private paymentService: PaymentService) {
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  openDialog() {
    this.dialog.open(this.invoiceDialog, {
      width: '90%',
      maxHeight: '90%',

    });

    //TODO: Add an event emitter to signal when dialog is closed
  }

  onTemplateChange(template: Template) {
    this.selectedTemplate = template.template_name;
    this.selectedTemplateContent = template.template_content;
  }


  getInvoicePrintouts() {
    if (!this.selectedTemplate) {
      this.notify.failNotification("Please select a template");
      return
    }
    this.paymentService.getInvoicePrintouts({ uuids: this.objects.map(o => o.uuid), template_name: this.selectedTemplate }).subscribe(res => {
      openHtmlInNewWindow(res.data.join('\n'));
    })
  }
}
