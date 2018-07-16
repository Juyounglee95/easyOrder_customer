import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import * as firebase from 'firebase';
import {  AlertController, ToastController, MenuController } from 'ionic-angular';
import 'firebase/firestore';
import {error} from "util";
@IonicPage({
	name: 'page-favorite-list',
	segment: 'favorites'
})

@Component({
	selector: 'page-favorite-list',
	templateUrl: 'favorite-list.html'
})

export class FavoriteListPage {

	favorites: Array<any> = [];
	public code:string;
	public table: any;
	public store :Array<any>=[];
	public storeCollection: any;
	public storeCode: any;
	public tableCode: any;
	public tableCollection: any;
	public  db = firebase.firestore();

	constructor(public navCtrl: NavController, public service: RestaurantService, public forgotCtrl: AlertController, public toastCtrl: ToastController) {
		this.getFavorites();
	}

	itemTapped(favorite) {
		this.navCtrl.push('page-restaurant-detail', {
			'id': favorite.restaurant.id
		});
	}
	deleteItem(favorite) {
		this.service.unfavorite(favorite)
			.then(() => {
				this.getFavorites();
			})
			.catch(error => alert(JSON.stringify(error)));
	}

	getFavorites() {
		this.service.getFavorites()
			.then(data => this.favorites = data);
	}
	async tableAsync(){
		let val  = await this._table();
		return val;
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
	_table():Promise<any> {
		return new Promise<any>(resolve => {
			var table ='';
			this.tableCollection.where("id", "==", this.tableCode)
				.onSnapshot(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {


								table = doc.data().table_num;
								console.log('table_num', table);
								resolve(table);
							}
						)
					}
				);
		})
	}

	inputTablecode(){
		var storecode=this.code.substr(0,3);
		var tablecode = this.code.substr(3,3);
		this.storeCode = storecode;
		this.tableCode = tablecode;
		this.tableCollection = this.db.collection("table");
		this.storeCollection = this.db.collection("store");
		var table_a = this.tableAsync().then(table_a=> this.table= table_a).catch();
		var store_a = this.storeAsync().then(store_a=> this.store = store_a)
			.then(()=>{

				if(this.table!=undefined&& this.store[0]!= undefined){
				this.navCtrl.push('page-cart',{store_code :this.store[0], table_num: this.table, owner : this.store[1]});
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
}
