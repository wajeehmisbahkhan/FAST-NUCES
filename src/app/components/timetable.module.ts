import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AdminInputFormatModule } from '../pipes/admin-input-format/admin-input-format.module';
import { PublishComponent } from './publish/publish.component';

@NgModule({
  declarations: [ScheduleComponent, PublishComponent],
  exports: [ScheduleComponent, PublishComponent],
  imports: [CommonModule, IonicModule, FormsModule, AdminInputFormatModule],
  entryComponents: [PublishComponent]
})
export class TimetableModule {}
