import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { FormGeneratorComponentInterface } from 'src/app/shared/types/FormGeneratorComponentInterface';
import { goBackHome } from 'src/app/shared/utils/helper';
import { ExaminationService } from '../../examination.service';
import { ExaminationLetterObject } from '../../models/examination-letter.model';
import { AppService } from 'src/app/app.service';
import { ExaminationObject } from '../../models/examination.model';

@Component({
  selector: 'app-examination-form',
  templateUrl: './examination-form.component.html',
  styleUrls: ['./examination-form.component.scss']
})
export class ExaminationFormComponent implements OnInit, FormGeneratorComponentInterface, OnDestroy {
  public id: string | undefined = undefined;
  public licenseType: string | undefined = undefined;
  public title: string = "";
  public existingUrl: string = "";
  public fields: (IFormGenerator | IFormGenerator[])[] = [];
  public extraFormData: { key: string, value: any }[] = []
  public formUrl: string = "examinations/details"
  public loaded: boolean = false;
  destroy$: Subject<boolean> = new Subject();
  queryParams: { [key: string]: string } = {};
  public letters: ExaminationLetterObject[] = [];
  public initialLetters: ExaminationLetterObject[] = [];
  constructor(private service: ExaminationService, private ar: ActivatedRoute, private appService: AppService, private router: Router, private notify: NotifyService) {
    this.id = ar.snapshot.params['id'];

    if (this.id) {

      this.title = `Edit exam details`;
      this.existingUrl = `examinations/details/${this.id}`;
      this.formUrl = `examinations/details/${this.id}`;
      this.extraFormData = [{ key: "uuid", value: this.id }]
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  ngOnInit(): void {

    this.loaded = false;
    this.getFormFields()
    //if no letters are provided, initialize with the default types from app settings
    if (!this.id) {
      this.appService.appSettings.pipe(takeUntil(this.destroy$)).subscribe(settings => {
        if (settings?.examinations?.defaultLetterTypes) {
          this.letters = settings.examinations.defaultLetterTypes.map(letterType => {
            const letterObject: ExaminationLetterObject = {
              type: letterType.type,
              name: letterType.name,
              content: '',
              criteria: []
            }
            letterType.criteria.forEach(criteria => {
              letterObject.criteria?.push({
                field: criteria.field,
                value: criteria.value
              });
            }
            );
            return letterObject;


          });
          this.extraFormData.push({ key: 'letters', value: this.letters });
        }
      });
    }

  }

  formSubmitted(args: boolean) {
    if (args) {
      this.router.navigate(['/examinations'])
    }
    else {
      this.notify.failNotification("Failed to save license")
    }
  }
  getFormFields() {
    this.service.getExaminationFormFields().subscribe(
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

  onLettersChange(letters: ExaminationLetterObject[]) {
    this.letters = letters;
    // Update extraFormData to include letters
    console.log("Updated letters:", letters);
    const lettersData = this.extraFormData.find(item => item.key === 'letters');
    if (lettersData) {
      lettersData.value = letters;
    } else {
      this.extraFormData.push({ key: 'letters', value: letters });
    }
  }

  submitForm(fields: IFormGenerator[]) {
    // Prepare the form data to be submitted
    const formData: Record<string, any> = {};
    fields.forEach(field => {

      formData[field.name] = field.value;

    });
    //there has to be at least one of each letter type (registration, pass, fail) with an empty criteria array
    const letterTypes: Record<string, boolean> = { 'registration': false, 'pass': false, 'fail': false };
    //make sure the letters all have content
    for (let i = 0; i < this.letters.length; i++) {
      const letter = this.letters[i];
      if (!letterTypes[letter.type] && letter.criteria && letter.criteria.length === 0) {
        letterTypes[letter.type] = true;
      }
      if (!this.letters[i].content) {
        this.notify.failNotification(`Letter ${this.letters[i].name} must have content`);
        return;
      }
    }
    for (let i = 0; i < Object.keys(letterTypes).length; i++) {
      const type = Object.keys(letterTypes)[i];
      if (!letterTypes[type]) {
        this.notify.failNotification(`At least one letter of type ${type} must be provided with no criteria`);
        return;
      }
    }
    // Object.keys(letterTypes).forEach(type => {
    //   if (!letterTypes[type]) {
    //     this.notify.failNotification(`At least one letter of type ${type} must be provided with no criteria`);
    //     return;
    //   }
    // });
    // Add letters to the form data
    formData['letters'] = this.letters;

    // Call the service to submit the form
    this.service.submitExaminationForm(formData, this.id).subscribe({
      next: () => {
        this.notify.successNotification("Examination details saved successfully");
        this.router.navigate(['/examinations']);
      },
      error: (err) => {
        console.error(err);
        this.notify.failNotification("Failed to save examination details");
      }
    });

  }

  setLetters(exam: ExaminationObject) {
    console.log("Setting letters for exam:", exam);
    this.letters = exam.letters || [];
    this.initialLetters = exam.letters || [];
  }
}
