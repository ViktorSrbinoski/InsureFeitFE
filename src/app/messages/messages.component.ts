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
  public frequency: string;
  public hideResult = true;
  public p = 0;

  public prob0 = 0;
  public prob1 = 0;
  public prob2 = 0;
  public prob3 = 0;
  public prob4 = 0;
  public prob5 = 0;

  public prob0R = 0;
  public prob1R = 0;
  public prob2R = 0;
  public prob3R = 0;
  public prob4R = 0;
  public prob5R = 0;

  public prob0T = '0';
  public prob1T = '0';
  public prob2T = '0';
  public prob3T = '0';
  public prob4T = '0';
  public prob5T = '0';

  constructor(private rxStompService: RxStompService) {
    this.frequency = '0';
  }

  ngOnInit() {
    this.rxStompService.watch('/queue/output').subscribe((message: Message) => {
      this.receivedMessages.push(message.body);
      this.frequency = message.body;

      this.p = parseFloat(this.frequency);
      this.prob0 = this.poisson(0, this.p);
      this.prob1 = this.poisson(1, this.p);
      this.prob2 = this.poisson(2, this.p);
      this.prob3 = this.poisson(3, this.p);
      this.prob4 = this.poisson(4, this.p);
      this.prob5 = 1 - this.prob0 - this.prob1 - this.prob2 - this.prob3 - this.prob4;

      this.prob0 = this.prob0 * 100;
      this.prob1 = this.prob1 * 100;
      this.prob2 = this.prob2 * 100;
      this.prob3 = this.prob3 * 100;
      this.prob4 = this.prob4 * 100;
      this.prob5 = this.prob5 * 100;

      this.prob0T = this.prob0.toFixed(1);
      this.prob1T = this.prob1.toFixed(1);
      this.prob2T = this.prob2.toFixed(1);
      this.prob3T = this.prob3.toFixed(1);
      this.prob4T = this.prob4.toFixed(1);
      this.prob5T = this.prob5.toFixed(1);

      this.prob0R = Math.round(this.prob0);
      this.prob1R = Math.round(this.prob1);
      this.prob2R = Math.round(this.prob2);
      this.prob3R = Math.round(this.prob3);
      this.prob4R = Math.round(this.prob4);
      this.prob5R = Math.round(this.prob5);

      if (this.p > 100) {
        this.p = 100;
      }
      this.p = Math.round(this.p);
      this.hideResult = false;
    });
  }

  onSendMessage() {
    const message = this.enteredData;
    this.rxStompService.publish({destination: '/queue/input', body: JSON.stringify(message)});
  }

  poisson(k, lambda) {
    const exponentialPower = Math.pow(2.718281828, -lambda); // negative power k
    const lambdaPowerK = Math.pow(lambda, k); // Landa elevated k
    const numerator = exponentialPower * lambdaPowerK;
    const denominator = this.fact(k); // factorial of k.

    return (numerator / denominator);
  }

  fact(x) {
    let s = 1;
    for (let i = 1; i <= x; i++) {
      s *= i;
    }
    return s;
  }

  findBiggest(){
    return Math.max(this.prob0, Math.max(this.prob1, Math.max(this.prob2, Math.max(this.prob3, Math.max(this.prob4, this.prob5)))));
  }

}
