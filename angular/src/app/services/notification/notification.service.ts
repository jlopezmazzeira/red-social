import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _http: Http) { }

  notifications(token: string){
  	let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_number_notifications, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }

  list_notifications(token: string){
  	let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_notifications, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }
}
