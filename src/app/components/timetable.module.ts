import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AdminInputFormatModule } from '../pipes/admin-input-format/admin-input-format.module';
import { PublishComponent } from './publish/publish.component';
import { SwapperComponent } from './swapper/swapper.component';

@NgModule({
  declarations: [ScheduleComponent, PublishComponent, SwapperComponent],
  exports: [ScheduleComponent],
  imports: [CommonModule, IonicModule, FormsModule, AdminInputFormatModule]
})
export class TimetableModule {}
