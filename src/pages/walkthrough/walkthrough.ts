import { Component} from '@angular/core';
import {IonicPage, NavController, MenuController, AlertController, ToastController} from 'ionic-angular';
import * as firebase from "firebase";
import {RestaurantService} from "../../providers/restaurant-service-mock";

@IonicPage({
	name: 'page-walkthrough',
	segment: 'walkthrough',
	priority: 'high'
})

@Component({
  selector: 'page-walkthrough',
  templateUrl: 'walkthrough.html',
})
export class WalkthroughPage {
	favorites: Array<any> = [];
	public code:string;
	public table: any;
	public store :Array<any>=[];
	public storeCollection: any;
	public storeCode: any;
	public tableCode: any;
	public tableCollection: any;
	public  db = firebase.firestore();

  constructor(public navCtrl: NavController, public menu: MenuController, public service: RestaurantService, public forgotCtrl: AlertController, public toastCtrl: ToastController) {

  }
	async  storeAsync(){
		let val = await this._store();
		return val;
	}
	_store():Promise<any> {
		return new Promise<any>(resolve => {
			var store:Array<any>=[];
			this.storeCollection.where("code", "==", this.storeCode)
				.onSnapshot(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {
								store.push(doc.data().code);
								store.push(doc.data().owner);
								resolve(store);
							}
						)
					}
				);
		})
	}

	inputTablecode(){
		var storecode=this.code.substr(0,3);
		this.storeCode = storecode;
		this.storeCollection = this.db.collection("store");
		var store_a = this.storeAsync().then(store_a=> this.store = store_a)
			.then(()=>{

					if(this.store[0]!= undefined){
						this.navCtrl.push('page-restaurant-list',{store_code :this.store[0], owner : this.store[1]});
					}
					else{
						let alert = this.forgotCtrl.create({
							title: 'Wrong Code',
							subTitle: 'Please enter correct code',
							buttons: ['OK']
						});
						alert.present();
					}
				}
			).catch();
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalkthroughPage');
  }

}
