import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from './services/users-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'worldlier-webapp';

  constructor(private usersHttpService: UsersHttpService) {}

  ngOnInit() {
    this.usersHttpService.autoLogin();
  }
}
