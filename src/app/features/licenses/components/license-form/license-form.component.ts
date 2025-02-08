import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { goBackHome } from 'src/app/shared/utils/helper';
import { LicensesService } from '../../licenses.service';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';
import { NotifyService } from 'src/app/core/services/notify/notify.service';

@Component({
    selector: 'app-license-form',
    templateUrl: './license-form.component.html',
    styleUrls: ['./license-form.component.scss'],
    standalone: false
})
export class LicenseFormComponent implements OnInit, FormGeneratorComponentInterface {
  public action: string;
  public id: string | undefined = undefined;
  public type: string | undefined = undefined;
  public title: string = "";
  public existingUrl: string = "";
  public fields: (IFormGenerator | IFormGenerator[])[] = [];
  public extraFormData: { key: string, value: any }[] = []
  public formUrl: string = "licenses/details"
  public loaded: boolean = false;
  constructor(private service: LicensesService, ar: ActivatedRoute, private router: Router, private notify: NotifyService) {
    this.id = ar.snapshot.params['id'];
    this.action = ar.snapshot.params['action'];
    this.type = ar.snapshot.params['type'];
    if (this.action === "create") {
      if (!this.type) {
        goBackHome("No license type defined");
        return;
      }
      this.title = `Add new license (${this.type})`;
    }
    else if (this.action === "update") {
      if (!this.id) {
        goBackHome("No license id defined");
        return;
      }
      this.title = `Edit license details`;
      this.existingUrl = `licenses/details/${this.id}`;
      this.formUrl = `licenses/details/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }

  }
  ngOnInit(): void {
    this.loaded = false;
    this.getFormFields(this.type!)

  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/licenses'])
    }
    else {
      this.notify.failNotification("Failed to save license")
    }
  }

  getFormFields(type: string) {
    this.service.getLicenseFormConfig(type).subscribe(
      {
        next: data => {
          this.fields = data.data;
          this.loaded = true;
        },
        error: error => {
          console.error(error);
          this.fields = [];
          this.loaded = true;
        }
      }
    )
  }

}
