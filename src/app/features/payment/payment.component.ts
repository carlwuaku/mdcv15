import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { DataListComponentInterface } from 'src/app/shared/types/DataListComponentInterface';
import { PaymentService } from './payment.service';
import { InvoiceObject } from './models/InvoiceModel';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  baseUrl: string = `payment/invoices`;
  url: string = `payment/invoices`;
  ts: string = "";
  selectedItems: InvoiceObject[] = [];
  queryParams: { [key: string]: string } = {};

  specialClasses: Record<string, string> = {};
  can_edit: boolean = false;
  can_delete: boolean = false;
  destroy$: Subject<boolean> = new Subject();
  constructor(private router: Router, private ar: ActivatedRoute) { }

  ngOnInit(): void {

    this.ar.queryParams.pipe(takeUntil(this.destroy$)).subscribe((queryParams) => {
      this.queryParams = queryParams;
      this.updateUrl();
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
  updateUrl() {

    this.url = `${this.baseUrl}` + "?" + Object.entries(this.queryParams).map(([key, value]) => `${key}=${value}`).join("&");
  }


  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: InvoiceObject[]): void {
    this.selectedItems = objects;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
