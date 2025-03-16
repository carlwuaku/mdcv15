import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Template } from './Template.model';
import { Subject, takeUntil } from 'rxjs';
/**
 * This component is used to print a list of objects. the objects are received from the parent component
 * and the template is selected from the database. a template id may be passed if we only want to have one
 * template available. in that case, the template will be fetched from the database and used to print the table.
 * else all available templates will be fetched and displayed in a dropdown to allow selection of the template.
 */

@Component({
  selector: 'app-print-table',
  templateUrl: './print-table.component.html',
  styleUrls: ['./print-table.component.scss']
})
export class PrintTableComponent implements OnInit, OnDestroy {
  @Input() objects: any[] = [];
  @Input() filename = "download";
  @Input() exclusion_keys = ['id', 'created_by', 'modified_on', 'deleted', 'deleted_by', 'password_hash', 'last_ip'];
  @Input() templateId: string | null = null;
  @Input() showTemplateSelection: boolean = true;
  @Input() showExport: boolean = true;
  templates: Template[] = [];
  destroy$: Subject<boolean> = new Subject();
  selectedTemplateId: string | null = null;
  selectedTemplate: Template | null = null;
  @ViewChild('printDialog') printDialog!: TemplateRef<any>;
  templateVariables: string[] = [];
  constructor(private dbService: HttpService, private dialog: MatDialog) {
  }
  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  print() {
    this.dbService.get<{ data: Template[] }>('print-queue/templates').pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.templates = res.data;
      this.openPrintDialog();
    });
  }

  openPrintDialog() {
    this.dialog.open(this.printDialog, {
      data: { objects: this.objects, templateId: this.templateId },
      width: '90%',
      maxHeight: '90%',

    });
  }

  onTemplateChange(event: any) {
    this.selectedTemplateId = event.value;
    this.selectedTemplate = this.templates.find(t => t.uuid === this.selectedTemplateId) || null;
    //get the variables from the template. these are underscore_separated words wrapped in square brackets
    this.templateVariables = this.selectedTemplate?.template_content.match(/(\[\w+\])/g) || [];
  }

  printSelection() {
    this.dbService.post<{ data: string }>(`print-queue/templates/${this.selectedTemplateId}/print-selection`, { objects: this.objects }).subscribe((res) => {
      const newWindow = window.open('', '', 'width=800,height=600');
      if (newWindow) {
        newWindow.document.write(res.data);
      }
    });
  }

}
