import { Component, Input } from '@angular/core';
import { Template } from '../../shared/components/print-table/Template.model';
import { DataActionsButton } from 'src/app/shared/components/load-data-list/data-actions-button.interface';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-print-templates',
  templateUrl: './print-templates.component.html',
  styleUrls: ['./print-templates.component.scss']
})
export class PrintTemplatesComponent {
  can_edit: boolean = false;
  can_delete: boolean = false;

  baseUrl: string = `print-queue/templates`;
  year: string = "";
  url: string = "";
  @Input() ts: string = "";
  @Input() providerUuid: string = "";

  constructor(private authService: AuthService) {
    if (this.authService.currentUser?.permissions.includes("Edit Print Templates")) {
      this.can_edit = true;
    }
    if (this.authService.currentUser?.permissions.includes("Delete Print Templates")) {
      this.can_delete = true;
    }
    const date = new Date();
    this.year = date.getFullYear().toString();
  }


  getActions = (object: Template): DataActionsButton[] => {
    const actions: DataActionsButton[] = [
      { label: "Edit", type: "link", link: `print-templates/edit`, linkProp: 'uuid' },
    ];

    return actions;
  }
  updateTimestamp(): void {
    this.ts = new Date().getTime().toString();
  }
  setSelectedItems(objects: Template[]): void {
    console.log(objects);
  }
  specialClasses: Record<string, string> = {};


  ngOnInit(): void {
    this.setUrl();
  }

  setUrl(): void {
    this.url = this.baseUrl;

  }
}
