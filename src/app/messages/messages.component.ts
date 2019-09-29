import {Component, OnInit} from '@angular/core';
import {RxStompService} from '@stomp/ng2-stompjs';
import {Message} from '@stomp/stompjs';
import {UserData} from '../model/UserData';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  public receivedMessages: string[] = [];
  public enteredData = new UserData();
  public percentage: string;
  public hideResult = false;

  constructor(private rxStompService: RxStompService) {
    this.percentage = '0';
  }

  ngOnInit() {
    this.rxStompService.watch('/queue/output').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
      this.hideResult = false;
      this.percentage = JSON.parse(message.body).driverAge;
    });
  }

  onSendMessage() {
    const message = this.enteredData;
    this.rxStompService.publish({destination: '/queue/input', body: JSON.stringify(message)});
  }

}
