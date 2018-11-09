import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { appRoutingProviders, routing} from './app.routing';

//components
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PublicationComponent } from './components/publication/publication.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HelpComponent } from './components/help/help.component';
import { NopagefoundComponent } from './components/nopagefound/nopagefound.component';

//services
import { UserService } from './services/user/user.service';
import { PublicationService } from './services/publication/publication.service';
import { UploadService } from './services/upload/upload.service';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    PublicationComponent,
    EditUserComponent,
    NopagefoundComponent,
    ProfileComponent,
    HelpComponent
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
