import { Pipe, PipeTransform } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

@Pipe({
  name: 'camelToTitleCase'
})
export class CamelToTitleCasePipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let word: string = value;
    for (let i = 0; i < word.length; i++) {
      // Turn upper case to lower and add a space; camelCase = camel case
      if (word[i].toUpperCase() === word[i]) {
        word =
          word.slice(0, i) +
          word[i].toLowerCase() +
          word.slice(i + 1, word.length);
        word = word.slice(0, i) + ' ' + word.slice(i, word.length);
        i += 1;
      }
    }
    return new TitleCasePipe().transform(word);
  }
}
