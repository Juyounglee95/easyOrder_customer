import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {MessageService} from '../../providers/message-service-mock';

@IonicPage({
	name: 'page-message-detail',
	segment: 'message/:id'
})

@Component({
  selector: 'page-message-detail',
  templateUrl: 'message-detail.html'
})

export class MessageDetailPage {
	param: number;
	message: any;
	content: any;
	title: any;
	timeStamp: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: MessageService) {
    //this.param = this.navParams.get('id');
  	//this.message = this.service.getItem(this.param) ? this.service.getItem(this.param) : this.service.getMessages()[0];
 	this.content= this.navParams.get("content");
 	this.title = this.navParams.get("title");
 	this.timeStamp= this.navParams.get("timeStamp");

  }

}
