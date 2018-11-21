import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private _http: Http) { }

  like_publication(token: string, publication_id){
  	let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_like+publication_id, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }

  unlike_publication(token: string, publication_id){
  	let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_unlike+publication_id, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }

  likes_publication(token: string){
  	let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_likes, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }
}
