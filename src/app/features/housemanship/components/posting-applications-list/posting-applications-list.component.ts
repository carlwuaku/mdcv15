import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { HousemanshipService } from '../../housemanship.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { IFormGenerator } from 'src/app/shared/components/form-generator/form-generator-interface';
import { LoadDataListComponent } from 'src/app/shared/components/load-data-list/load-data-list.component';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { HousemanshipApplication } from '../../models/Housemanship_application.model';
@Component({
  selector: 'app-posting-applications-list',
  templateUrl: './posting-applications-list.component.html',
  styleUrls: ['./posting-applications-list.component.scss']
})
export class PostingApplicationsListComponent {
  @Input() url: string = "";
  ts: string = "";

  destroy$: Subject<boolean> = new Subject();

  selectedItems: HousemanshipApplication[] = [];
  session: string = "1";
  @Output() selectionChanged = new EventEmitter<HousemanshipApplication[]>();
  @Output() filterSubmitted = new EventEmitter<string>();
  constructor(private dbService: HousemanshipService, private notify: NotifyService,
    public dialog: MatDialog, private ar: ActivatedRoute, private appService: AppService,
    private router: Router) {

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void { }


  getActions = (object: HousemanshipApplication): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `housemanship/posting-applications/edit/`, linkProp: 'uuid' },
      { label: "Delete", type: "button", onClick: (object: HousemanshipApplication) => this.delete(object) }
    ];
    return actions;
  }




  delete(object: HousemanshipApplication) {
    if (!window.confirm('Are you sure you want to delete this application?')) {
      return;
    }
    this.dbService.deletePostingApplication(object.uuid).subscribe({
      next: response => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: error => { }
    })
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  setSelectedItems(objects: HousemanshipApplication[]) {
    this.selectedItems = objects;
    this.selectionChanged.emit(objects);

  }


  onFilterSubmitted = (params: string) => {
    this.filterSubmitted.emit(params);
  }
}
