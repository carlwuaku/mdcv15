import { Component, OnDestroy, OnInit } from '@angular/core';
import { PaymentUploadObject } from '../../models/PaymentUploadModel';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { PaymentService } from '../../payment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-payment-uploads',
  templateUrl: './payment-uploads.component.html',
  styleUrls: ['./payment-uploads.component.scss']
})
export class PaymentUploadsComponent implements OnInit, OnDestroy, DataListComponentInterface<PaymentUploadObject> {
  baseUrl: string = `payment/payment-uploads`;
  url: string = `payment/payment-uploads`;
  ts: string = "";
  selectedItems: PaymentUploadObject[] = [];
  getActions = (object: PaymentUploadObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      ...(this.can_approve && object.file_status == "Pending" ? [{ label: "Approve", type: "button" as "button", onClick: (object: PaymentUploadObject) => this.approve(object) }] : []),
      ...(this.can_delete && object.file_status !== "Approved" ? [{ label: "Delete", type: "button" as "button", onClick: (object: PaymentUploadObject) => this.delete(object) }] : [])
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: PaymentUploadObject[]): void {
    this.selectedItems = objects;
  }
  queryParams: { [key: string]: string } = {};

  specialClasses: Record<string, string> = {};
  can_approve: boolean = false;
  can_delete: boolean = false;
  destroy$: Subject<boolean> = new Subject();

  constructor(private paymentService: PaymentService, private notify: NotifyService, private router: Router, private ar: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {

    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe((queryParams) => {
      this.queryParams = queryParams;
      this.updateUrl();
    });
    this.authService.getUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: user => {
        this.can_approve = user.permissions.includes("Approve_Payment_Evidence_File");
        this.can_delete = user.permissions.includes("Delete_Payment_Evidence_File");
      }
    })
  }
  updateUrl() {

    this.url = `${this.baseUrl}` + "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }
  delete(object: PaymentUploadObject) {
    if (!window.confirm('Are you sure you want to delete this fee? You will not be able to restore it.')) {
      return;
    }
    this.paymentService.deletePaymentUpload(object.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    });
  }

  approve(object: PaymentUploadObject) {
    if (!window.confirm('Are you sure you want to approve this payment upload?')) {
      return;
    }
    this.paymentService.approvePaymentUpload(object.id).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    });
  }

  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });


    this.router.navigate([], { queryParams: paramsObject, relativeTo: this.ar });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
