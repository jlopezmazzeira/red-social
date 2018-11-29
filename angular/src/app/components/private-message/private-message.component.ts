import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { MessageService } from '../../services/message/message.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.css']
})
export class PrivateMessageComponent implements OnInit {

  public sectionTitle = 'Private Messaging';
  public sectionMessage;
  public errorMessage;
  public status;
  public loading;
  public token;
  public identity;
  public messages;
  public type;
  public pages;
  public page_actual;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;

  constructor(private _us: UserService,
              private _ms: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    this.token = this._us.getToken();
    this.identity = this._us.getIdentity();
    this.route.params.subscribe(
      params => {
        let page = +params["page"];
        let type = params["type"];
        this.type = type;

        if(!page){
          page = 1;
        }

        if(this.type == 'sended'){
          this.sectionMessage = 'Sended messages';
          this.getMessagesSended(page);
        }

    });
  }

  getMessagesSended(page){
    this._ms.sended_message(this.token, page).subscribe(
      response => {
        this.status = response.status;
        if(this.status == "success"){
          this.messages = response.data;
          this.total_items = response.total_items_count;
          this.loading = 'hide';
          this.pages = [];
          this.total_pages = response.total_pages;

          for(let i = 0; i < response.total_pages; i++){
            this.pages.push(i);
          }

          if(page >= 2){
            this.pagePrev = (page - 1);
          } else {
            this.pagePrev = page;
          }

          if(page < response.total_pages || page == 1){
            this.pageNext = this.total_pages;
          } else {
            this.pageNext = page;
          }
          console.log(this.messages);
          this.loading = 'hide';
        }
      },
      error => {
        this.errorMessage = <any>error;
        if(this.errorMessage != null){
          console.log(this.errorMessage);
          this.loading = 'hide';
          alert('Error en la petición');
        }
      }
    );
  }

}
