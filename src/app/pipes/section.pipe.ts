import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'section'
})
export class SectionPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return `${value.name} (${value.department}-${value.batch})`;
  }
}
