import { Component, Inject, OnInit } from '@angular/core';
import { SettingsObject } from '../models/Settings.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs';
import { HttpService } from 'src/app/core/services/http/http.service';
import { NotifyService } from 'src/app/core/services/notify/notify.service';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { EditorConfig } from '@ckeditor/ckeditor5-core';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.component.html',
  styleUrls: ['./edit-settings.component.scss']
})
export class EditSettingsComponent  implements OnInit{
  public Editor = Editor.Editor;
  arrayList: any[] = [];
  jsonObject: {[key:string]:any} = {};
  editorConfig:EditorConfig = {
    table: {
      contentToolbar: [
        'tableColumn', 'tableRow', 'mergeTableCells',
        'tableProperties', 'tableCellProperties'
    ]
    },
    mediaEmbed:{
      previewsInData:true,

    }

  }
  constructor(
    public dialogRef: MatDialogRef<EditSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public setting: SettingsObject,
    private dbService: HttpService,
    private notify: NotifyService
    ) {

    }
  ngOnInit(): void {
    if(this.setting.control_type === "list"){
      if(typeof(this.setting.value) === "string"){
        this.arrayList = this.setting.value.split(";");
      }
      else if(Array.isArray(this.setting.value)){
        this.arrayList = this.setting.value;
      }
    }
    else if(this.setting.type === "object"){
      this.setting.control_type = "object";
      if(typeof(this.setting.value) === "string"){
        this.jsonObject =  JSON.parse(this.setting.value);
      }
      else if(typeof this.setting.value === "object" && this.setting.value !== null){
        this.jsonObject = this.setting.value;
      }
    }
  }


    closeDialog(): void {
      this.dialogRef.close(false);
  }

  setValue(args:any){
    this.setting.value = args;
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
