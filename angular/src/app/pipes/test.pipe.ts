import { Pipe } from '@angular/core';
import { UserService } from '../services/user/user.service';
import { PublicationService } from '../services/publication/publication.service';

@Pipe({
  name: 'test'
})
export class TestPipe{

  public token;

  constructor(private _us: UserService,
              private _ps: PublicationService) {
    this.token = _us.getToken();
    console.log(this.token);
  }

   transform(value: number): string {
        //this.trackingService.addWordUsed(value);

        return "hola";
    }

}
