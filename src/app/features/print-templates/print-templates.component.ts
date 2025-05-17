import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Template } from '../../shared/components/print-table/Template.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintService } from './print.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-print-templates',
  templateUrl: './print-templates.component.html',
  styleUrls: ['./print-templates.component.scss']
})
export class PrintTemplatesComponent {
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `print-queue/templates`;
  year: string = "";
  url: string = "";
  @Input() ts: string = "";
  @Input() providerUuid: string = "";
  @ViewChild('previewTemplate') previewTemplate!: TemplateRef<any>;
  @ViewChild('dataList') dataList!: LoadDataListComponent;
  selectedTemplate: Template | null = null;
  safeTemplateContent: SafeHtml | null = null;
  selectedItems: Template[] = [];
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private printService: PrintService,
    private notify: NotifyService,
    private sanitizer: DomSanitizer
  ) {
    if (this.authService.currentUser?.permissions.includes("Edit Print Templates")) {
      this.can_edit = true;
    }
    if (this.authService.currentUser?.permissions.includes("Delete Print Templates")) {
      this.can_delete = true;
    }
    const date = new Date();
    this.year = date.getFullYear().toString();
  }


  getActions = (object: Template): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `print-templates/edit`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: () => this.deleteTemplate(object.uuid) },
      { label: "Preview", type: "button", onClick: () => this.preview(object) },
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: Template[]): void {

  }
  specialClasses: Record<string, string> = {};


  ngOnInit(): void {
    this.setUrl();
  }

  setUrl(): void {
    this.url = this.baseUrl;

  }

  deleteTemplate(uuid: string): void {
    this.printService.deleteTemplate(uuid).subscribe((res) => {
      this.notify.successNotification("Template deleted successfully");
      this.dataList.reload();
    });
  }

  preview(template: Template): void {
    this.selectedTemplate = template;
    // this.safeTemplateContent = this.sanitizer.bypassSecurityTrustHtml(template.template_content);
    // this.dialog.open(this.previewTemplate);

    //create a new window and load the template content
    const newWindow = window.open('', '', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(template.template_content);
    }
  }


}
