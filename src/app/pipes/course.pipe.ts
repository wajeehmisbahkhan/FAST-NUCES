import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'course'
})
export class CoursePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    return `${value.title} (${value.department})`;
  }
}
