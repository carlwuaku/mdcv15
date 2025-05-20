import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/core/services/http/http.service';
import { Subject, takeUntil } from 'rxjs';
import { getLabel, openHtmlInNewWindow } from '../../utils/helper';
import { Template } from '../print-table/Template.model';
import { Router } from '@angular/router';
/**
 * This component is used to send emails to a objects. for each object, we use the label and emailField inputs to get their
 * labels and email fields respectively. if it doesn't or the email field is
 * not a valid email it will be ignored. The message template can be selected from the templates in the database or typed in by the
 * user. once a template is selected the user can edit it. whatever is in the template editor is what will be used. the selected template
 * is only used to populate the template editor. if the user changes the template, the user will be warned that the contents of the
 * template editor will be overwritten. once done editing the template the user will be sent to the email page, with the data passed
 * via the router. the message can still be edited in the email page.
 */
@Component({
  selector: 'app-prep-messaging',
  templateUrl: './prep-messaging.component.html',
  styleUrls: ['./prep-messaging.component.scss']
})
export class PrepMessagingComponent implements OnChanges, OnDestroy {
  @Input() objects: any[] = [];
  @Input() exclusion_keys = ['id', 'created_by', 'modified_on', 'deleted', 'deleted_by', 'password_hash', 'last_ip'];
  @Input() templateId: string | null = null;
  @Input() showTemplateSelection: boolean = true;
  @Input() showExport: boolean = true;
  @Input() labelField: string = "name";//this can be a comma-separated list of properties
  @Input() emailField: string = "email";
  @Input() showButton: boolean = true;
  templates: Template[] = [];
  destroy$: Subject<boolean> = new Subject();
  selectedTemplate: Template | null = null;
  @ViewChild('emailDialog') emailDialog!: TemplateRef<any>;
  templateVariables: string[] = [];
  getLabel = getLabel;
  mailList: { name: string, email: string }[] = [];
  mailMessage: string = "";
  selectedTemplateId: string = "";
  existingData: Record<string, any> = {};
  constructor(private dialog: MatDialog, private router: Router) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['objects']?.currentValue !== changes['objects']?.previousValue) {
      this.prepMailList();

    }
  }

  public setRecipientEmailsFromMailList() {
    const emails = this.mailList.map((item) => item.email).filter((email) => email !== "").join(';');
    this.setExistingDataValue('receiver', emails);
  }

  public prepMailList() {
    this.mailList = this.objects.map((object) => {
      const email = this.getObjectEmail(object);
      const name = this.getLabel(object, this.labelField);
      return { name, email };
    });
    this.setRecipientEmailsFromMailList();
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  templatesLoaded(templates: Template[]) {
    this.templates = templates;
    if (this.templateId) {
      this.selectedTemplate = this.templates.find(t => t.uuid === this.templateId) || null;
      this.mailMessage = this.selectedTemplate?.template_content || "";
      this.templateVariables = this.selectedTemplate?.template_content.match(/(\[\w+\])/g) || [];
    }
    else {
      this.selectedTemplate = null;
      this.mailMessage = "";
      this.templateVariables = [];
    }
  }


  openDialog() {
    this.dialog.open(this.emailDialog, {
      data: { objects: this.objects, templateId: this.templateId },
      width: '90%',
      maxHeight: '90%',

    });
  }

  onTemplateChange(event: string) {
    this.selectedTemplate = this.templates.find(t => t.template_name === event) || null;
    //get the variables from the template. these are underscore_separated words wrapped in square brackets
    this.templateVariables = this.selectedTemplate?.template_content.match(/(\[\w+\])/g) || [];
    this.mailMessage = this.selectedTemplate?.template_content || "";
    this.setExistingDataValue('message', this.mailMessage)
  }

  goToEmailPage() {
    const emails = this.mailList.map((item) => item.email).filter((email) => email !== "").join(';');
    this.router.navigate(['/messaging', 'send_email'], {
      state: { data: { message: this.mailMessage, receiver: emails } }
    });
  }

  getObjectEmail(object: any): string {
    const email = this.emailField.split(',').map((field) => {
      return object[field.trim()];
    }).join(',');
    return email;
  }

  setExistingData(data: Record<string, any>) {
    this.existingData = data;
  }

  setExistingDataValue(key: string, value: any) {
    this.existingData[key] = value;
    this.existingData = { ...this.existingData };
  }
}
