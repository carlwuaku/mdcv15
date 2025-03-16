import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LoadDataListComponent } from './components/load-data-list/load-data-list.component';
import { FormGeneratorComponent } from './components/form-generator/form-generator.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';

@NgModule({
    declarations: [
        LoadDataListComponent,
        FormGeneratorComponent,
        DialogFormComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatChipsModule,
        MatIconModule
    ],
    exports: [
        LoadDataListComponent,
        FormGeneratorComponent,
        DialogFormComponent
    ]
})
export class MdcComponentsModule { }
