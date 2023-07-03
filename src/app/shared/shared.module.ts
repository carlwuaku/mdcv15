import { NgModule } from '@angular/core';
import { PrimeNgUiComponentsModule } from './prime-ng-ui-components/prime-ng-ui-components.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoxamDatePipe } from './pipes/date/loxam-date.pipe';
import { RemoteDataModule } from 'ngx-remotedata';
import { ClipboardCopyDirective } from "./directives/clipboard-copy.directive";
import { TranslateModule } from "@ngx-translate/core";
import { DialogModule } from 'primeng/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { MaterialComponentsModule } from './material-components/material-components.module';
import { PreviousUrlDirective } from './directives/previous-url.directive';
import { RefreshPageDirective } from './directives/refresh-page.directive';
import { AssetImageComponent } from './components/asset-image/asset-image.component';
import { LvisUTCDatePipe } from './pipes/date/lvis-utc-date.pipe';
import { ApiCountComponent } from './components/api-count/api-count.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LogoComponent } from './components/logo/logo.component';

@NgModule({
  declarations: [
    NavbarComponent,
    LoxamDatePipe,
    ClipboardCopyDirective,
    DialogComponent,
    PreviousUrlDirective,
    RefreshPageDirective,
    AssetImageComponent,
    LvisUTCDatePipe,
    ApiCountComponent,
    LoadingComponent,
    LogoComponent
  ],
  imports: [
    PrimeNgUiComponentsModule,
    RemoteDataModule,
    TranslateModule,
    DialogModule,
    MaterialComponentsModule
  ],
  exports: [
    PrimeNgUiComponentsModule,
    NavbarComponent,
    TranslateModule,
    MaterialComponentsModule,
    ClipboardCopyDirective,
    LoxamDatePipe,
    DialogComponent,
    PreviousUrlDirective,
    RefreshPageDirective,
    AssetImageComponent,
    LvisUTCDatePipe
  ],
  providers: [
    ClipboardCopyDirective
  ]
})
export class SharedModule {}
