import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, ToastController, PopoverController, ModalController } from 'ionic-angular';

import {RestaurantService} from '../../providers/restaurant-service-mock';
import * as firebase from "firebase";
import 'firebase/firestore'
@IonicPage({
	name: 'page-home',
	segment: 'home',
	priority: 'high'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  restaurants: Array<any>;
  searchKey: string = "";
  thumbnail=["assets/img/restaurants/burgerking.png", "assets/img/restaurants/zzomae.png"];
  yourLocation: string = "Gongreung 58 130, Seoul";
	public restCollection : any;
	public  db = firebase.firestore();
  constructor(public navCtrl: NavController, public menuCtrl: MenuController, public popoverCtrl: PopoverController, public locationCtrl: AlertController, public modalCtrl: ModalController, public toastCtrl: ToastController, public service: RestaurantService) {
		this.menuCtrl.swipeEnable(true, 'authenticated');
		this.menuCtrl.enable(true);
		this.findAll();
  }

  openRestaurantListPage(proptype) {
  	this.navCtrl.push('page-restaurant-list', proptype);
  }

  openRestaurantFilterPage() {
    let modal = this.modalCtrl.create('page-restaurant-filter');
    modal.present();
  }

  openNearbyPage() {
    this.navCtrl.push('page-nearby');
  }

  openOrders() {
    this.navCtrl.push('page-orders');
  }

  openCart() {
    this.navCtrl.push('page-cart');
  }

	openRestaurantDetail(id: any) {

  	this.navCtrl.push('page-restaurant-detail', {
			'id': this.restaurants[id].location
		});
	}

  openSettingsPage() {
  	this.navCtrl.push('page-settings');
  }

  openNotificationsPage() {
  	this.navCtrl.push('page-notifications');
  }

  openCategoryPage() {
    this.navCtrl.push('page-category');
  }

	onInput(event) {
	    this.service.findByName(this.searchKey)
	        .then(data => {
	            this.restaurants = data;
	        })
	        .catch(error => alert(JSON.stringify(error)));
	}

	onCancel(event) {
	    this.findAll();
	}

	async restAsync(){
		let val  = await this._rest();
		return val;
	}

	_rest():Promise<any> {
		return new Promise<any>(resolve => {
			var rest:Array<any>=[];
			var store : Array<any>=[];
			this.restCollection = this.db.collection("store").get().then(function (querySnapshot) {
				querySnapshot.forEach(function (doc) {
					rest.push({
						name: doc.data().name,
						info : doc.data().info,
						location : doc.data().location
					} );
					resolve(rest);
				})

			})


		})
	}
	findAll() {
		var rest_a = this.restAsync().then(rest_a=> this.restaurants= rest_a).catch();
		console.log(this.restaurants);
		// this.db.collection("store").get().then(function(querySnapshot) {
		// 	querySnapshot.forEach(function(doc) {
		// 		// doc.data() is never undefined for query doc snapshots
		// 		this.restaurants.push(doc.data().location);
		// 		console.log(doc.id, " => ", doc.data().location);
		// 	});
		// });
		// this.service.findAll()
		//     .then(data => this.restaurants = data)
		//     .catch(error => alert(error));
	}


	alertLocation() {
    let changeLocation = this.locationCtrl.create({
      title: 'Change Location',
      message: "Type your Address to change restaurant list in that area.",
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: data => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            let toast = this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create('page-notifications');
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
      this.navCtrl.canSwipeBack();
  }

}
