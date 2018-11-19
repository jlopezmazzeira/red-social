import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { appRoutingProviders, routing} from './app.routing';

//components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PublicationComponent } from './components/publication/publication.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PeopleComponent } from './components/people/people.component';
import { SearchComponent } from './components/search/search.component';
import { MessageComponent } from './components/message/message.component';
import { FollowComponent } from './components/follow/follow.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HelpComponent } from './components/help/help.component';
import { NopagefoundComponent } from './components/nopagefound/nopagefound.component';

//services
import { UserService } from './services/user/user.service';
import { PublicationService } from './services/publication/publication.service';
import { UploadService } from './services/upload/upload.service';
import { FollowService } from './services/follow/follow.service';
import { LikeService } from './services/like/like.service';
import { MessageService } from './services/message/message.service';
import { SearchService } from './services/search/search.service';
import { DatePipe } from './pipes/date.pipe';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    PublicationComponent,
    EditUserComponent,
    NopagefoundComponent,
    ProfileComponent,
    HelpComponent,
    HomeComponent,
    PeopleComponent,
    SearchComponent,
    MessageComponent,
    NotificationComponent,
    FollowComponent,
    DatePipe
  ],
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule
  ],
  providers: [
    UserService,
    PublicationService,
    UploadService,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
