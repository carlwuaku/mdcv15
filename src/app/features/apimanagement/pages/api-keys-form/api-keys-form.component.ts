import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';

@Component({
  selector: 'app-api-keys-form',
  templateUrl: './api-keys-form.component.html',
  styleUrls: ['./api-keys-form.component.scss']
})
export class ApiKeysFormComponent implements OnInit, FormGeneratorComponentInterface {
  id?: string;
  formUrl: string = 'api-integration/api-keys';
  existingUrl: string = 'api-integration/api-keys';
  extraFormData: { key: string, value: any }[] = [];
  fields: IFormGenerator[] = [];
  autoGenerateFields: boolean = true;
  autoGenerateFieldsUrl: string = 'api-integration/api-keys/form-fields';
  createdKeySecret?: string;
  createdHmacSecret?: string;
  showSecretWarning: boolean = false;

  constructor(
    private ar: ActivatedRoute,
    private router: Router
  ) {
    this.id = this.ar.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.id) {
      this.existingUrl = `api-integration/api-keys/${this.id}`;
      this.formUrl = `api-integration/api-keys/${this.id}`;
      this.extraFormData = [{ key: 'id', value: this.id }];
    }
  }

  formSubmitted(response: any): void {
    if (response && typeof response === 'object' && response.data) {
      // New API key created - show the secrets
      if (response.data.key_secret && response.data.hmac_secret_plaintext) {
        this.createdKeySecret = response.data.key_secret;
        this.createdHmacSecret = response.data.hmac_secret_plaintext;
        this.showSecretWarning = true;
      } else {
        // Updated existing key
        this.router.navigate(['/apimanagement/api-keys']);
      }
    } else if (response === true) {
      // Generic success
      this.router.navigate(['/apimanagement/api-keys']);
    }
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  closeAndNavigate() {
    this.router.navigate(['/apimanagement/api-keys']);
  }
}
