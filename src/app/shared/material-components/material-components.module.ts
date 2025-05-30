import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerComponent } from './mat-datepicker/mat-datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectComponent } from './mat-select/mat-select.component';

const modules = [
  MatDialogModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatListModule,
  MatCheckboxModule,
  MatTabsModule,
  MatTooltipModule,
  MatTreeModule,
  MatInputModule,
  MatStepperModule,
  MatDatepickerModule,
  MatToolbarModule,
  MatSidenavModule,
  MatChipsModule,
  MatProgressBarModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatSelectModule,
];
@NgModule({
  declarations: [
    MatDatepickerComponent,
    MatSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ...modules
  ],
  exports: [
    ...modules,
    MatDatepickerComponent,
    MatSelectComponent
  ]
})
export class MaterialComponentsModule { }
