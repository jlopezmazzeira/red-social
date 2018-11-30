import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Person } from '../../models/person';
import { UserService } from '../../services/user/user.service';
import { UploadService } from '../../services/upload/upload.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  public sectionTitle:string = "Configuration";
  public sectionAvatar:string = "Change your avatar";
  public person: Person;
  public errorMessage;
  public status;
  public identity;
  public newPwd;
  public statusNick;

  constructor(private _us: UserService,
              private _ups: UploadService,
              private route: ActivatedRoute,
              private router: Router) { }

    ngOnInit() {
      let identity = this._us.getIdentity();
      this.identity = identity;

      if(identity == null){
        this.router.navigate(["/login"]);
      } else {

        this.person = new Person(identity.sub,
                                 identity.role,
                                 identity.name,
                                 identity.surname,
                                 identity.nick,
                                 identity.email,
                                 identity.password,
                                 "null",
                                 identity.bio,
                                 "1");
      }
    }

    onSubmit(){
      this.newPwd = this.person.password;
      if(this.person.password == this.identity.password){
        this.person.password = "";
      }

      this._us.update_user(this.person).subscribe(
        response => {
          this.status = response.status;

          if(this.status != "success"){
            this.status = "error";
          } else {
            this.person = response.user;
            localStorage.setItem("identity", JSON.stringify(this.person));
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

    public fileToUpload: Array<File>;
    public resultUpload;
    fileChangeEvent(fileInput: any){
      this.fileToUpload = <Array<File>>fileInput.target.files;

      let token = this._us.getToken();
      let url = GLOBAL.url_upload_avatar;
      this._ups.makeFileRequest(token, url, ['image'], this.fileToUpload).then(
        (result) => {
          this.resultUpload = result;
          this.identity = this.resultUpload.user;
          localStorage.setItem("identity", JSON.stringify(this.identity));
          console.log(this.resultUpload);
        },
        (error) => {
            console.log(error);
        }
      );
    }

    verifyNick(){
      if(this.person.nick != this.identity.nick){
        this._us.verifyNick({nick:this.person.nick}).subscribe(
          response => {
            this.statusNick = response.status;
            let x = document.getElementById("nickUser");

            if(this.statusNick != "success"){
              x.style.border = "1px solid red";
            } else {
              x.style.border = "1px solid green";
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

}
