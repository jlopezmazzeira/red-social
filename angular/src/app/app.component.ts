import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from './services/user/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  public identity;
  public token;
  public url_avatar;
  public search_string: string;

  constructor(private _us: UserService,
              private route: ActivatedRoute,
              private router: Router){
  }

  ngOnInit() {
    this.identity = this._us.getIdentity();
    this.token = this._us.getToken();
    this.url_avatar = GLOBAL.url_avatar;
  }

  search(){
    if(this.search_string != null){
      this.router.navigate(['/search', this.search_string]);
    } else {
      this.router.navigate(['/home']);
    }
  }

}
