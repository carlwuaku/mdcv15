import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { TrainingInstitutionsService, TrainingInstitution } from '../../training-institutions.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { getMonthsAsKeyValueObjects } from 'src/app/shared/utils/dates';

@Component({
  selector: 'app-institution-form',
  templateUrl: './institution-form.component.html',
  styleUrls: ['./institution-form.component.scss']
})
export class InstitutionFormComponent implements OnInit, OnDestroy {
  uuid: string | null = null;
  title: string = 'Add New Training Institution';
  existingUrl: string = '';
  formUrl: string = 'training-institutions/details';
  fields: (IFormGenerator | IFormGenerator[])[] = [];
  extraFormData: { key: string, value: any }[] = [];
  loaded: boolean = false;
  destroy$: Subject<boolean> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: TrainingInstitutionsService,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.uuid = params['uuid'];

      if (this.uuid && this.uuid !== 'new') {
        this.title = 'Edit Training Institution';
        this.existingUrl = `training-institutions/details/${this.uuid}`;
        this.formUrl = `training-institutions/details/${this.uuid}`;
        this.extraFormData = [{ key: 'uuid', value: this.uuid }];
      }

      this.setupFormFields();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setupFormFields(): void {
    this.fields = [
      {
        name: 'name',
        label: 'Institution Name',
        type: 'text',
        required: true,
        placeholder: 'Enter institution name',
        hint: '',
        options: [],
        value: ''
      },
      {
        name: 'type',
        label: 'Practitioner Type',
        type: 'api',
        required: true,
        placeholder: '',
        hint: '',
        options: [],
        value: '',
        api_url: 'training-institutions/settings/practitioner_types',
        apiKeyProperty: 'value',
        apiLabelProperty: 'key',
        apiType: 'select'
      },
      {
        name: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'Enter location',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'region',
        label: 'Region',
        type: 'api',
        placeholder: 'Enter region',
        hint: '',
        options: [],
        value: '',
        required: false,
        api_url: 'regions/regions',
        apiKeyProperty: 'name',
        apiLabelProperty: 'name',
        apiType: 'select'
      },
      [

      ],
      {
        name: 'district',
        label: 'District',
        type: 'api',
        placeholder: 'Enter district',
        hint: '',
        options: [],
        value: '',
        required: false,
        api_url: 'regions/districts',
        apiKeyProperty: 'district',
        apiLabelProperty: 'district',
        apiType: 'select'
      },
      {
        name: 'category',
        label: 'Category',
        type: 'text',
        placeholder: 'Enter category',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'contact_name',
        label: 'Contact Name',
        type: 'text',
        placeholder: 'Enter contact person name',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'contact_position',
        label: 'Contact Position',
        type: 'text',
        placeholder: 'Enter contact person position',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        placeholder: 'Enter phone number',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Enter email address',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { key: 'Active', value: 'Active' },
          { key: 'Inactive', value: 'Inactive' },
          { key: 'Pending', value: 'Pending' }
        ],
        placeholder: 'Select status',
        hint: '',
        value: '',
        required: false
      },
      {
        name: 'accredited_program',
        label: 'Accredited Program',
        type: 'text',
        placeholder: 'Enter accredited program',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'default_limit',
        label: 'Default Student Limit',
        type: 'number',
        placeholder: 'Enter default student limit',
        hint: '',
        options: [],
        value: '',
        required: false
      },
      {
        name: 'registration_start_month',
        label: 'Registration Start Month',
        type: 'select',
        placeholder: 'Enter start month (1-12)',
        hint: '',
        options: getMonthsAsKeyValueObjects(),
        value: '',
        required: false
      },
      {
        name: 'registration_end_month',
        label: 'Registration End Month',
        type: 'select',
        placeholder: 'Enter end month (1-12)',
        hint: '',
        options: getMonthsAsKeyValueObjects(),
        value: '',
        required: false
      }
    ];

    this.loaded = true;
  }

  formSubmitted(success: boolean): void {
    if (success) {
      this.notify.successNotification('Training institution saved successfully');
      this.router.navigate(['/training-institutions/list']);
    }
  }
}
