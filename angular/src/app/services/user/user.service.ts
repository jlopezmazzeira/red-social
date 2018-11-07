import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { Person } from '../../models/person';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public identity;
  public token;

  constructor(private _http: Http) { }

  signup(user_to_login: User){
    let json = user_to_login;
    let params = JSON.stringify(json);
    params = "json="+params;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_login, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }

  getIdentity(){
    let identity = JSON.parse(localStorage.getItem("identity"));

    if(identity != "undefined"){
      this.identity = identity
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem("token");

    if(token != "undefined"){
      this.token = token
    } else {
      this.token = null;
    }

    return this.token;
  }
  
  register(user_to_register: Person){
    let json = user_to_register;
    let params = JSON.stringify(json);
    params = "json="+params;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_register, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }
}
