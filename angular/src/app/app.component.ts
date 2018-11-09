import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';
  public identity;
  public token;

  constructor(private _us: UserService,
              private route: ActivatedRoute,
              private router: Router){
  }

  ngOnInit() {
    this.identity = this._us.getIdentity();
    this.token = this._us.getToken();
  }

}
