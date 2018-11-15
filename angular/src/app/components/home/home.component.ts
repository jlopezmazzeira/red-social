import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public sectionTitle = 'Timeline';
  public sectionCreatePublication = 'Create Publication';
  public errorMessage;
  public identity;
  public url_avatar;

  constructor(private _us: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    let identity = this._us.getIdentity();
    this.identity = identity;
    this.url_avatar = GLOBAL.url_avatar;
  }

  onSubmit(){
    
  }

}
