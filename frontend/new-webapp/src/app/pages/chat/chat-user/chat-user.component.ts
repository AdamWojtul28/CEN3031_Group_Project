import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Message, SocketService } from 'src/app/services/socket.service';
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
  messages: Message[] = [];

  constructor (private route: ActivatedRoute, private socketService: SocketService, private userHttpService: UsersHttpService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.chattingWith = params['username'];

      this.userHttpService.fetchUserByUsername(this.chattingWith).subscribe({
        next: (res: User) => {
          this.friendUser = res;
        },
        error: (err) => console.log(err)
      });
  
      this.socketService.getMessageEmitter().subscribe({
        next: (data: {friend: string, messages: Message[]}) => {
          if (data.friend === this.chattingWith){
            this.messages = data.messages;
            if (document.getElementById("scrollDiv")){
              document.getElementById("scrollDiv").scrollTop = document.getElementById("scrollDiv").scrollHeight;
            }
          }
        }
      })
      this.socketService.checkForMessages(this.chattingWith);
    })
  }

  ngOnDestroy() { }

  send() {
    if (this.chatBox) {
      let data = {receiver: this.chattingWith, message: this.chatBox}
      this.socketService.sendMessage(data);
      this.chatBox = "";
    }
  }
}
