import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'like'
})
export class LikePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
