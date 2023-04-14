import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BookingComponent } from './pages/booking/booking.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { DetailsComponent } from './pages/profile/profile-edit/details/details.component';
import { InterestsComponent } from './pages/profile/profile-edit/interests/interests.component';
import { AuthGuard } from './services/auth.guard';
import { UserHomeComponent } from './pages/home/user-home/user-home.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: UserHomeComponent},
  {path: 'booking', component: BookingComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'users/:username', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileEditComponent, canActivate: [AuthGuard], children: [
    {path: 'details', component: DetailsComponent},
    {path: 'interests', component: InterestsComponent}
  ]},
  {path:'admin', component: AdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
