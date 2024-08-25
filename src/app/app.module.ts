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
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ErrorInterceptorService } from './core/interceptors/global-error-handler.interceptor';
import { HeadersInterceptorInterceptor } from './core/interceptors/headers-interceptor.interceptor';
import { ErrorInterceptor } from './core/interceptors/error-interceptor.interceptor';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { LocationStrategy, HashLocationStrategy} from "@angular/common";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    "./assets/i18n/",
    ".json?cb=" + new Date().getTime()
  );
}

export function appInitializerTranslationsFactory(translate: TranslateService) {
  return () => new Promise<any>((resolve: any) => {
    const langToSet: string = navigator.language.split("-")[0];
    translate.setDefaultLang("en");
    translate.use(langToSet).subscribe(() => { }, err => { }, () => {
      resolve(null);
    });
  });
}

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatNativeDateModule,

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerTranslationsFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
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
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
