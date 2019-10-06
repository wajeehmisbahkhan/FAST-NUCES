import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelToTitleCasePipe } from './camel-to-title-case.pipe';
import { TeacherPipe } from './teacher.pipe';
import { CoursePipe } from './course.pipe';
import { SectionPipe } from './section.pipe';

@NgModule({
  declarations: [CamelToTitleCasePipe, TeacherPipe, CoursePipe, SectionPipe],
  imports: [CommonModule],
  exports: [CamelToTitleCasePipe, TeacherPipe, CoursePipe, SectionPipe]
})
export class PipesModule {}
