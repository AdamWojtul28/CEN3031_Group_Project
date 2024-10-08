import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';
import { NavbarComponent } from './sharepage/navbar/navbar.component';
import { FooterComponent } from './sharepage/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { BookingComponent } from './pages/booking/booking.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProfileEditComponent } from './pages/profile/profile-edit/profile-edit.component';
import { DetailsComponent } from './pages/profile/profile-edit/details/details.component';
import { InterestsComponent } from './pages/profile/profile-edit/interests/interests.component';
import { UserHomeComponent } from './pages/home/user-home/user-home.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatUserComponent } from './pages/chat/chat-user/chat-user.component';
import { DatePipe } from '@angular/common';
import { MapDisplayComponent } from './pages/home/map-display/map-display.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    BookingComponent,
    AboutComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    AdminComponent,
    ProfileEditComponent,
    DetailsComponent,
    InterestsComponent,
    UserHomeComponent,
    ChatComponent,
    ChatUserComponent,
    MapDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    DatePipe,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
