import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FollowService } from '../../services/follow/follow.service';
import { PublicationService } from '../../services/publication/publication.service';
import { LikeService } from '../../services/like/like.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public sectionTitle = 'Profile';
  public person;
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
  public total_likes = 0;
  public total_following = 0;
  public total_followed = 0;
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
  public following = false;

  constructor(private _us: UserService,
              private _fs: FollowService,
              private _ls: LikeService,
              private _ps: PublicationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.identity = this._us.getIdentity();
    if(!this.identity){
      this.router.navigate(["/login"]);
    }
    this.url_avatar = GLOBAL.url_avatar;
    this.url_document = GLOBAL.url_document;
    this.url_image = GLOBAL.url_image;
    this.loading = 'show';
    this.token = this._us.getToken();
    this.total_likes = 0;
    this.total_following = 0;
    this.getProfile();
  }

  getProfile(){
    this.route.params.subscribe(
      params => {
        let nick = params["nick"];
        let page = +params["page"];

        if(!page){
          page = 1;
        }

        this.loading = 'show';

        this._us.profile(nick).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success"){
              this.person = response.user;
              this.publications = response.publications;
              this.likesPublication();
              this.getFollowing();
              this.getFollowed();
              this.total_items = response.total_items_count;
              this.total_publications = this.total_items;
              this.loading = 'hide';
              this.pages = [];
              this.total_pages = response.total_pages;

              if(this.person.id != this.identity.sub){
                  this.verifyFollow();
              }

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

  verifyFollow(){
      this._fs.verify_following(this.token, {follow_id: this.person.id}).subscribe(
        response => {
          this.status = response.status;
          if(this.status == "success"){
            this.following = response.follow;
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
    this._ls.likes_publication(this.person.nick).subscribe(
        response => {
          this.status = response.status;
          this.total_likes = 0;
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
    this._fs.following_user(this.person.nick).subscribe(
      response => {
        this.status = response.status;
        this.total_following = 0;
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
    this._fs.followed(this.person.nick).subscribe(
      response => {
        this.status = response.status;
        if(this.status == "success"){
          this.total_followed = response.total_items_count;
        }
      }
    );
  }

  follow(followed){
    this._fs.follow_user(this.token, {following_id:followed.id}).subscribe(
      response => {
        this.status = response.status;

        if(this.status == "success"){
          this.hideBtn("btn-follow-"+followed.id);
          this.showBtn("btn-unfollow-"+followed.id);
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

  unfollow(followed){
    this._fs.unfollow_user(this.token, {following_id:followed.id}).subscribe(
      response => {
        this.status = response.status;
        if(this.status == "success"){
          this.showBtn("btn-follow-"+followed.id);
          this.hideBtn("btn-unfollow-"+followed.id);
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

  showBtn(element: string){
    var btn = document.getElementById(element);
    btn.classList.remove("hide");
  }

  hideBtn(element: string){
    var btn = document.getElementById(element);
    btn.className += " hide";
  }

}
