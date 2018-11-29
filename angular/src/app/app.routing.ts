import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PublicationComponent } from './components/publication/publication.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PeopleComponent } from './components/people/people.component';
import { SearchComponent } from './components/search/search.component';
import { MessageComponent } from './components/message/message.component';
import { PrivateMessageComponent } from './components/private-message/private-message.component';
import { FollowComponent } from './components/follow/follow.component';
import { FollowedComponent } from './components/followed/followed.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HelpComponent } from './components/help/help.component';
import { NopagefoundComponent } from './components/nopagefound/nopagefound.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:page', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'configuration', component: EditUserComponent },
  { path: 'profile/:nick', component: ProfileComponent },
  { path: 'profile/:nick/:page', component: ProfileComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'people/:page', component: PeopleComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'messages', component: MessageComponent },
  { path: 'messages/:page', component: PrivateMessageComponent },
  { path: 'private-message/:type', component: PrivateMessageComponent },
  { path: 'following/:nick', component: FollowComponent },
  { path: 'following/:nick/:page', component: FollowComponent },
  { path: 'followed/:nick', component: FollowedComponent },
  { path: 'followed/:nick/:page', component: FollowedComponent },
  { path: 'publications/:nick', component: PublicationComponent },
  { path: 'publications/:nick/:page', component: PublicationComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search/:search', component: SearchComponent },
  { path: 'search/:search/:page', component: SearchComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', component: NopagefoundComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
