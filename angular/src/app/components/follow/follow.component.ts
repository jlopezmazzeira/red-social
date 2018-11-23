import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FollowService } from '../../services/follow/follow.service';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.css']
})
export class FollowComponent implements OnInit {

  public sectionTitle = 'Following';
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
  public nick;

  constructor(private _us: UserService,
              private _fs: FollowService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    this.url_image = GLOBAL.url_avatar;
    this.token = this._us.getToken();
    this.identity = this._us.getIdentity();
    this.getFollowing();
  }

  getFollowing(){
    this.route.params.subscribe(
      params => {
        let nick = params["nick"];
        this.nick = nick;
        let page = +params["page"];

        if(!page){
          page = 1;
        }

        this.loading = 'show';

        this._fs.following(nick).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success"){
              this.people = response.following;
              this.hideAll();
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

  hideAll(){
    var btn_unfollow = document.getElementsByClassName("btn-unfollow");
    for(var l = 0; l < btn_unfollow.length; l++)
        btn_unfollow[l].className += " hidden";
  }

  showBtn(element: string){
    var btn = document.getElementById(element);
    btn.classList.remove("hidden");
  }

  hideBtn(element: string){
    var btn = document.getElementById(element);
    btn.className += " hidden";
  }

}
