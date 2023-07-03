import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-support',
  templateUrl: './contact-support.component.html',
  styleUrls: ['./contact-support.component.scss']
})
export class ContactSupportComponent {
  @Input() message: string = "";
  visible: boolean = false; 

  constructor(    
    private translationService: TranslateService,
    private dialog: MatDialog){}


  showDialog() {
    this.visible = true;
  }

  contactDialog() {
    
    let message:string = this.translationService.instant(
      `Unfornately we cannot complete your order due to a problem we encountered. Please contact us for further information. [insert contact details]`
    );
    let title:string = this.translationService.instant(`Contact support`);

    const dlg = this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
        icon: "",
        closeOnTimer: false
      }
    });
  }
}
