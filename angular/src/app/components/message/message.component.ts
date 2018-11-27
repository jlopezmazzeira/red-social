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
  public sectionMessageNew = 'Send a new private message';
  public sectionMessageReceived = 'Received messages';
  public sectionMessageSent ='Sent messages';
  public errorMessage;
  public status;
  public loading;
  public token;
  public identity;
  public following;
  public documentToUpload: Array<File> = [];
  public imageToUpload: Array<File> = [];
  public message;
  public resultUpload;

  constructor(private _us: UserService,
              private _fs: FollowService,
              private _ms: MessageService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'hide';
    this.token = this._us.getToken();
    this.identity = this._us.getIdentity();
    this.message = new Message(1, 0,"", "", "", 0);
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

}
