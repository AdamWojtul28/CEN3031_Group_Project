import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { SocketService } from 'src/app/services/socket.service';
import { UsersHttpService } from 'src/app/services/users-http.service';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.css']
})
export class ChatUserComponent implements OnInit, OnDestroy{
  chattingWith: string;
  friendUser: User;
  chatBox: string = '';
  messages: Array<any> = [];

  constructor (private route: ActivatedRoute, private socketService: SocketService, private userHttpService: UsersHttpService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.chattingWith = params['username'];
    })

    this.userHttpService.fetchUserByUsername(this.chattingWith).subscribe({
      next: (res: User) => {
        this.friendUser = res;
      },
      error: (err) => console.log(err)
    })

    this.socketService.getEventListener().subscribe(event => {
      console.log(event);
      if (event.type == "message") {
        if (event.data.content){
          let data = event.data.content;
          if(event.data.sender) {
            data = event.data.sender + ": " + data;
          }
          this.messages.push(data);
          console.log(this.messages);
        } 
      }
    });
  }

  ngOnDestroy() {
    
  }

  send() {
    console.log(this.chatBox)
    if (this.chatBox) {
      this.socketService.send(this.chatBox, this.friendUser.username);
      this.chatBox = "";
    }
  }
}
