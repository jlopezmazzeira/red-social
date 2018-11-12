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
export class SearchService {

  constructor(private _http: Http) { }

  search(search = null, page = null){
    if(page == null){
      page = 1;
    }

    let http: any;

    if(search == null){
      http = this._http.get(GLOBAL.url_search)
                          .pipe(map(res => res.json()));
    } else {
      http = this._http.get(GLOBAL.url_search+"/"+search+"?page="+page)
                          .pipe(map(res => res.json()));
    }

    return http;

  }
}
