import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public sectionTitle = 'Login';
  public user: User;
  public errorMessage;
  public identity;
  public token;

  constructor(private _us: UserService,
              private route: ActivatedRoute,
              private router: Router) {

    this.route.params.subscribe(params => {
      let logout = +params["id"];

      if(logout == 1){
        localStorage.removeItem("token");
        localStorage.removeItem("identity");

        this.identity = null;
        this.token = null;

        window.location.href = "/login";
      }
    });
  }

  ngOnInit() {
    this.user = new User("", "", false);

    let ide = this._us.getIdentity();
    if(ide != null && ide.sub){
      this.router.navigate(["/index"]);
    }
  }

  onSubmit(){
    this._us.signup(this.user).subscribe(
      response => {
        let identity = response;
        this.identity = identity;
        if(identity.length <= 1){
          alert('Error en el servidor');
        } else {
          if(!identity.status){
            localStorage.setItem("identity", JSON.stringify(identity));
            this.user.gethash = true;
            this._us.signup(this.user).subscribe(
              response => {
                let token = response;
                this.token = token;

                if(this.token.length <= 0) {
                  alert('Error en el servidor');
                } else {
                  if(!this.token.status){
                    localStorage.setItem("token", token);
                    window.location.href = "/";
                  }
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
