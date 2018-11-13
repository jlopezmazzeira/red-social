import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  constructor(private _http: Http) { }

  follow_user(token:string, follow){
      let json = follow;
    let params = JSON.stringify(json);
    params = "json="+params+"&authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_follow, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }

  unfollow_user(token:string, unfollow){
    let json = unfollow;
    let params = JSON.stringify(json);
    params = "json="+params+"&authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_unfollow, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }

  following_user(token: string){
    let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_following, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }
}
