import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { CartService } from '../../providers/cart-service-mock';
import { InAppBrowser } from '@ionic-native/in-app-browser';



import * as firebase from "firebase";
import 'firebase/firestore';
import {HttpClient, HttpHeaders} from "@angular/common/http";

import { IamportService } from 'iamport-ionic-kcp';

@IonicPage({
	name: 'page-cart',
	segment: 'cart'
})

@Component({
	selector: 'page-cart',
	templateUrl: 'cart.html',
})

export class CartPage {
	public menus : Array<any>=[];
	orders: Array<any> = [];
	//totalVal: number = 0;
	public store : any ;
	public table: any;
	public  qtds: Array<any>=[];
	public menuCollection: any;
	public  db = firebase.firestore();
	public totalprice: number=0;
	owner:string='';
	order:string='';
	total:number=0;
	names:string='';
	date:string='';
	constructor(public navCtrl: NavController, public navParams: NavParams, public cartService: CartService,private alertCtrl: AlertController,  private http: HttpClient, public iamport: IamportService, private theInAppBrowser: InAppBrowser) {
		var table_a = this.get_t().then(table_a=> this.table= table_a);
		var store_a = this.get_s().then(store_a=> this.store = store_a)
			.then(()=>this.getmenu());
	}
	async menuAsync(){
		let menu = await this._menu();
		return menu;
	}
	async get_s(){
		let store = await this._store();
		return store;
	}
	async  get_t(){
		let table = await this._table();
		return table;

	}
	async checkoutAsync(){
		let check = await this._check();
		return check;
	}

	registerOrder(){
		let body = {
			"notification":{
				"title":"New order is arrived",
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
			headers: options.set('Authorization', 'key=AAAA94sqthU:APA91bHr4vPUOBDnGep_qDQu6Ig0UHad3QzYBm48v_BHd76kgvIeN7LpPNzztnoy1cLhpNq3D9gDqoKjRqSt1hbVn_BGVBWdsreoo_bikkczQxJSLPSArC3dwLQfpbeZSGfC0xexfDAQ'),
		})
			.subscribe();
	}

	_check():Promise<any>{
				return new Promise<any>(resolve => {
					var success = "success";
					this.date = new Date().toUTCString();
					for(let data of this.menus) {
						if(data.status>0) {
							this.names += data.name + ' : ' + data.status + ' ';
						}
					}
					var addDoc = this.db.collection('order').add({
						menu : this.names,
						status : true,
						table_num : this.table,
						timestamp : this.date,
						totalprice : this.totalprice,
						user : firebase.auth().currentUser.email,
						store_code : this.store,
						id:"",
						review: false
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
	_menu():Promise<any>{
		return new Promise<any>(resolve => {
			var menu: Array<any>=[];

			this.menuCollection = this.db.collection("menu");
			var menuRef = this.menuCollection.where("store_code", "==", this.store);
			var menuInfo = menuRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						menu.push({
							name : doc.data().menu,
							price : doc.data().price,
							status : doc.data().status
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
	_store():Promise<any> {
		return new Promise<any>(resolve => {
			this.store = this.navParams.get("store_code");
			this.owner = this.navParams.get("owner");
			resolve(this.store);
		})
	}
	_table():Promise<any> {
		return new Promise<any>(resolve => {

			this.table = this.navParams.get("table_num");
			resolve(this.table);
		})
	}

	getmenu(){
		var menu_a = this.menuAsync().then(menu_a=> this.menus= menu_a)
			.then(()=>console.log(this.menus)).catch();

	}

	count(){
		for(let data of this.menus) {
			console.log("pricepriceprice", data.status*data.price);
			//this.totalprice += data.status* data.price;
		}
	}
	// minus adult when click minus button
	minusQtd(index: any){
		if(this.menus[index].status>0) {
			this.menus[index].status--;
			this.totalprice -= this.menus[index].price;
		}
	}

	plusQtd(index: any) {
		this.menus[index].status++;
		this.totalprice += this.menus[index].price;
	}

	presentAlert() {
		this.order+='Table number : '+this.table+'<br/>';
		for(let i=0; i<this.menus.length;i++){
			this.order += this.menus[i].name + ':' + this.menus[i].status + '<br/>';
			this.total += this.menus[i].status * this.menus[i].price;
		}
		this.order +='Total price = \u20A9' + this.total;
		let alert = this.alertCtrl.create({
			title: "Order success!",
			subTitle : this.order,
			buttons: ['OK']
		});
		alert.present();
	}

	openCheckout() {
		console.log(this.owner);
		var success  = this.checkoutAsync().then(()=>{this.registerOrder();}).then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();
		//console.log("result:",success);


		//
	}
	payment(event) {
		const param = {
			pay_method : 'card',
			merchant_uid : 'merchant_' + new Date().getTime(),
			name : '주문명:결제테스트',
			amount : 1400,
			buyer_email : 'iamport@siot.do',
			buyer_name : '구매자이름',
			buyer_tel : '010-1234-5678',
			buyer_addr : '서울특별시 강남구 삼성동',
			buyer_postcode : '123-456',
			app_scheme : 'ionickcp' //플러그인 설치 시 사용한 명령어 "ionic cordova plugin add cordova-plugin-iamport-kcp --variable URL_SCHEME=ionickcp" 의 URL_SCHEME 뒤에 오는 값을 넣으시면 됩니다.
		};

		// 아임포트 관리자 페이지 가입 후 발급된 가맹점 식별코드를 사용
		this.iamport.payment("imp94907252",  {
			pay_method : "card",
			merchant_uid : this.owner + new Date().getTime(),
			name : "주문명:결제테스트",
			amount : this.totalprice,
			app_scheme : "ionickcp" //플러그인 설치 시 사용한 명령어 "ionic cordova plugin add cordova-plugin-iamport-kcp --variable URL_SCHEME=ionickcp" 의 URL_SCHEME 뒤에 오는 값을 넣으시면 됩니다.
		}).then((response)=> {
			//	console.log(response);
				if ( response.isSuccess() ) {
					//TODO : 결제성공일 때 처리
					var success  = this.checkoutAsync().then(()=>{this.registerOrder();}).then(()=> this.presentAlert()).then(()=>{this.navCtrl.push('page-home');}).catch();

					console.log(response);

				}else{

				}
			})
			.catch((err)=> {
				alert(err)
			})
		;
	}

}
