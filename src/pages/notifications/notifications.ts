import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ViewController} from "ionic-angular";

@IonicPage({
	name: 'page-notifications'
})

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})

export class NotificationsPage {
	content :any;
	title: any;
	timeStamp: any;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController,public navParams: NavParams) {
  	this.content = this.navParams.get("content");
  	this.title = this.navParams.get("title");
  	this.timeStamp = this.navParams.get("timeStamp");



  }

  close() {
    this.viewCtrl.dismiss();
  }

  messages () {
  	this.navCtrl.push('page-message-list');
  }
}
