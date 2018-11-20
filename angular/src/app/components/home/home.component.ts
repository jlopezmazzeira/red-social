import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user/user.service';
import { PublicationService } from '../../services/publication/publication.service';
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
  public documentToUpload: Array<File> = [];
  public imageToUpload: Array<File> = [];
  public publication: Publication;
  public resultUpload;
  public publications;
  public loading;
  public pages;
  public page_actual;
  public pagePrev = 1;
  public pageNext = 1;
  public total_items = 0;
  public total_pages = 0;
  public status;
  public statusPublication;

  constructor(private _us: UserService,
              private _ps: PublicationService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.loading = 'show';
    let identity = this._us.getIdentity();
    this.identity = identity;
    this.token = this._us.getToken();
    this.url_avatar = GLOBAL.url_avatar;
    this.publication = new Publication(1, "", "", "", "");
    this.getPublications();
    console.log(this.publications);
  }

  onSubmit(){

    this._ps.create_publication(this.token, ['image', 'document', this.publication.message], this.imageToUpload, this.documentToUpload).then(
      (result) => {
        this.resultUpload = result;
        this.getPublications();
      },
      (error) => {
          console.log(error);
      }
    );
  }

  imageChangeEvent(fileInput: any){
    this.imageToUpload = <Array<File>>fileInput.target.files;
  }

  documentChangeEvent(fileInput: any){
    this.documentToUpload = <Array<File>>fileInput.target.files;
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
            if(this.status == "success"){
                this.publications = response.data;
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
              alert('Error en la petición');
            }
          }
        );
      }
    );
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

}
