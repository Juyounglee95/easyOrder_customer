import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CartService} from "../../providers/cart-service-mock";
import * as firebase from "firebase";

/**
 * Generated class for the EventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-event',
	segment: 'event'
})
@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {
	orders: Array<any> = [];
	public noticeCollection: any;
	public  db = firebase.firestore();
	title:any;
	content:any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public cartService: CartService, public alert:AlertController) {
		this.getOrders();
	}

	getOrders(){
		var menu_a = this.orderAsync().then(menu_a=> this.orders= menu_a)
			.then(()=>console.log(this.orders));
		console.log(this.orders);
	}
	async orderAsync(){
		let menu = await this._order();
		return menu;
	}
	_order():Promise<any>{
		return new Promise<any>(resolve => {
			var order: Array<any>=[];
			this.noticeCollection = this.db.collection("event");
			var orderInfo = this.noticeCollection.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						order.push({
							title : doc.data().title,
							timeStamp : doc.data().timeStamp,
							content : doc.data().content
						});
					});
					console.log("####", order);
					resolve(order);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});
		})
	}
}
