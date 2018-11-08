import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Person } from '../../models/person';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public sectionTitle = 'Register';
  public person: Person;
  public errorMessage;
  public status;
  public statusNick;

  constructor(private _us: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.person = new Person(1, "user", "", "", "", "", "", "", "", "");
  }

  onSubmit(){
    this._us.register(this.person).subscribe(
      response => {
        this.status = response.status;

        if(this.status != "success"){
          this.status = "error";
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

  verifyNick(){

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
