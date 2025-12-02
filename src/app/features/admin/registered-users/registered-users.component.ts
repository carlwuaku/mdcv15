import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { getToday } from 'src/app/shared/utils/dates';
import { GuestsService, Guest } from '../services/guests.service';

interface RegisteredUser extends Guest {
  user_uuid?: string | null;
}

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.component.html',
  styleUrls: ['./registered-users.component.scss']
})
export class RegisteredUsersComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  queryParams: { [key: string]: string } = {};
  selectedUsers: RegisteredUser[] = [];

  constructor(
    private guestsService: GuestsService,
    private notify: NotifyService,
    private ar: ActivatedRoute,
    private router: Router
  ) {
    this.updateTimestampEvent.subscribe(() => {
      this.updateTimestamp();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.ar.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.queryParams = params;
        this.updateUrl();
      });
  }

  updateUrl() {
    this.url = `${this.baseUrl}?` + Object.entries(this.queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  }

  updateTimestampEvent: EventEmitter<void> = new EventEmitter();

  columnDefs = [
    {
      headerName: '#',
      valueGetter: "node.rowIndex + 1",
      width: 80,
      checkboxSelection: true,
      headerCheckboxSelection: true
    },
    {
      headerName: 'Unique ID',
      field: 'unique_id',
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: 'First Name',
      field: 'first_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Last Name',
      field: 'last_name',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Email',
      field: 'email',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Phone',
      field: 'phone',
      sortable: true,
      filter: true
    },
    {
      headerName: 'ID Type',
      field: 'id_type',
      sortable: true,
      filter: true
    },
    {
      headerName: 'ID Number',
      field: 'id_number',
      sortable: true,
      filter: true
    },
    {
      headerName: 'Email Verified',
      field: 'email_verified',
      sortable: true,
      filter: true,
      valueFormatter: (params: any) => params.value ? 'Yes' : 'No'
    },
    {
      headerName: 'Verified',
      field: 'verified',
      sortable: true,
      filter: true,
      valueFormatter: (params: any) => params.value ? 'Yes' : 'No'
    },
    {
      headerName: 'Created At',
      field: 'created_at',
      sortable: true,
      filter: true
    }
  ];

  baseUrl: string = "admin/guests";
  url: string = "admin/guests";
  ts: string = "";

  getActions = (user: RegisteredUser): DataActionsButton[] => {
    const actions: DataActionsButton[] = [];

    if (!user.verified) {
      actions.push({
        label: "Verify User",
        type: "button",
        onClick: (user: RegisteredUser) => this.verifySingleUser(user)
      });
    } else {
      actions.push({
        label: "Unverify User",
        type: "button",
        onClick: (user: RegisteredUser) => this.unverifySingleUser(user)
      });
    }

    actions.push({
      label: "Delete",
      type: "button",
      onClick: (user: RegisteredUser) => this.deleteUser(user)
    });

    return actions;
  }

  updateTimestamp() {
    this.ts = getToday("timestamp_string");
  }

  setSelectedItems(users: RegisteredUser[]) {
    this.selectedUsers = users;
  }

  verifySingleUser(user: RegisteredUser) {
    if (!window.confirm(`Are you sure you want to verify ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    this.guestsService.verifyGuests([user.uuid]).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: () => {
        this.notify.failNotification('Failed to verify user');
      }
    });
  }

  unverifySingleUser(user: RegisteredUser) {
    if (!window.confirm(`Are you sure you want to unverify ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    this.guestsService.unverifyGuests([user.uuid]).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: () => {
        this.notify.failNotification('Failed to unverify user');
      }
    });
  }

  deleteUser(user: RegisteredUser) {
    if (!window.confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`)) {
      return;
    }

    this.guestsService.deleteGuest(user.uuid).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
      },
      error: () => {
        this.notify.failNotification('Failed to delete user');
      }
    });
  }

  verifySelectedUsers() {
    if (this.selectedUsers.length === 0) {
      this.notify.failNotification('Please select users to verify');
      return;
    }

    if (!window.confirm(`Are you sure you want to verify ${this.selectedUsers.length} user(s)?`)) {
      return;
    }

    const uuids = this.selectedUsers.map(user => user.uuid);

    this.guestsService.verifyGuests(uuids).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
        this.selectedUsers = [];
      },
      error: () => {
        this.notify.failNotification('Failed to verify users');
      }
    });
  }

  unverifySelectedUsers() {
    if (this.selectedUsers.length === 0) {
      this.notify.failNotification('Please select users to unverify');
      return;
    }

    if (!window.confirm(`Are you sure you want to unverify ${this.selectedUsers.length} user(s)?`)) {
      return;
    }

    const uuids = this.selectedUsers.map(user => user.uuid);

    this.guestsService.unverifyGuests(uuids).subscribe({
      next: (response) => {
        this.notify.successNotification(response.message);
        this.updateTimestamp();
        this.selectedUsers = [];
      },
      error: () => {
        this.notify.failNotification('Failed to unverify users');
      }
    });
  }

  filterSubmitted = (params: string) => {
    const paramsArray = params.split("&");
    const paramsObject: { [key: string]: string } = {};
    paramsArray.forEach(param => {
      const [key, value] = param.split("=");
      paramsObject[key] = value;
    });

    this.ts = getToday("timestamp_string");
    paramsObject['ts'] = this.ts;

    this.router.navigate([], { queryParams: paramsObject, relativeTo: this.ar });
  }
}
