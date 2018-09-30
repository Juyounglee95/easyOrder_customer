import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from "firebase";

/**
 * Generated class for the NoticePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
	name: 'page-notice',
	segment: 'notice'
})
@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html',
})
export class NoticePage {
	orders: Array<any> = [];
	public noticeCollection: any;
	public  db = firebase.firestore();
	title:any;
	content:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
			this.noticeCollection = this.db.collection("notice");
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticePage');
  }
	readmore(id){
		this.navCtrl.push('page-notifications', {'content': this.orders[id].content,'title':this.orders[id].title, 'timeStamp':this.orders[id].timeStamp
		});
	}
}
