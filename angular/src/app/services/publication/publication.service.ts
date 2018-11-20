import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  constructor(private _http: Http) { }

  create_publication(token, params: Array<string>, image: Array<File>, documentToUpload: Array<File>){
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
      formData.append("authorization", token);
      console.log(formData);
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }

        }
      }

      /*document.getElementById("upload-progress-bar").setAttribute("value", "0");
      document.getElementById("upload-progress-bar").style.width = "0%";

      xhr.upload.addEventListener("progress", function(event: any){
        var percent = (event.loaded / event.total) * 100;
        let prc = Math.round(percent).toString();

        document.getElementById("upload-progress-bar").setAttribute("value", prc);
        document.getElementById("upload-progress-bar").style.width = prc+"%";
        document.getElementById("status").innerHTML = Math.round(percent)+" % subido... por favor espera a que termine";
      }, false);

      xhr.addEventListener("load", function(){
        document.getElementById("status").innerHTML = "Subida completada";
        let prc = "100";
        document.getElementById("upload-progress-bar").setAttribute("value", prc);
        document.getElementById("upload-progress-bar").setAttribute("aria-valuenow", prc);
        document.getElementById("upload-progress-bar").style.width = prc+"%";
      }, false);

      xhr.addEventListener("error", function(){
        document.getElementById("status").innerHTML = "Error en la subida";
      }, false);

      xhr.addEventListener("abort", function(){
        document.getElementById("status").innerHTML = "Subida abortada";
      }, false);*/

      xhr.open("POST", GLOBAL.url_create, true);
      xhr.send(formData);
    });
  }

  list_publications(token:string, page = null){
    if(page == null){
      page = 1;
    }

    let params = "authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_list+"?page="+page, params, {headers: headers})
                        .pipe(map(res => res.json()));
  }

  delete_publication(token: string, publication_id: number){
  	let params = "&authorization="+token;
    let headers = new Headers({'Content-Type':'application/x-www-form-urlencoded'});
    return this._http.post(GLOBAL.url_delete+publication_id, params, {headers: headers})
                      .pipe(map(res => res.json()));
  }
}
