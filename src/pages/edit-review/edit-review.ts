import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import * as firebase from "firebase";
import 'firebase/firestore';
/**
 * Generated class for the EditReviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
	{name: 'page-edit-review'}
)
@Component({
  selector: 'page-edit-review',
  templateUrl: 'edit-review.html',
})
export class EditReviewPage {
	reviewtext: string;
	store : any;
	menu: any;
	time: any;
	date : any;
	rate : any=0;
	code : any;
	id: any; //orderDoc_id

	reviews :Array<any>=[];
	public  db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams, private  alert: AlertController) {

	  this.id = this.navParams.get("id");
	  this.openReview()
  }
	async getReviewAsync(){
		let text = await this._getReview();
		return text;
	}
	_getReview():Promise<any>{
		return new Promise<any>(resolve => {
			var text:Array<any>=[];
			console.log("agggbbbbbb")

			var reviewRef = this.db.collection('review').where("orderDoc_id", "==", this.id);
			var reviewinfo = reviewRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						text.push({
							content : doc.data().content,
							menu : doc.data().menu,
							star : doc.data().star,
							store_name : doc.data().store_name,
							time : doc.data().time,

						})
					});
					console.log(text);
					resolve(text);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});

			//   resolve(store);
		})
	}

  openReview(){
  	console.log("aggg")
	  var review_a = this.getReviewAsync().then(text=> this.reviews= text).then(()=>console.log(this.reviews));
  }
  editReview(){
	  this.navCtrl.push('page-write-edit-review',{
		 	'star' : this.reviews[0].star,
		  'store': this.reviews[0].store_name,
		  'menu': this.reviews[0].menu,
		  'time': this.reviews[0].time,
		  'content' : this.reviews[0].content,
		  'id': this.id
	  })
  }
	presentAlert() {

		let alert = this.alert.create({
			title: "Do you really want to delete the review?",
			buttons: [
				{
					text: 'No',
					handler: () => {
						console.log('Disagree clicked');
					}
				},
				{
					text: 'YES',
					handler: () => {
						this.deleteReview()
					}
				}
			]
		});
		alert.present();
	}

  deleteReview(){
	  var reviewRef = this.db.collection('review').where("orderDoc_id", "==", this.id).onSnapshot(querySnapshot => {
		  querySnapshot.docChanges.forEach(change => {
			  const reviewid = change.doc.id;
			  this.db.collection('review').doc(reviewid).delete().then(()=>
			  this.updateOrder()).then(()=>this.presentAlert2()).then(()=>this.navCtrl.push('page-home')).catch(err=> console.log("error"));
			  // do something with foo and fooId
			  //resolve();
		  })
	  })
  }
	updateOrder() {

		var orderRef = this.db.collection('order').where("id", "==", this.id).onSnapshot(querySnapshot => {
			querySnapshot.docChanges.forEach(change => {

				const fooId = change.doc.id
				this.db.collection('order').doc(fooId).update({review: false});
				// do something with foo and fooId

			})
		});
	}
	presentAlert2() {

		let alert = this.alert.create({
			title: "Deleted Review",
			buttons: ["OK"]
		});
		alert.present();
	}
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditReviewPage');
  }

}
