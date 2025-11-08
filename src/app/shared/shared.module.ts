import { NgModule } from '@angular/core';
import { PrimeNgUiComponentsModule } from './prime-ng-ui-components/prime-ng-ui-components.module';
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
import { LoadDataListComponent } from './components/load-data-list/load-data-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { ExportTableComponent } from './components/export-table/export-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { JsonDisplayComponent } from './components/json-display/json-display.component';
import { ArrayLinksComponent } from './components/array-links/array-links.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PrepMessagingComponent } from './components/prep-messaging/prep-messaging.component';
import { LinkNameComponent } from './components/link-name/link-name.component';
import { SelectObjectComponent } from './components/select-object/select-object.component';
import { DataListMenuButtonComponent } from './components/data-list-menu-button/data-list-menu-button.component';
import { FieldTemplateDirective, FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { KeyValueDisplayComponent } from './components/key-value-display/key-value-display.component';
import { ArrayEditorComponent } from './components/array-editor/array-editor.component';
import { JsonEditorComponent } from './components/json-editor/json-editor.component';
import { InlineEditorComponent } from './components/inline-editor/inline-editor.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { DialogKeyValueDisplayComponent } from './components/dialog-key-value-display/dialog-key-value-display.component';
import { CkeditorComponent } from './components/ckeditor/ckeditor.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormEditorComponent } from './components/form-editor/form-editor.component';
import { OptionsEditorComponent } from './components/form-editor/options-editor/options-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { SearchWidgetComponent } from './components/search-widget/search-widget.component';
import { DashboardTileComponent } from './components/dashboard-tile/dashboard-tile.component';
import { ProgressDialogComponent } from './components/progress-dialog/progress-dialog.component';
import { GhanaMapComponent } from './components/ghana-map/ghana-map.component';
import { SelectLicenseTypeComponent } from './components/select-license-type/select-license-type.component';
import { FilterEmptyValuesPipe } from './pipes/filter-empty-values.pipe';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { PrintTableComponent } from './components/print-table/print-table.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartModule } from 'primeng/chart';
import { TableComponent } from './components/table/table.component';
import { ViewHtmlContentComponent } from './components/view-html-content/view-html-content.component';
import { AddGuestUserComponent } from './components/add-guest-user/add-guest-user.component';
import { RouterModule } from '@angular/router';
import { SectionContainerComponent } from './components/section-container/section-container.component';
import { SubSectionContainerComponent } from './components/sub-section-container/sub-section-container.component';
import { EmailFormComponent } from './components/email-form/email-form.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AlertComponent } from './components/alert/alert.component';
import { UploadableCkeditorInputComponent } from './components/uploadable-ckeditor-input/uploadable-ckeditor-input.component';
import { StringArrayInputComponent } from './components/string-array-input/string-array-input.component';
import { FilterObjectsPipe } from './pipes/filter-objects.pipe';
import { TemplateDesignerComponent } from './components/template-designer/template-designer.component';
import { CommonModule } from '@angular/common';
import { FilterByPermissionsPipe } from './pipes/filter-by-permissions.pipe';
import { SecureImageComponent } from './components/secure-image/secure-image.component';
import { ApplicationTimelineComponent } from './components/application-timeline/application-timeline.component';
import { DataLoaderComponent } from './components/data-loader/data-loader.component';
@NgModule({
  declarations: [
    LoxamDatePipe,
    ClipboardCopyDirective,
    DialogComponent,
    PreviousUrlDirective,
    RefreshPageDirective,
    AssetImageComponent,
    LvisUTCDatePipe,
    ApiCountComponent,
    LoadingComponent,
    LogoComponent,
    LoadDataListComponent,
    ExportTableComponent,
    PaginationComponent,
    JsonDisplayComponent,
    ArrayLinksComponent,
    SidebarComponent,
    PrepMessagingComponent,
    LinkNameComponent,
    SelectObjectComponent,
    DataListMenuButtonComponent,
    FormGeneratorComponent,
    FileUploaderComponent,
    KeyValueDisplayComponent,
    ArrayEditorComponent,
    JsonEditorComponent,
    InlineEditorComponent,
    DialogFormComponent,
    DialogKeyValueDisplayComponent,
    CkeditorComponent,
    FormEditorComponent,
    OptionsEditorComponent,
    EditImageComponent,
    SearchWidgetComponent,
    DashboardTileComponent,
    ProgressDialogComponent,
    GhanaMapComponent,
    SelectLicenseTypeComponent,
    FilterEmptyValuesPipe,
    ErrorMessageComponent,
    PrintTableComponent,
    FieldTemplateDirective,
    ChartComponent,
    TableComponent,
    ViewHtmlContentComponent,
    AddGuestUserComponent,
    SectionContainerComponent,
    SubSectionContainerComponent,
    EmailFormComponent,
    AlertComponent,
    UploadableCkeditorInputComponent,
    StringArrayInputComponent,
    FilterObjectsPipe,
    TemplateDesignerComponent,
    FilterByPermissionsPipe,
    SecureImageComponent,
    ApplicationTimelineComponent,
    DataLoaderComponent
  ],
  imports: [
    PrimeNgUiComponentsModule,
    RemoteDataModule,
    TranslateModule,
    DialogModule,
    MaterialComponentsModule,
    AgGridModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    ChartModule,
    RouterModule,
    ScrollingModule,
    CommonModule

  ],
  exports: [
    PrimeNgUiComponentsModule,
    TranslateModule,
    MaterialComponentsModule,
    ClipboardCopyDirective,
    LoxamDatePipe,
    DialogComponent,
    PreviousUrlDirective,
    RefreshPageDirective,
    AssetImageComponent,
    LvisUTCDatePipe,
    AgGridModule,
    ExportTableComponent,
    PaginationComponent,
    JsonDisplayComponent,
    ArrayLinksComponent,
    LoadingComponent,
    LogoComponent,
    SidebarComponent,
    ApiCountComponent,
    PrepMessagingComponent,
    LoadDataListComponent,
    SelectObjectComponent,
    FormGeneratorComponent,
    FileUploaderComponent,
    KeyValueDisplayComponent,
    ArrayEditorComponent,
    JsonEditorComponent,
    DialogKeyValueDisplayComponent,
    CkeditorComponent,
    FormEditorComponent,
    ReactiveFormsModule,
    FormsModule,
    EditImageComponent,
    SearchWidgetComponent,
    DashboardTileComponent,
    GhanaMapComponent,
    SelectLicenseTypeComponent,
    FilterEmptyValuesPipe,
    ErrorMessageComponent,
    PrintTableComponent,
    FieldTemplateDirective,
    ChartComponent,
    AddGuestUserComponent,
    TableComponent,
    SectionContainerComponent,
    SubSectionContainerComponent,
    EmailFormComponent,
    AlertComponent,
    UploadableCkeditorInputComponent,
    StringArrayInputComponent,
    FilterObjectsPipe,
    TemplateDesignerComponent,
    FilterByPermissionsPipe,
    SecureImageComponent,
    ApplicationTimelineComponent,
    DataLoaderComponent
  ],
  providers: [
    ClipboardCopyDirective
  ]
})
export class SharedModule { }
