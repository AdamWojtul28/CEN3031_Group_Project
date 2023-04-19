import { EventEmitter, Injectable } from "@angular/core";
import { UsersHttpService } from "./users-http.service";

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
  private messageEmitter: EventEmitter<any> = new EventEmitter()

  public constructor(private userHttpService: UsersHttpService) {}

  public onOpen() {
    if (this.isOpen) return;
    this.socket = new WebSocket("ws://localhost:5000/api/ws?sender=" + encodeURIComponent(this.userHttpService.user.value.username));
    this.socket.onopen = event => {
      console.log('Opening incoming websocket connection')
    }
    this.socket.onclose = event => {
      console.log('Closing incoming websocket connection')
    }
    this.socket.onmessage = event => {
      if (event.data[0] != '{') return;
      let data : {sender: string, message: string, time: Date} = JSON.parse(event.data);
      console.log('Message from: ' + data.sender)

      if (this.messageList.has(data.sender)){
        this.messageList.get(data.sender).push({ time: data.time, message: data.message, sender: data.sender })
      }
      else {
        this.messageList.set(data.sender, [{ time: data.time, message: data.message, sender: data.sender }])
      }

      console.log(this.messageList);
      let writeEvent = {friend: data.sender, messages: this.messageList.get(data.sender)}
      this.messageEmitter.emit(writeEvent);
    }
    this.socket.onerror = error => {
      console.log(error);
    }

    this.isOpen = true;
  }

  public sentMessage(friend: string, message: string) {
    if (this.messageList.has(friend)){
      this.messageList.get(friend).push({ time: new Date(), message: message, sender: this.userHttpService.user.value.username })
    }
    else {
      this.messageList.set(friend, [{ time: new Date(), message: message, sender: this.userHttpService.user.value.username }])
    }
    let writeEvent = {friend: friend, messages: this.messageList.get(friend)}
    this.messageEmitter.emit(writeEvent);
  }

  public close() {
    if (!this.isOpen) return;
    this.socket.close();
  }

  public getMessageEmitter() {
    return this.messageEmitter;
  }

  public checkForMessages(friend: string){
    let writeEvent = {friend: friend, messages: this.messageList.get(friend)}
      this.messageEmitter.emit(writeEvent);
  }

}