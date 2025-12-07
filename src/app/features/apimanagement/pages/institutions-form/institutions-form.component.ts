import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-institutions-form',
  templateUrl: './institutions-form.component.html',
  styleUrls: ['./institutions-form.component.scss']
})
export class InstitutionsFormComponent implements OnInit, FormGeneratorComponentInterface {
  id?: string;
  formUrl: string = 'api-integration/institutions';
  existingUrl: string = 'api-integration/institutions';
  extraFormData: { key: string, value: any }[] = [];
  fields: IFormGenerator[] = [];
  autoGenerateFields: boolean = true;
  autoGenerateFieldsUrl: string = 'api-integration/institutions/form-fields';

  constructor(
    private ar: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.ar.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id) {
      this.existingUrl = `api-integration/institutions/${this.id}`;
      this.formUrl = `api-integration/institutions/${this.id}`;
      this.extraFormData = [{ key: 'id', value: this.id }];
    }
  }

  formSubmitted(args: boolean): void {
    if (args) {
      this.router.navigate(['/apimanagement/institutions']);
    }
  }
}
