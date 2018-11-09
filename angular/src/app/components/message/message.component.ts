import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  public sectionTitle = 'Private Messaging';
  public sectionMessageNew = 'Send a new private message';
  public sectionMessageReceived = 'Received messages';
  public sectionMessageSent ='Sent messages';
  
  constructor() { }

  ngOnInit() {
  }

}
