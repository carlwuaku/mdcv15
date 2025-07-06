import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { ExaminationObject } from '../../models/examination.model';
import { ExaminationService } from '../../examination.service';

@Component({
  selector: 'app-examinations-list',
  templateUrl: './examinations-list.component.html',
  styleUrls: ['./examinations-list.component.scss']
})
export class ExaminationsListComponent {
  @Input() can_edit: boolean = false;
  @Input() can_delete: boolean = false;


  @Input() url: string = "";
  @Input() ts: string = "";
  @Input() providerUuid: string = "";
  destroy$: Subject<boolean> = new Subject();
  @Input() filters: IFormGenerator[] = [];

  selectedItems: ExaminationObject[] = [];
  @Output() onFilterSubmitted: EventEmitter<Record<string, any>> = new EventEmitter<Record<string, any>>();
  /**
   * @constructor
   *
   * @param examService ExaminationService instance
   * @param appService AppService instance
   * @param notify NotifyService instance
   * @param authService AuthService instance
   * @param ar ActivatedRoute instance
   * @param router Router instance
   *
   * Constructor for ExaminationsListComponent.
   *
   * Sets can_edit and can_delete properties based on the user's permissions.
   * Sets year property to the current year.
   */
  constructor(private examService: ExaminationService,
    private notify: NotifyService) {

  }


  getActions = (object: ExaminationObject): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "View/Manage", type: "link", link: `examinations/details`, linkProp: 'uuid' },
      { label: "Edit", type: "link", link: `examinations/edit`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: ExaminationObject) => this.delete(object) }
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: ExaminationObject[]): void {
    this.selectedItems = objects;
  }
  specialClasses: Record<string, string> = {};


  ngOnInit(): void {



  }





  delete(object: ExaminationObject) {
    if (!window.confirm('Are you sure you want to delete this CPD topic? You will not be able to restore it. Note that you cannot delete a topic with associated CPD attendance')) {
      return;
    }
    this.examService.deleteExamination(object).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  filterSubmitted = (params: string) => {

    //split the params by & and then by =
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });
    this.onFilterSubmitted.emit(paramsObject);

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
