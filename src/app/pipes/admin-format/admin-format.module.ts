import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherPipe } from './teacher.pipe';

@NgModule({
  declarations: [TeacherPipe],
  imports: [CommonModule],
  exports: [TeacherPipe]
})
export class AdminFormatModule {}
