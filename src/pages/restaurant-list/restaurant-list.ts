import {Component} from '@angular/core';
import {
	IonicPage,
	Config,
	NavController,
	NavParams,
	ToastController,
	ModalController,
	AlertController
} from 'ionic-angular';
import {RestaurantService} from '../../providers/restaurant-service-mock';
import leaflet from 'leaflet';

import * as firebase from "firebase";
import 'firebase/firestore';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@IonicPage({
	name: 'page-restaurant-list',
	segment: 'restaurant-list'
})

@Component({
    selector: 'page-restaurant-list',
    templateUrl: 'restaurant-list.html'
})
export class RestaurantListPage {
	orders: Array<any> = [];
	public store : any ;
	public table: any;
	public menuCollection: any;
	public  db = firebase.firestore();
	waitingNumber=0;
	owner:string='';
	order:string='';
	total:number=0;
	names:string='';
	date:string='';

    restaurants: Array<any>;
    searchKey: string = "";
    viewMode: string = "list";
    proptype: string;
    from: string;
    map;
    markersGroup;

    constructor(public navCtrl: NavController, public navParams: NavParams, public service: RestaurantService, public toastCtrl: ToastController, public modalCtrl: ModalController, public config: Config, private alertCtrl: AlertController,  private http: HttpClient) {
        this.store = this.navParams.get('store_code');
        this.start();
        // console.log(this.proptype);
    }
    start(){
		var abc =this.startAsync().then(num => this.waitingNumber = num);
	}
	async startAsync(){
		let check = await this._start();
		return check;
	}
	_start():Promise<any>{
		return new Promise<any>(resolve => {
			var wn = 0;
			let order : number=0;
			this.db.collection(this.store).get().then(function(querySnapshot) {
				querySnapshot.forEach(doc => {
					if(doc.data().user == firebase.auth().currentUser.email){
						order=doc.data().order;
					}
				});
				if(order==0 || order==null){
					resolve(0);
				}else{
					querySnapshot.forEach(doc =>{
						if(order>doc.data().order){
							wn++;
						}
					});
					resolve(wn);
				}
			});
		})
	}

	waiting(){
		var abc =this.checkoutAsync().then(num => {
			console.log("num:"+num)
			if(num==-1){

			}else{
				var wait = this.waitAsync().then(wm => {
					this.waitingNumber=wm;
				})
			}
		});
	}

	async checkoutAsync(){
		let check = await this._check();
		return check;
	}

	_check():Promise<any>{
		return new Promise<any>(resolve => {
			this.db.collection(this.store).get().then(function(querySnapshot) {
				querySnapshot.forEach(doc => {
					console.log(doc.data().user)
					if(doc.data().user == firebase.auth().currentUser.email){
						resolve(-1);
					}
				});
				resolve(1);
			})
		});
	}

	async waitAsync(){
		let wait = await this._wait();
		return wait;
	}
	_wait():Promise<any>{
		return new Promise<any>(resolve => {
			let order = 0;
			let size = 0;
			this.db.collection(this.store).get().then(function(querySnapshot) {
				querySnapshot.forEach(doc => {
					if(size<doc.data().order && doc.data().order!=null){
						size=doc.data().order
					}
				});
				size = size+1;
			}).then(success=>{
				var addDoc = this.db.collection(this.store).add({
					user: firebase.auth().currentUser.email,
					order : size
				}).then(success=>{
					resolve(size);
				});
			})
		});
	}
}
