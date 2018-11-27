import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user/user.service';
import { PublicationService } from '../../services/publication/publication.service';
import { LikeService } from '../../services/like/like.service';
import { FollowService } from '../../services/follow/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public sectionTitle = 'Timeline';
  public sectionCreatePublication = 'Create Publication';
  public errorMessage;
  public identity;
  public token;
  public url_avatar;
  public url_document;
  public url_image;
  public documentToUpload: Array<File> = [];
  public imageToUpload: Array<File> = [];
  public publication: Publication;
  public resultUpload;
  public publications = null;
  public likes = null;
  public total_likes = 0;
  public total_following = 0;
  public total_followed = 0;
  public total_publications = 0;
  public loading;
  public loading_publication;
  public pages;
  public page_actual;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;
  public status;
  public statusPublication;
  public show_image = 'hide';

  constructor(private _us: UserService,
              private _ps: PublicationService,
              private _ls: LikeService,
              private _fs: FollowService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    let identity = this._us.getIdentity();
    this.identity = identity;
    this.token = this._us.getToken();
    this.url_avatar = GLOBAL.url_avatar;
    this.url_image = GLOBAL.url_image;
    this.url_document = GLOBAL.url_document;
    this.publication = new Publication(1, "", "", "", "");
    this.getPublications();
    this.getFollowing();
    this.getFollowed();
    this.myPublications();
  }

  onSubmit(){
    this.loading_publication = 'show';
    this._ps.create_publication(this.token, ['image', 'document', this.publication.message], this.imageToUpload, this.documentToUpload).then(
      (result) => {
        this.resultUpload = result;
        this.loading = 'show';
        this.loading_publication = 'hide';
        this.publication.message = null;
        this.publication.image = null;
        this.publication.file = null;
        this.total_publications += 1;
        this.getPublications();
      },
      (error) => {
          console.log(error);
          this.loading_publication = 'hide';
      }
    );
  }

  imageChangeEvent(fileInput: any){
    this.imageToUpload = <Array<File>>fileInput.target.files;
  }

  documentChangeEvent(fileInput: any){
    this.documentToUpload = <Array<File>>fileInput.target.files;
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

  getPublications(){
    this.route.params.subscribe(
      params => {
        let page = +params["page"];

        if(!page){
          page = 1;
        }
        //this.page_actual = page;
        this.loading = 'show';

        this._ps.list_publications(this.token,page).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success" && response.total_items_count > 0){
                this.publications = response.data;
                this.likesPublication();
                this.total_items = response.total_items_count;
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
              alert('Error en la petición');
            }
          }
        );
      }
    );
    this.loading = 'hide';
  }

  deletePublication(id: number){
    let publication_panel = <HTMLElement>document.querySelector(".publication-panel-"+id);

    if(publication_panel != null){
      publication_panel.style.display = "none";
    }

    this._ps.delete_publication(this.token, id).subscribe(
      response => {
        this.statusPublication = response.status;
        if(this.statusPublication != 'success'){
          this.statusPublication = 'error';
          //this.total_publications -= 1;
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

  likePublication(id: number){
    let btn_like = document.getElementById("like-"+id);
    let btn_unlike = document.getElementById("unlike-"+id);

    this._ls.like_publication(this.token, id).subscribe(
      response => {
        this.statusPublication = response.status;
        if(this.statusPublication == 'success'){
          this.total_likes += 1;
          btn_like.style.display = "none";
          btn_unlike.style.display = "block";
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

  unlikePublication(id: number){
    let btn_like = document.getElementById("like-"+id);
    let btn_unlike = document.getElementById("unlike-"+id);

    this._ls.unlike_publication(this.token, id).subscribe(
      response => {
        this.statusPublication = response.status;
        if(this.statusPublication == 'success'){
          this.total_likes -= 1;
          btn_like.style.display = "block";
          btn_unlike.style.display = "none";
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

  likesPublication(){
    this._ls.likes_publication(this.identity.nick).subscribe(
        response => {
          this.status = response.status;
          if(this.status == "success"){
              this.likes = response.likes;
              this.total_likes = this.likes.length;
              for(var i in this.publications){
                let publication_id = this.publications[i].id;
                let btn_like = document.getElementById("like-"+publication_id);
                let btn_unlike = document.getElementById("unlike-"+publication_id);

                for(var j in this.likes){
                  let like_publication = this.likes[j].publication.id;
                  if(publication_id === like_publication){
                    btn_unlike.style.display = "block";
                    btn_like.style.display = "none";
                  }
                }
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

  getFollowing(){
    this._fs.following_user(this.identity.nick).subscribe(
      response => {
        this.status = response.status;

        if(this.status == "success"){
          let following = response.following;
          if(following.length != 0){
            this.total_following = following.length;
          }
        }
      }
    );
  }

  getFollowed(){
    this._fs.followed(this.identity.nick).subscribe(
      response => {
        this.status = response.status;
        if(this.status == "success"){
          this.total_followed = response.total_items_count;
        }
      }
    );
  }

  myPublications(){
    this._ps.my_publications(this.token).subscribe(
      response => {
        this.status = response.status;

        if(this.status == "success"){
          let publications = response.data;
          if(publications.length != 0){
            this.total_publications = publications.length;
          }
        }
      }
    );
  }

}
