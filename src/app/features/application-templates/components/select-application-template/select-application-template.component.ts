import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApplicationTemplateObject } from '../../../../shared/types/application-template.model';
import { ApplicationTemplatesService } from '../../application-templates.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
    selector: 'app-select-application-template',
    templateUrl: './select-application-template.component.html',
    styleUrls: ['./select-application-template.component.scss'],
    standalone: false
})
export class SelectApplicationTemplateComponent implements OnInit {
  formTypes: ApplicationTemplateObject[] = [];
  @Input() formType: string = "";
  @Output() onFormTypeSelected: EventEmitter<ApplicationTemplateObject> = new EventEmitter();
  constructor(private templatesService: ApplicationTemplatesService, private ar: ActivatedRoute, private router: Router) {
  }
  ngOnInit(): void {
    this.templatesService.getApplicationFormTypes().pipe(take(1)).subscribe(data => {
      this.formTypes = data.data;
    })
  }
  formTypeSelected() {
    this.onFormTypeSelected.emit(this.formTypes.find(form => form.form_name === this.formType));
  }
}
