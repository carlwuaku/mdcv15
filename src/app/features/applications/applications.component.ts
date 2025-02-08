import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApplicationTemplateObject } from 'src/app/shared/types/application-template.model';
import { ApplicationsService } from './applications.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
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
  title: string = "";
  constructor(ar: ActivatedRoute, private applicationsService: ApplicationsService, private sanitizer: DomSanitizer) {
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
    this.applicationsService.getTemplate(this.id).subscribe({
      next: response => {
        this.loading = false;
        this.data = response.data;
        this.header = this.sanitizer.bypassSecurityTrustHtml(this.data.header);
        this.footer = this.sanitizer.bypassSecurityTrustHtml(this.data.footer);
        this.on_submit_email = this.sanitizer.bypassSecurityTrustHtml(this.data.on_submit_email);
        this.on_submit_message = this.sanitizer.bypassSecurityTrustHtml(this.data.on_submit_message);
        this.guidelines = this.sanitizer.bypassSecurityTrustHtml(this.data.guidelines);
        this.title = response.data.form_name
      },
      error: error => {
        this.loading = false;
        this.data = null;
      }
    })
  }

}
