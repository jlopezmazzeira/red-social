import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../../services/user/user.service';
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
  public url_image;
  public loading;
  public pages;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;

  constructor(private _us: UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    this.url_image = GLOBAL.url_avatar;
    this.getPeople();
  }

  getPeople(){
    this.route.params.subscribe(
      params => {
        let page = +params["page"];

        if(!page){
          page = 1;
        }

        this.loading = 'show';

        this._us.users_list(page).subscribe(
          response => {
            this.status = response.status;
            if(this.status == "success"){
                this.people = response.data;
                this.total_items = response.total_items_count;
                //console.log(response);
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
              alert('Error en la petición');
            }
          }
        );
      }
    );
  }

}
