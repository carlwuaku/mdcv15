import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfig } from "./dialog-config.model";

/*
  Re-usable dialog component

  Usage:

    Add the following imports:

      import { MatDialog } from '@angular/material';
      import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

    Then add the following to open the dialog:

      const dlg = this.dialog.open(DialogComponent, {
        data: { title: 'Save', message: 'Do you want to save?', icon: 'warning', primaryButton: 'Yes', secondaryButton: 'No',
          closeOnTimer: false }
      });

    If want to close on a timer, add the following:
      const timeout = 2000;
      dlg.afterOpened().subscribe(_ => {
        setTimeout(() => {
          dlg.close();
        }, timeout)
      })

    Then to subscribe to the dialog's result:

      dlg.afterClosed().subscribe((result: boolean) => {
        console.log(result);
      });

  Config:
    title: The dialog heading.
    message: The main text.
    icon (Optional): The name of the ng-material icon to display. Icon is omitted if null. Popular values are 'done', 'warning' and 'error'
    primaryButton (Optional): The text for the primary button, defaults to 'OK' if omitted.
    secondaryButton (Optional): The text for an optional secondary button. Secondary button is omitted if null.
    closeOnTimer (Optional): If you do not want to show the primary or secondard buttons and close on a timer instead.

  Result:
      The boolean result returned by subscribing to afterClose() is either true if the primary button is clicked,
      false if the secondary button is clicked, or undefined if outside of the dialog is clicked.
*/
@Component({
    selector: "loxam-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
    standalone: false
})
export class DialogComponent {
    closeOnTimer: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public config: DialogConfig) { }

    ngOnInit() {
        this.closeOnTimer = this.config.closeOnTimer ?? true;
    }

    public updateConfig(config: DialogConfig) {
        this.config = config;
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
