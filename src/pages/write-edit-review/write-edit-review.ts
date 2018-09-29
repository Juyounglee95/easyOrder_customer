import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
/**
 * Generated class for the WriteEditReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
	{
		name : 'page-write-edit-review'
	}
)
@Component({
  selector: 'page-write-edit-review',
  templateUrl: 'write-edit-review.html',
})
export class WriteEditReviewPage {
	reviewtext: string;
	store : any;
	menu: any;
	time: any;
	date : any;
	star : any=0;
	content : any;
	id: any;
	public  db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
	  this.time = this.navParams.get("time");
	  this.store = this.navParams.get("store");
	  this.menu = this.navParams.get("menu");
	  this.star = this.navParams.get("star");
	  this.content = this.navParams.get("content");
	  this.id = this.navParams.get("id");

	  console.log(this.id,"!@!@#!$!")
  }

	onModelChange(event){
		this.star = event;
		console.log(event);
	}
	async editReviewAsync(){
		let review = await this._editreview();
		return review;
	}

	_editreview():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			var orderid = this.id;
			console.log(orderid,"AAAAAAA");
			var reviewRef = this.db.collection('review').where("orderDoc_id", "==", orderid).onSnapshot(querySnapshot => {
				querySnapshot.docChanges.forEach(change => {
					const reviewid = change.doc.id;
					this.db.collection('review').doc(reviewid).update({content: this.reviewtext, time : this.date, star: this.star});
					// do something with foo and fooId
					resolve();
				})
			})

			//   resolve(store);
		})
	}


	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Review edited",
			buttons: ['OK']
		});
		alert.present();
	}
	addReview(){
		var success  = this.editReviewAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.setRoot('page-home');}).catch();
		//console.log("result:",success);

		console.log(this.reviewtext);
	}
  ionViewDidLoad() {
    //console.log('ionViewDidLoad WriteEditReviewPage');
  }

}
