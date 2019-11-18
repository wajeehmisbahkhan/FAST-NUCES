import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ViewTableComponent } from './view-table/view-table.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule } from '@angular/forms';
import { SlotsPickerModule } from './slots-picker.module';
import { AdminInputFormatModule } from '../pipes/admin-input-format/admin-input-format.module';
import { LetterCaseModule } from '../pipes/letter-case/letter-case.module';

@NgModule({
  declarations: [ViewTableComponent, EditComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AdminInputFormatModule,
    LetterCaseModule,
    SlotsPickerModule
  ],
  exports: [ViewTableComponent, EditComponent],
  entryComponents: [EditComponent]
})
export class CrudModule {}
