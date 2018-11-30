import { Component, OnInit  } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from './services/user/user.service';
import { NotificationService } from './services/notification/notification.service';
import { MessageService } from './services/message/message.service';
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
  public total_notifications = 0;
  public total_messages = 0;
  public status;
  public errorMessage;

  constructor(private _us: UserService,
              private _ns: NotificationService,
              private _ms: MessageService,
              private route: ActivatedRoute,
              private router: Router){
  }

  ngOnInit() {
    this.identity = this._us.getIdentity();
    this.token = this._us.getToken();
    this.url_avatar = GLOBAL.url_avatar;
    if(this.identity){
      this.notifications();
      this.messages();
      setInterval(() => {
        this.notifications();
        this.messages();
      }, 3000);
    }
  }

  search(){
    if(this.search_string != null){
      this.router.navigate(['/search', this.search_string]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  notifications(){
    this._ns.notifications(this.token).subscribe(
      response => {
        this.status = response.status;
        if(this.status == 'success'){
          let notifications = response.data
          this.total_notifications = notifications.length;
        }
      },
      error => {
        this.errorMessage = <any>error;
            if(this.errorMessage != null){
              console.log(this.errorMessage);
              alert('Error en la petición');
            }
      }
    );
  }

  messages(){
    this._ms.notreaded_message(this.token).subscribe(
      response => {
        this.status = response.status;
        if(this.status == 'success'){
          this.total_messages = response.data;
        }
      },
      error => {
        this.errorMessage = <any>error;
            if(this.errorMessage != null){
              console.log(this.errorMessage);
              alert('Error en la petición');
            }
      }
    );
  }

}
