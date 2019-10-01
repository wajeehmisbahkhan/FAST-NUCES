import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ViewTableComponent } from './view-table/view-table.component';
import { EditComponent } from './edit/edit.component';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewTableComponent, EditComponent],
  imports: [CommonModule, IonicModule, FormsModule, PipesModule],
  exports: [ViewTableComponent, EditComponent],
  entryComponents: [EditComponent]
})
export class CrudModule {}
