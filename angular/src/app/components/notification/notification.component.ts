import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { NotificationService } from '../../services/notification/notification.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  public sectionTitle = 'Notifications';
  public identity;
  public token;
  public url_avatar;
  public search_string: string;
  public notifications;
  public status;
  public errorMessage;

  constructor(private _us: UserService,
              private _ns: NotificationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.identity = this._us.getIdentity();
    if(!this.identity){
      this.router.navigate(["/login"]);
    }
    this.token = this._us.getToken();
    this.url_avatar = GLOBAL.url_avatar;
    this.listNotifications();
  }

  listNotifications(){
    this._ns.list_notifications(this.token).subscribe(
      response => {
        this.status = response.status;
        if(this.status == 'success'){
          this.notifications = response.notification;
          console.log(this.notifications);
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
