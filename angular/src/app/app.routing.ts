import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicationComponent } from './components/publication/publication.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HelpComponent } from './components/help/help.component';
import { NopagefoundComponent } from './components/nopagefound/nopagefound.component';

export const routes: Routes = [
  { path: '', component: PublicationComponent },
  { path: 'index', component: PublicationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:id', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'configuration', component: EditUserComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', component: NopagefoundComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
