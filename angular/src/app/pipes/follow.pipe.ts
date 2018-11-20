import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'follow'
})
export class FollowPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
