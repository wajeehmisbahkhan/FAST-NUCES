import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelToTitleCasePipe } from './letter-case/camel-to-title-case.pipe';
import { TeacherPipe } from './admin-input-format/teacher.pipe';
import { CoursePipe } from './admin-input-format/course.pipe';
import { SectionPipe } from './admin-input-format/section.pipe';

@NgModule({
  declarations: [CamelToTitleCasePipe, TeacherPipe, CoursePipe, SectionPipe],
  imports: [CommonModule],
  exports: [CamelToTitleCasePipe, TeacherPipe, CoursePipe, SectionPipe]
})
export class PipesModule {}
