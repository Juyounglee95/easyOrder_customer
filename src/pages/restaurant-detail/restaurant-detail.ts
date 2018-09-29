import {Component} from '@angular/core';
import {IonicPage, ActionSheetController, ActionSheet, NavController, NavParams, ToastController} from 'ionic-angular';

import {RestaurantService} from '../../providers/restaurant-service-mock';
import {DishService} from '../../providers/dish-service-mock';
import {CartService} from '../../providers/cart-service-mock';

import leaflet from 'leaflet';
import * as firebase from "firebase";
import 'firebase/firestore'
@IonicPage({
	name: 'page-restaurant-detail',
	segment: 'restaurant/:id'
})

@Component({
    selector: 'page-restaurant-detail',
    templateUrl: 'restaurant-detail.html'
})
export class RestaurantDetailPage {
	param: any;
    map;
    markersGroup;
    restaurant: any;
    restaurantopts: String = 'info';
    dishes: Array<any>;
	lat;
	long;
	info :Array<any>=[];
	reviews :Array<any>=[];
	db = firebase.firestore();
	name:string ='';
	phone: number=0;
	address: string='';
	time:string='';
	menus : Array<any>=[];
	code :string='';
	userid:string ='';
	star :number=0;
	content :string='';
	rvtime : string='';
    constructor(public actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams, public cartService: CartService, public restaurantService: RestaurantService, public dishService: DishService, public toastCtrl: ToastController) {
			this.param = this.navParams.get('id');
			var restloc = this.param.split(",");
			this.lat = restloc[0];
			this.long = restloc[1];
			this.getinfo();
    }

	getinfo(){
		var info_a = this.infoAsync().then(info_a=> this.info= info_a);
	}

	async infoAsync(){
		let val  = await this._info();
		return val;
	}

	_info():Promise<any> {
		return new Promise<any>(resolve => {
			var info :Array<any>=[];
			this.db.collection("store").where("location", "==", this.param).onSnapshot(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					info.push({
						code : doc.data().code,
						name: doc.data().name,
						phone : doc.data().phone,
						address : doc.data().address,
						time: doc.data().hours
					})
				});
				resolve(info);
			})
		})
	}

	getmenu(){
		var menu_a = this.menuAsync().then(menu_a=> this.menus= menu_a)
			.then(()=>console.log(this.menus)).catch();
	}
	async menuAsync(){
		let menu = await this._menu();
		return menu;
	}
	_menu():Promise<any>{
		return new Promise<any>(resolve => {
			var menu: Array<any>=[];

			this.db.collection("menu").where("store_code", "==",this.info[0].code).get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						menu.push({
							name : doc.data().menu,
							price : doc.data().price
						});
					});
					resolve(menu);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});

			//   resolve(store);
		})
	}
	getreview(){
		var review_a = this.reviewAsync().then(review_a=> this.reviews= review_a)
			.then(()=>console.log(this.reviews)).catch();
	}
	async reviewAsync(){
		let review = await this._review();
		return review;
	}
	_review():Promise<any>{
		return new Promise<any>(resolve => {
			var review: Array<any>=[];

			this.db.collection("review").where("store_code", "==",this.info[0].code).get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						review.push({
							userid : doc.data().user_id,
							star : doc.data().star,
							content : doc.data().content,
							rvtime : doc.data().time
						});
					});
					resolve(review);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});

			//   resolve(store);
		})
	}



		openDishDetail(dish) {
      this.navCtrl.push('page-dish-detail', {
				'id': dish.id
			});
    }

    showMarkers() {
        if (this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
        }
        this.markersGroup = leaflet.layerGroup([]);

        let marker: any = leaflet.marker([this.lat, this.long]);
        //marker.data = this.restaurant;
        this.markersGroup.addLayer(marker);

        this.map.addLayer(this.markersGroup);
    }

    showMap() {
      setTimeout(() => {
          this.map = leaflet.map("map-detail").setView([this.lat, this.long], 30);
		  leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
			  attribution: 'Tiles &copy; Esri'
		  }).addTo(this.map);
          this.showMarkers();
      } )
    }

}
