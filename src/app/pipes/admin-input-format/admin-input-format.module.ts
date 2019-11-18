import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherPipe } from './teacher.pipe';
import { CoursePipe } from './course.pipe';
import { SectionPipe } from './section.pipe';

@NgModule({
  declarations: [TeacherPipe, CoursePipe, SectionPipe],
  imports: [CommonModule],
  exports: [TeacherPipe, CoursePipe, SectionPipe]
})
export class AdminInputFormatModule {}
