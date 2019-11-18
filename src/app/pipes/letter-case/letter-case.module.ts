import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CamelToTitleCasePipe } from './camel-to-title-case.pipe';

@NgModule({
  declarations: [CamelToTitleCasePipe],
  imports: [CommonModule],
  exports: [CamelToTitleCasePipe]
})
export class LetterCaseModule {}
