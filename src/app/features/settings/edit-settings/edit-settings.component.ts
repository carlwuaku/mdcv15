import { Component, Inject } from '@angular/core';
import { SettingsObject } from '../models/Settings.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.component.html',
  styleUrls: ['./edit-settings.component.scss']
})
export class EditSettingsComponent {
  public Editor = Editor.Editor;
  constructor(
    public dialogRef: MatDialogRef<EditSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: SettingsObject,
    private dbService: HttpService,
    private notify: NotifyService
    ) {

    }

    // public onReady( editor: DecoupledEditor ): void {
    //   const element = editor.ui.getEditableElement()!;
    //   const parent = element.parentElement!;

    //   parent.insertBefore(
    //     editor.ui.view.toolbar.element!,
    //     element
    //   );
    // }

    closeDialog(): void {
      this.dialogRef.close(false);
  }

  editorValueChanged(args:any){
    console.log(this.setting.value)
  }

  save(){
    this.notify.showLoading();
    const data = {
      "name": `${this.setting.class}.${this.setting.key}`,
      "value": this.setting.value
    };
    this.dbService.put<any>(`admin/settings`, data).pipe(take(1)).subscribe({
      next: data => {
        this.notify.successNotification(data.message);
        this.dialogRef.close(true)
      },
      error: error => {
        this.notify.hideLoading();
      }
    });

  }

}
