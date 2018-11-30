import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Message } from '../../models/message';
import { UserService } from '../../services/user/user.service';
import { FollowService } from '../../services/follow/follow.service';
import { MessageService } from '../../services/message/message.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public sectionTitle = 'Private Messaging';
  public sectionMessageNew ='Sent message';
  public sectionMessage = 'Received messages';
  public errorMessage;
  public status;
  public loading;
  public token;
  public identity;
  public url_avatar;
  public following;
  public documentToUpload: Array<File> = [];
  public imageToUpload: Array<File> = [];
  public message;
  public resultUpload;
  public messages;
  public pages;
  public page_actual;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;
  public url_document;
  public url_image;

  constructor(private _us: UserService,
              private _fs: FollowService,
              private _ms: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'hide';
    this.token = this._us.getToken();
    this.identity = this._us.getIdentity();
    if(!this.identity){
      this.router.navigate(["/login"]);
    }
    this.url_avatar = GLOBAL.url_avatar;
    this.url_document = GLOBAL.url_document;
    this.url_image = GLOBAL.url_image;
    this.message = new Message(1, 0,"", "", "", 0);
    this.getMessagesReceived();
    this.getFollowing();
  }

  onSubmit(){
    this.loading = 'show';
    this._ms.create_message(this.token, ['image', 'file', this.message.text, this.message.receiver], this.imageToUpload, this.documentToUpload).then(
      (result) => {
        this.resultUpload = result;
        this.loading = 'hide';
        this.message.receiver = 0;
        this.message.text = null;
        this.message.image = null;
        this.message.file = null;
      },
      (error) => {
          console.log(error);
          this.loading = 'hide';
      }
    );
  }

  imageChangeEvent(fileInput: any){
    this.imageToUpload = <Array<File>>fileInput.target.files;
  }

  documentChangeEvent(fileInput: any){
    this.documentToUpload = <Array<File>>fileInput.target.files;
  }

  getFollowing(){
    this._fs.following_user(this.identity.nick).subscribe(
      response => {
        this.status = response.status;

        if(this.status == "success"){
          this.following = [];
          for (let following of response.following) {
            this.following.push(following.followed);
          }
        }
      }
    );
  }

  getMessagesReceived(){
    this.route.params.subscribe(
      params => {
        let page = +params["page"];


        if(!page){
          page = 1;
        }

        this._ms.received_message(this.token, page).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success"){
              this.messages = response.data;
              console.log(this.messages);
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
    });
  }

}
