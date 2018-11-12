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
import { FollowComponent } from './components/follow/follow.component';
import { NotificationComponent } from './components/notification/notification.component';
import { HelpComponent } from './components/help/help.component';
import { NopagefoundComponent } from './components/nopagefound/nopagefound.component';

export const routes: Routes = [
  { path: '', component: PublicationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'configuration', component: EditUserComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'people/:page', component: PeopleComponent },
  { path: 'notifications', component: NotificationComponent },
  { path: 'messages', component: MessageComponent },
  { path: 'following', component: FollowComponent },
  { path: 'user/:nick', component: ProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search/:search', component: SearchComponent },
  { path: 'search/:search/:page', component: SearchComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', component: NopagefoundComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
