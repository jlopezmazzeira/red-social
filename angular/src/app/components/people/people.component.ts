import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FollowService } from '../../services/follow/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {

  public sectionTitle = 'People';
  public people;
  public errorMessage;
  public status;
  public statusFollow;
  public statusUnfollow;
  public url_image;
  public loading;
  public pages;
  public page_actual;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;
  public token;
  public identity;
  public following;

  constructor(private _us: UserService,
              private _fs: FollowService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    this.url_image = GLOBAL.url_avatar;
    this.token = this._us.getToken();
    this.identity = this._us.getIdentity();
    this.getPeople();
  }

  getFollowing(){
    this._fs.following_user(this.token).subscribe(
      response => {
        this.status = response.status;

        if(this.status == "success"){
          this.following = response.following;
          for (var i in this.following){
            let f = +this.following[i].followed.id;
            for(var j in this.people) {
              let p = +this.people[j].id;
              if(f == p){
                this.people[j].f = true;
              }
            }
          }
        }
      }
    );
  }

  getPeople(){
    this.route.params.subscribe(
      params => {
        let page = +params["page"];

        if(!page){
          page = 1;
        }
        //this.page_actual = page;
        this.loading = 'show';

        this._us.users_list(page).subscribe(
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
          //this.getPeople();
          //followed.f = true;
          //this.router.navigate(["/people", this.page_actual]);
          //document.getElementById("follow").style.display = "none";
          //var el = document.querySelector('#follow');
          //el.style.display = "none";
          //window.location.href = "/people/"+this.page_actual;
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
        this.statusFollow = response.status;

        if(this.statusUnfollow == "success"){
          //var el = document.querySelector('#unfollow');
        //  el.style.display = "none";
          //followed.f = false;
          //this.getPeople();
          //document.getElementById("unfollow").style.display = "none";
          //window.location.href = "/people/"+this.page_actual;
          //this.router.navigate(["/people", this.page_actual]);
        }
        //this.getFollowing();
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

}
