import { Component, OnInit } from '@angular/core';
import { UsersHttpService } from './services/users-http.service';
import { User } from './models/user.model';
import { SocketService } from './services/socket.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'worldlier-webapp';
  private events: string[] = ['keydown', 'click', 'wheel'];

  constructor(private usersHttpService: UsersHttpService, private socketService: SocketService) {}

  ngOnInit() {
    this.usersHttpService.autoLogin();

    this.events.forEach(event =>
      fromEvent(document, event).subscribe(_ => this.usersHttpService.refreshUser())
    );

    this.usersHttpService.user.subscribe({
      next: (user) => {
        if (user != null) {
          this.socketService.onOpen();
        }
      }
    })
  }
}