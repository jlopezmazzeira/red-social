import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { LikeService } from '../../services/like/like.service';
import { PublicationService } from '../../services/publication/publication.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {

  public sectionTitle = 'Publications that you like';
  public publications;
  public status;
  public statusPublication;
  public errorMessage;
  public loading;
  public url_avatar;
  public url_document;
  public url_image;
  public resultUpload;
  public likes = null;
  public total_publications = 0;
  public pages;
  public page_actual;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;
  public show_image = 'hide';
  public token;
  public identity;
  public nick;

  constructor(private _us: UserService,
              private _ls: LikeService,
              private _ps: PublicationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.url_avatar = GLOBAL.url_avatar;
    this.url_document = GLOBAL.url_document;
    this.url_image = GLOBAL.url_image;
    this.loading = 'show';
    this.token = this._us.getToken();
    this.identity = this._us.getIdentity();
    this.getLikes();
  }

  getLikes(){
    this.route.params.subscribe(
      params => {
        let nick = params["nick"];
        this.nick = nick;
        let page = +params["page"];

        if(!page){
          page = 1;
        }

        this.loading = 'show';

        this._ls.mylikes_publication(nick).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success"){
              this.publications = response.likes;
              this.total_items = response.total_items_count;
              this.total_publications = this.total_items;
              this.loading = 'hide';
              this.pages = [];
              this.total_pages = response.total_pages;

              for(let i = 0; i < response.total_pages; i++){
                this.pages.push(i);
              }

              if(page >= 2){
                this.pagePrev = (page - 1);
              } else {
                this.pagePrev = page;
              }

              if(page < response.total_pages || page == 1){
                this.pageNext = this.total_pages;
              } else {
                this.pageNext = page;
              }
            }
          },
          error => {
            this.errorMessage = <any>error;
            if(this.errorMessage != null){
              console.log(this.errorMessage);
              this.loading = 'hide';
              alert('Error en la petición');
            }
          }
        );
      }
    );
  }

  unlikePublication(id: number){
    let publication_panel = document.getElementById("publication-panel-"+id);
    this._ls.unlike_publication(this.token, id).subscribe(
      response => {
        this.statusPublication = response.status;
        if(this.statusPublication == 'success'){
          this.total_items -= 1;
          if(publication_panel != null){
            publication_panel.className += " hidden";
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

  showImage(id: number){
    let btn_unfollow = document.getElementsByClassName("pub-image-"+id);
    let publication_image = document.getElementById("pub-image-"+id);

    if(btn_unfollow.length == 0){
      publication_image.className += " pub-image-"+id;
      publication_image.style.display = "block";
    } else {
      publication_image.classList.remove("pub-image-"+id);
      publication_image.style.display = "none";
    }
  }

}
