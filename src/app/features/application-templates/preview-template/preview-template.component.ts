import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { ApplicationTemplatesService } from '../application-templates.service';
import { ApplicationTemplateObject } from '../../../shared/types/application-template.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-preview-template',
    templateUrl: './preview-template.component.html',
    styleUrls: ['./preview-template.component.scss'],
    standalone: false
})
export class PreviewTemplateComponent implements OnInit {
  title: string = "Add a new practitioner";
  formUrl: string = "applications/templates";
  existingUrl: string = "applications/templates";

  id: string;
  loading: boolean = false;
  data: ApplicationTemplateObject | null = null;
  header: SafeHtml = "";
  footer: SafeHtml = "";
  on_submit_email: SafeHtml = "";
  on_submit_message: SafeHtml = "";
  guidelines: SafeHtml = "";
  constructor(ar: ActivatedRoute, private templateService: ApplicationTemplatesService, private sanitizer: DomSanitizer) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit application template";
      this.existingUrl = `applications/templates/${this.id}`;
      this.formUrl = `applications/templates/${this.id}`;
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.templateService.getTemplate(this.id).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        this.header = this.sanitizer.bypassSecurityTrustHtml(this.data.header);
        this.footer = this.sanitizer.bypassSecurityTrustHtml(this.data.footer);
        this.on_submit_email = this.sanitizer.bypassSecurityTrustHtml(this.data.on_submit_email);
        this.on_submit_message = this.sanitizer.bypassSecurityTrustHtml(this.data.on_submit_message);
        this.guidelines = this.sanitizer.bypassSecurityTrustHtml(this.data.guidelines);
      },
      error: error => {
        this.loading = false;
        this.data = null;
      }
    })
  }
}
