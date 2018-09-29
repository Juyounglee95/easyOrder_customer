import {Component} from '@angular/core';
import {IonicPage, NavController, ModalController} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import { Geolocation } from '@ionic-native/geolocation';
import leaflet from 'leaflet';
import * as firebase from "firebase";
import 'firebase/firestore'
@IonicPage({
	name: 'page-nearby',
	segment: 'nearby'
})

@Component({
    selector: 'page-nearby',
    templateUrl: 'nearby.html'
})
export class NearbyPage {

    restaurants: Array<any>=[];
    storecode :Array<any>=[];
    map;
    markersGroup;
    center : leaflet.PointTuple;
    public restCollection : any;
	public  db = firebase.firestore();
    constructor(public navCtrl: NavController, public service: RestaurantService, public modalCtrl: ModalController, public geolocation: Geolocation) {
     //   this.findAll();

    }
    //
    // openRestaurantFilterPage() {
    //   let modal = this.modalCtrl.create('page-restaurant-filter');
    //   // modal.onDidDismiss(data => {
    //   //   console.log(data);
    //   // });
    //   modal.present();
    // }
    //
    openRestaurantDetail(restaurant: any) {
  		this.navCtrl.push('page-restaurant-detail', {
				'id': restaurant
			});
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
					rest.push(doc.data().location );
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

    showMarkers() {
        if (this.markersGroup) {
            this.map.removeLayer(this.markersGroup);
        }
        this.markersGroup = leaflet.layerGroup([]);
        this.restaurants.forEach(restaurant => {
        	var restlocation = restaurant.split(",");
        	var lat = restlocation[0];
        	var long = restlocation[1];
            if (restlocation[0], restlocation[1]) {
                let marker: any = leaflet.marker([lat,long]).on('click', event => this.openRestaurantDetail(restaurant));
                marker.data = restaurant;
                this.markersGroup.addLayer(marker);
            }
        });
        this.map.addLayer(this.markersGroup);
    }

    ionViewDidLoad() {
        setTimeout(() => {
			this.geolocation.getCurrentPosition().then(pos => {
				this.center = [ pos.coords.latitude, pos.coords.longitude];
				var p1 = new leaflet.latLng(pos.coords.latitude+0.0035,pos.coords.longitude+0.0035); //  [pos.coords.latitude+0.005,pos.coords.longitude+0.005];
				var p2 = new leaflet.latLng(pos.coords.latitude-0.0035,pos.coords.longitude-0.0035);
				var bounds =  new leaflet.latLngBounds(p1, p2);
				this.map = leaflet.map("nearby-map",{
					// Zoom: 30,
					 minZoom:10,
					// maxZoom : 50,
					maxBounds : 50
				}).setView([pos.coords.latitude, pos.coords.longitude],30);
				// this.map = leaflet.map("nearby-map").setView([pos.coords.latitude, pos.coords.longitude], 30);

				leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {

					attribution: 'Tiles &copy; Esri'
				}).addTo(this.map);
				var myIcon = leaflet.icon({
					iconUrl: 'assets/leaflet/images/map-marker4.png'

				});
			//	L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
				var marker = new leaflet.Marker(this.center, {icon:myIcon});

				this.map.addLayer(marker);

			var rest_a = this.restAsync().then(rest_a=> this.restaurants= rest_a).then(()=>{

					this.showMarkers();
					console.log(this.restaurants);
					console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
				});
			})
			// this.geolocation.getCurrentPosition().then(pos => {
			// 	this.map = leaflet.map("nearby-map").setView([pos.coords.latitude, pos.coords.longitude], 30);
			// 	leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
			// 		attribution: 'Tiles &copy; Esri'
			// 	}).addTo(this.map);
			// 	//this.showMarkers();
			// 	console.log(this.restaurants);
			// 	console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
			// });

			// const watch = geolocation.watchPosition().subscribe(pos => {
			// 	console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
			// });
			// watch.unsubscribe();
            // this.map = leaflet.map("nearby-map").setView([42.361132, -71.070876], 14);
            // leaflet.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
             //    attribution: 'Tiles &copy; Esri'
            // }).addTo(this.map);
            // this.showMarkers();
        })
    }

}
