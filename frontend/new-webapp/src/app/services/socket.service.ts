import { EventEmitter, Injectable } from "@angular/core";
import { UsersHttpService } from "./users-http.service";
import { StringMatcher } from "cypress/types/net-stubbing";

export interface Message {
  time: Date
  message: string
  sender: string
}

@Injectable({providedIn: 'root'})
export class SocketService{

  private isOpen: boolean = false;
  private socket: WebSocket;
  //private messageList: {[friend: string] : Message[]} = {};
  private messageList: Map<string, Message[]> = new Map();

  public constructor(private userHttpService: UsersHttpService) {}

  public onOpen() {
    if (this.isOpen) return;
    this.socket = new WebSocket("ws://localhost:5000/api/ws?sender=" + encodeURIComponent(this.userHttpService.user.value.username));
    this.socket.onopen = event => {
      
    }
    this.socket.onclose = event => {
      
    }
    this.socket.onmessage = event => {
      console.log(this.messageList);
      console.log('message received!');
      console.log(event);

      // CHANGE 'FREIND' TO ACTAULLY CHECK FOR SPECIFIC FRIEND
      if (this.messageList.has('friend')){
        this.messageList.get('friend').push({ time: new Date(), message: event.data, sender: 'friend' })
      }
      else {
        this.messageList.set('friend', [{ time: new Date(), message: event.data, sender: 'friend' }])
      }
      console.log(this.messageList);
    }
    this.isOpen = true;
  }

  public sentMessage(friend: string, message: string) {
    if (this.messageList.has('friend')){
      this.messageList.get('friend').push({ time: new Date(), message: message, sender: this.userHttpService.user.value.username })
    }
    else {
      this.messageList.set('friend', [{ time: new Date(), message: message, sender: this.userHttpService.user.value.username }])
    }
    console.log(this.messageList);
  }

  public close() {
    if (!this.isOpen) return;
    this.socket.close();
  }

  public getMessages(friend: string) {
    return this.messageList.get('friend');
  }

}