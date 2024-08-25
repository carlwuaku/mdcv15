import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { ApplicationFormService } from '../application-form.service';

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.scss']
})
export class ManageFormComponent {
  title: string = "Application form";
  formUrl: string = "applications/details";
  existingUrl: string = "applications/details";
  fields: (IFormGenerator | IFormGenerator[])[] = [];

  id: string;
  extraFormData: { key: string, value: any }[] = [];
  autoGenerateFields: boolean = true;
  loaded: boolean = false;
  constructor(ar: ActivatedRoute, private router: Router, private service: ApplicationFormService) {
    this.id = ar.snapshot.params['id'];
    if (this.id) {
      this.title = "Edit application";
      this.existingUrl = `applications/details/${this.id}`;
      this.formUrl = `applications/details/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }
  }

  ngOnInit(): void {
    this.loaded = false;
    this.service.getFormTemplateFromApplication(this.id).subscribe(
      {
        next: data => {
          this.fields = data.data['data'];
          this.autoGenerateFields = false;
          this.loaded = true;
        },
        error: error => {
          console.error(error);
          this.fields = [];
          this.autoGenerateFields = true;
          this.loaded = true;
        }
      }
    )
  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/applications'])
    }
  }

}
