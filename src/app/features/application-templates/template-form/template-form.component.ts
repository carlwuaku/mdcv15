import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ApplicationTemplatesService } from '../application-templates.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit{
  title: string = "Add a new practitioner";
  formUrl: string = "applications/templates";
  existingUrl: string = "applications/templates";

  //hold the form fields to pass to the ckeditor and form editor
  fields: (IFormGenerator[] | IFormGenerator)[] = [];
  guidelines: string = "";
  header: string = "";
  footer: string = "";
  on_submit_email: string = "";
  on_submit_message: string = "";

  id: string;
  extraFormData: { key: string, value: any }[] = [];
  generalFormGroup = new FormGroup({
    form_name: new FormControl("", Validators.required),
    open_date: new FormControl("", Validators.required),
    close_date: new FormControl("", Validators.required)
  });

  guidlinesFormGroup = new FormGroup({
    guidelines: new FormControl("", Validators.required),
  });

  dataFormGroup = new FormGroup({
    data: new FormControl("", Validators.required),
  });
  headerFormGroup = new FormGroup({
    header: new FormControl("", Validators.required),
  });
  footerFormGroup = new FormGroup({
    footer: new FormControl("", Validators.required),
  });
  onSubmitFormGroup = new FormGroup({
    on_submit_email: new FormControl("", Validators.required),
    on_submit_message: new FormControl("", Validators.required),
  });
  loading: boolean = false;


  constructor(ar: ActivatedRoute, private router: Router, private notify:NotifyService, private dbService: HttpService,
    private templateService: ApplicationTemplatesService
  ) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit application template";
      this.existingUrl = `applications/templates/${this.id}`;
      this.formUrl = `applications/templates/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }
  }
  ngOnInit(): void {
    if(this.id)
    this.loadData();
  }

  loadData(){
    this.loading = true;
    this.templateService.getTemplate(this.id).subscribe({
      next: response => {
        this.loading = false;
        this.guidelines = response.data.guidelines;
        this.header = response.data.header;
        this.footer = response.data.footer;
        this.on_submit_email = response.data.on_submit_email;
        this.on_submit_message = response.data.on_submit_message;

        this.generalFormGroup.get("form_name")?.setValue(response.data.form_name);
        this.generalFormGroup.get("open_date")?.setValue(response.data.open_date);
        this.generalFormGroup.get("close_date")?.setValue(response.data.close_date);
        this.guidlinesFormGroup.get("guidelines")?.setValue(response.data.guidelines);
        this.fields = response.data.data;
        this.dataFormGroup.get("data")?.setValue(JSON.stringify(response.data.data));
        this.headerFormGroup.get("header")?.setValue(response.data.header);
        this.footerFormGroup.get("footer")?.setValue(response.data.footer);
        this.onSubmitFormGroup.get("on_submit_email")?.setValue(response.data.on_submit_email);
        this.onSubmitFormGroup.get("on_submit_message")?.setValue(response.data.on_submit_message);



      },
      error: error => {
        this.loading = false;
      }
    })
  }

  setFields(fields: (IFormGenerator[] | IFormGenerator)[]) {
    this.fields = fields;
  }

  setFormField(form_name: string, name: string, value: any) {
    let form: FormGroup|null = null;
    switch (form_name) {
      case "general":
        form = this.generalFormGroup;
        break;
      case "guidelines":
        form = this.guidlinesFormGroup;
        break;
      case "data":
        form = this.dataFormGroup;
        value = JSON.stringify(value);
        break;
      case "header":
        form = this.headerFormGroup;
        break;
      case "footer":
        form = this.footerFormGroup;
        break;
      case "on_submit":
        form = this.onSubmitFormGroup;
        break;
    }
    if (form) {
      const formControl = form.get(name);
      formControl?.setValue(value);
    }
  }

  submit(): void {


    const data = new FormData();
    if(this.generalFormGroup.valid){
      if(this.generalFormGroup.get("form_name")?.value){
        data.append("form_name",  this.generalFormGroup.get("form_name")!.value!);
      }

      if(this.generalFormGroup.get("open_date")?.value)
      data.append("open_date", this.generalFormGroup.get("open_date")?.value!);

      if(this.generalFormGroup.get("close_date")?.value)
      data.append("close_date", this.generalFormGroup.get("close_date")?.value!);
    }
    else{
      alert("Please check the form name, open date and close date fields to make sure they were filled correctly")
      return;
    }
    if(this.guidlinesFormGroup.valid){
      if(this.guidlinesFormGroup.get("guidelines")?.value)
      data.append("guidelines", this.guidlinesFormGroup.get("guidelines")?.value!);
    }

      data.append("data", JSON.stringify(this.fields));

    if(this.headerFormGroup.valid){
      if(this.headerFormGroup.get("header")?.value)
      data.append("header", this.headerFormGroup.get("header")?.value!);
    }
    if(this.footerFormGroup.valid){
      if(this.footerFormGroup.get("footer")?.value)
      data.append("footer", this.footerFormGroup.get("footer")?.value!);
    }
    if(this.onSubmitFormGroup.valid){
      if(this.onSubmitFormGroup.get("on_submit_email")?.value)
      data.append("on_submit_email", this.onSubmitFormGroup.get("on_submit_email")?.value!);
      if(this.onSubmitFormGroup.get("on_submit_message")?.value)
      data.append("on_submit_message", this.onSubmitFormGroup.get("on_submit_message")?.value!);
    }
    this.notify.showLoading();
    let dbCall = this.dbService.post<any>(this.formUrl, data)
    if (this.id) {
      data.append("id", this.id)
      dbCall = this.dbService.put<any>(`${this.formUrl}`, data);
    }


    dbCall.pipe(take(1)).subscribe({
      next: data => {
        this.notify.successNotification('Submitted successfully');
        this.notify.hideLoading();
        this.router.navigate(['/application-templates']);
      },
      error: error => {
        this.notify.hideLoading();
        console.log(error);

      }
    });
  }
}
