import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private _http: Http) { }

  create_message(token, params: Array<string>, image: Array<File>, documentToUpload: Array<File>){
    return new Promise((resolve, reject) => {
      var formData:any = new FormData();
      var xhr = new XMLHttpRequest();

      var name_image_input = params[0];
      for(var i=0; i < image.length; i++){
        formData.append(name_image_input, image[i], image[i].name);
      }

      var name_document_input = params[1];
      for(var i=0; i < documentToUpload.length; i++){
        formData.append(name_document_input, documentToUpload[i], documentToUpload[i].name);
      }

      formData.append("message", params[2]);
      formData.append("receiver", params[3]);
      formData.append("authorization", token);

      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }

        }
      }

      xhr.open("POST", GLOBAL.url_message, true);
      xhr.send(formData);
    });
  }

  sended_message(token: string, page = null){
    if(page == null){
      page = 1;
    }

    let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_sended+"?page="+page, params, {headers: headers})
                        .pipe(map(res => res.json()));
  }

  received_message(token: string, page = null){
    if(page == null){
      page = 1;
    }

    let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_received+"?page="+page, params, {headers: headers})
                        .pipe(map(res => res.json()));
  }

  notreaded_message(token: string){
    let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_notreaded, params, {headers: headers})
                        .pipe(map(res => res.json()));
  }
}
