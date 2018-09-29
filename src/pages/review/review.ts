import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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
	id: any;

	public  db = firebase.firestore();
	public onYourRestaurantForm: FormGroup;
  constructor(public loadingCtrl: LoadingController, public toastCtrl: ToastController, private _fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController) {
  	this.time = this.navParams.get("time");
	  this.store = this.navParams.get("store");
	  this.menu = this.navParams.get("menu");
	  this.code = this.navParams.get("code");
	  this.code= this.code.toString();
	  this.id = this.navParams.get("id");
console.log(this.store, this.menu, this.code, this.id)
  }
	ngOnInit() {
		this.onYourRestaurantForm = this._fb.group({


			restaurantAddress: ['', Validators.compose([
				Validators.required
			])],
			rate: ['', Validators.compose([
				Validators.required
			])],

		});
	}
	presentToast() {
		// send booking info
		let loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		// show message
		let toast = this.toastCtrl.create({
			showCloseButton: true,
			cssClass: 'profiles-bg',
			message: 'Your review was enrolled!',
			duration: 3000,
			position: 'bottom'
		});

		loader.present();

		setTimeout(() => {
			loader.dismiss();
			toast.present();
			// back to home page
			this.navCtrl.setRoot('page-home');
		}, 3000)
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
			this.id = this.id.toString();
			var addDoc = this.db.collection('review').add({
				orderDoc_id : this.id,
				menu : this.menu,
				star : this.rate,
				time: this.date,
				user_id : firebase.auth().currentUser.email,
				store_name:this.store,
				store_code : this.code,
				content: this.reviewtext
			}).then(ref=>{

				resolve(success);
				console.log('Added document');
			})

			//   resolve(store);
		})
	}
	updateOrder() {

		var orderRef = this.db.collection('order').where("id", "==", this.id).onSnapshot(querySnapshot => {
			querySnapshot.docChanges.forEach(change => {

				const fooId = change.doc.id
				this.db.collection('order').doc(fooId).update({review: true});
				// do something with foo and fooId

			})
		});
	}

	presentAlert() {

		let alert = this.alertCtrl.create({
			title: "Review added",
			buttons: ['OK']
		});
		alert.present();
	}
  addReview(){
	  var success  = this.addReviewAsync().then(()=> this.updateOrder()).then(()=> this.presentToast()).catch();
	  //console.log("result:",success);

  	console.log(this.reviewtext);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewPage');
  }

}
