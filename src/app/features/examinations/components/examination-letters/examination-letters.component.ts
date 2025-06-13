
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ExaminationLetterObject, ExaminationLetterType, ExaminationLetterCriteriaObject } from '../../models/examination-letter.model';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-examination-letters',
  templateUrl: './examination-letters.component.html',
  styleUrls: ['./examination-letters.component.scss']
})
export class ExaminationLettersComponent implements OnInit, OnDestroy {
  @Input() letters: ExaminationLetterObject[] = [];
  @Output() lettersChange = new EventEmitter<ExaminationLetterObject[]>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  lettersForm: FormGroup;
  letterTypes: ExaminationLetterType[] = ['registration', 'pass', 'fail'];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.lettersForm = this.fb.group({
      letters: this.fb.array([])
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit() {
    this.initializeForm();
  }

  get lettersFormArray(): FormArray {
    return this.lettersForm.get('letters') as FormArray;
  }

  initializeForm() {
    const lettersArray = this.lettersForm.get('letters') as FormArray;
    lettersArray.clear();

    this.letters.forEach(letter => {
      lettersArray.push(this.createLetterFormGroup(letter));
    });

    // Subscribe to form changes to emit updates
    this.lettersForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      console.log('Form changed:', this.lettersForm.value);
      this.emitLettersChange();
    });
  }

  createLetterFormGroup(letter?: ExaminationLetterObject): FormGroup {
    return this.fb.group({
      id: [letter?.id || ''],
      exam_id: [letter?.exam_id || ''],
      name: [letter?.name || '', [Validators.required]],
      type: [letter?.type || 'registration', [Validators.required]],
      content: [letter?.content || '', [Validators.required]],
      created_at: [letter?.created_at || ''],
      criteria: this.fb.array(
        letter?.criteria?.map(c => this.createCriteriaFormGroup(c)) || []
      )
    });
  }

  createCriteriaFormGroup(criteria?: ExaminationLetterCriteriaObject): FormGroup {
    return this.fb.group({
      id: [criteria?.id || ''],
      letter_id: [criteria?.letter_id || ''],
      field: [criteria?.field || '', [Validators.required]],
      value: [criteria?.value || '', [Validators.required]]
    });
  }

  addLetter() {
    const lettersArray = this.lettersFormArray;
    lettersArray.push(this.createLetterFormGroup());
  }

  removeLetter(index: number) {
    const lettersArray = this.lettersFormArray;
    lettersArray.removeAt(index);
    // this.emitLettersChange();
  }

  getCriteriaFormArray(letterIndex: number): FormArray {
    return this.lettersFormArray.at(letterIndex).get('criteria') as FormArray;
  }

  addCriteria(letterIndex: number) {
    const criteriaArray = this.getCriteriaFormArray(letterIndex);
    criteriaArray.push(this.createCriteriaFormGroup());
  }

  removeCriteria(letterIndex: number, criteriaIndex: number) {
    const criteriaArray = this.getCriteriaFormArray(letterIndex);
    criteriaArray.removeAt(criteriaIndex);
  }

  private emitLettersChange() {
    // if (this.lettersForm.valid) {
    const formValue = this.lettersForm.value;
    this.lettersChange.emit(formValue.letters);
    // }
  }

  getLetterTypeDisplayName(type: ExaminationLetterType): string {
    switch (type) {
      case 'registration': return 'Registration';
      case 'pass': return 'Pass';
      case 'fail': return 'Fail';
      default: return type;
    }
  }

  setLetterControlContent(letterIndex: number, content: string) {
    const lettersArray = this.lettersFormArray;
    const letterGroup = lettersArray.at(letterIndex) as FormGroup;
    letterGroup.patchValue({ content: content });
    this.emitLettersChange();
  }
}
