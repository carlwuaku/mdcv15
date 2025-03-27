import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { gtmContainerId } from "./app-config";
import { CoreModule } from './core/core.module';
import { HeadersInterceptorInterceptor } from './core/interceptors/headers-interceptor.interceptor';
import { ErrorInterceptor } from './core/interceptors/error-interceptor.interceptor';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { LocationStrategy, HashLocationStrategy, DatePipe } from "@angular/common";
import { NgChartsModule } from 'ng2-charts';




@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    FormsModule,
    SharedModule,
    ToastModule,
    HttpClientModule,
    MatNativeDateModule,

  ],
  providers: [

    MessageService,
    { provide: "googleTagManagerId", useValue: gtmContainerId },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
