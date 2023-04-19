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
  socket: WebSocket;
  isSocketOpen: boolean = false;
  chatBox: string = '';
  messages: Message[] = [];

  constructor (private route: ActivatedRoute, private socketService: SocketService, private userHttpService: UsersHttpService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.chattingWith = params['username'];

      if (this.socket) {
        if (this.isSocketOpen){
          this.socket.close();
        }
        this.socket = null;
      }

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
  
      this.socket = new WebSocket("ws://localhost:5000/api/ws?sender=" + encodeURIComponent(this.userHttpService.user.value.username) + "&receiver=" + this.chattingWith);
      this.socket.onopen = event => {
        console.log('Opening connection to ' + this.chattingWith)
        this.isSocketOpen = true;
      }
      this.socket.onmessage = event => {
        
      }
      this.socket.onclose = event => {
        console.log('Closing direct connection');
        console.log(event);
        this.isSocketOpen = false;
      }   
    })
     
  }

  ngOnDestroy() {
    this.socket.close();
  }

  send() {
    if (this.chatBox) {
      this.socket.send(this.chatBox)
      this.socketService.sentMessage(this.chattingWith, this.chatBox);
      this.chatBox = "";
    }
  }
}
