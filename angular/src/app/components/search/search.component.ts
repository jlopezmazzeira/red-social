import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { SearchService } from '../../services/search/search.service';
import { UserService } from '../../services/user/user.service';
import { FollowService } from '../../services/follow/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public identity;
  public token;
  public sectionTitle = "People";
  public people;
  public errorMessage;
  public status;
  public statusFollow;
  public statusUnfollow;
  public url_image;
  public loading;
  public pages;
  public pagePrev = 1;
  public pageNext = 1;
  public total_pages = 0;
  public total_items = 0;
  public search_string: string;
  public following;

  constructor(private _ss: SearchService,
              private _us: UserService,
              private _fs: FollowService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    this.identity = this._us.getIdentity();
    if(!this.identity){
      this.router.navigate(["/login"]);
    }
    this.token = this._us.getToken();
    this.url_image = GLOBAL.url_avatar;
    this.getSearchPeople();
  }

  getFollowing(){
    this._fs.following_user(this.identity.nick).subscribe(
      response => {
        this.status = response.status;

        if(this.status == "success"){
          this.following = response.following;
          if(this.following.length > 0){
            for (var i in this.following){
              let f = +this.following[i].followed.id;
              for(var j in this.people) {
                let p = +this.people[j].id;
                if(f == p){
                  this.hideBtn("btn-follow-"+p);
                  this.showBtn("btn-unfollow-"+p);
                }
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

  getSearchPeople(){
    this.route.params.subscribe(
      params => {
        let search = params["search"];

        if(!search || search.trim().length == 0){
          search = null;
          this.router.navigate(['/people']);
        }

        let page = +params["page"];

        if(!page){
          page = 1;
        }

        this.search_string = search;
        this.loading = 'show';

        this._ss.search(search, page).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success"){
                this.people = response.data;
                this.total_items = response.total_items_count;
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
                this.getFollowing();
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
  }

  follow(followed){
    this._fs.follow_user(this.token, {following_id:followed.id}).subscribe(
      response => {
        this.statusFollow = response.status;

        if(this.statusFollow == "success"){
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
        this.statusUnfollow = response.status;

        if(this.statusUnfollow == "success"){
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
