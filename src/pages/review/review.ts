import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
/**
 * Generated class for the ReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
	{name: 'page-review'}
)
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
	reviewtext: string;
	store : any;
	menu: any;
	time: any;
	date : any;
	rate : any=0;
	code : any;
	public  db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  	this.time = this.navParams.get("time");
	  this.store = this.navParams.get("store");
	  this.menu = this.navParams.get("menu");
	  this.code = this.navParams.get("code");
	  this.code= this.code.toString();
  	// console.log(this.reviewtext);
  }
	onModelChange(event){
		this.rate = event;
		console.log(event);
	}
	async addReviewAsync(){
		let review = await this._addreview();
		return review;
	}

	_addreview():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();

			var addDoc = this.db.collection('review').add({

				menu : this.menu,
				star : this.rate,
				time: this.date,
				user_id : firebase.auth().currentUser.email,
				store_name:this.store,
				store_code : this.code,
				content: this.reviewtext
			}).then(ref => {
				resolve(success);
		//		console.log('Added document with ID: ', ref.id);
			});

			//   resolve(store);
		})
	}
	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Review added",
			buttons: ['OK']
		});
		alert.present();
	}
  addReview(){
	  var success  = this.addReviewAsync().then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-dish-list');}).catch();
	  //console.log("result:",success);

  	console.log(this.reviewtext);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }

}
