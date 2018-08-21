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
        this.proptype = this.navParams.get('proptype') || "";
        this.from = this.navParams.get('from') || "";
        // console.log(this.proptype);
    }
	async checkoutAsync(){
		let check = await this._check();
		return check;
	}
	start(){
		var success  = this.checkoutAsync().then(()=>{this.registerOrder();}).then(()=>{this.navCtrl.push('page-home');}).catch();
	}
	registerOrder(){
		console.log(this.owner)

		let body = {
			"notification":{
				"title":"New waiting is arrived",
				"body":this.order,
				"sound":"default",
				"click_action":"FCM_PLUGIN_ACTIVITY",
				"icon":"fcm_push_icon"
			},
			"data":{

			},
			"to":"/topics/"+this.store,
			"priority":"high",
			"restricted_package_name":""
		}
		let options = new HttpHeaders().set('Content-Type','application/json');
		this.http.post("https://fcm.googleapis.com/fcm/send",body,{
			headers: options.set('Authorization', 'key=AAAA94sqthU:APA91bF4quIXvQYLJlwp3mNMh6HdYpTGoDIIVOODLheD5LcLdge-JZhe4N2AaQjVMtqwDdQGhaXW4BMhkpEW9SuTwYWBuASd1bZGSaB_Me9sw3cCcUNlYa7NetC-BkX5OaBsLqFEJgRC'),
		})
			.subscribe();
	}

	_check():Promise<any>{
		return new Promise<any>(resolve => {
			var success = "success";
			this.date = new Date().toUTCString();
			var addDoc = this.db.collection('waiting').add({

				status : true,
				table_num : this.table,
				timestamp : this.date,
				user : firebase.auth().currentUser.email,
				store_code : this.store,
				id:""

			}).then(function(docRef) {

				console.log("Document written with ID: ", docRef.id);
				//	var docid = docRef.id.toString()
				var setid = docRef.update({
					id: docRef.id.toString()
				})
				resolve(success);

				console.log('Added document');
			});

			//   resolve(store);
		})
	}


}
