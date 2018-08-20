import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {DishService} from '../../providers/dish-service-mock';
import * as firebase from "firebase";
import 'firebase/firestore';

@IonicPage({
	name: 'page-dish-list',
	segment: 'dish-list'
})

@Component({
    selector: 'page-dish-list',
    templateUrl: 'dish-list.html'
})
export class DishListPage {
	dishes: Array<any>=[];
    orders: Array<any>=[];
	stores: Array<any>=[];
	code : Array<any>=[];
    public orderCollection :any;
    public storeCollection : any;
	public  db = firebase.firestore();
	public user:any;

    constructor(public navCtrl: NavController, public dishService: DishService) {
       this.dishes = this.dishService.findAll();
		this.openOrderList();
    }
    //

	async OrderListAsync(){
		let orderlist = await this._orderlist();
		return orderlist;
	}
    _orderlist():Promise<any>{
		return new Promise<any>(resolve => {
			var order: Array<any>=[];
			this.user = firebase.auth().currentUser.email;
			this.orderCollection = this.db.collection("order");
			this.user = this.user.toString();
			var orderRef = this.orderCollection.where("user", "==", this.user);
			var orderinfo = orderRef.get()
				.then(snapshot => {
					snapshot.forEach(doc => {
						order.push({
							menu : doc.data().menu,
							code : doc.data().store_code,
							time : doc.data().timestamp,
							id : doc.data().id,
							review : doc.data().review
							//status : doc.data().status
						});
					});
					resolve(order);
				})
				.catch(err => {
					console.log('Error getting documents', err);
				});

			//   resolve(store);
		})
    }

    getname(){
    	for(var i =0; i<this.orders.length; i++){
    		var code  = this.orders[i].code;
			var store  = this.storeListAsync(code).then(name => this.stores.push({
				name: name
			}))
				.then(()=> this.changeCode()).catch(err => {
				console.log('Error getting documents', err);
			});
			//	.then(()=>console.log("$$"));
		}

	}
	async storeListAsync(code){
		let storelist = await this._storelist(code);
		return storelist;
	}
	_storelist(code):Promise<any>{
		return new Promise<any>(resolve => {
			var store: Array<any>=[];
			var name : any;
			//this.user = firebase.auth().currentUser.email;
			this.storeCollection = this.db.collection("store");
			//this.user = this.user.toString();

				// console.log(code);
					var storeRef = this.storeCollection.where("code", "==", code);
					var storeinfo = storeRef.get()
						.then(snapshot => {
							snapshot.forEach(doc => {

									name = doc.data().name

							});
							//console.log(store);
							resolve(name);

						})
						.catch(err => {
							console.log('Error getting documents', err);
						});




				// resolve();


			//   resolve(store);
		}
		)
	}
	saveCode(){
    	for(var k =0; k<this.orders.length; k++){
			this.code[k] = this.orders[k].code;
		}

	}
	changeCode(){
		var temp = this.stores;
		//console.log(temp);
		//console.log(this.orders);
		//console.log(this.orders.length);
        //
        var length = this.stores.length;
    //	console.log(length);
        //

    	for (let k = 0; k < length; k++) {

    		this.orders[k].code = this.stores[k].name;
			// console.log(this.stores[k].name,"@@@@",k);

        }

	}
	openReview(id){
    	this.navCtrl.push('page-review',{
    		'store': this.orders[id].code,
			'menu': this.orders[id].menu,
			'time': this.orders[id].time,
			'code': this.code[id],
			'id': this.orders[id].id
		})
	}
	editReview(id){
		this.navCtrl.push('page-edit-review',{

			'id': this.orders[id].id
		})
	}
     openOrderList(){
		 var menu_a = this.OrderListAsync().then(order=> this.orders= order)
			 .then(()=>this.saveCode())
			 .then(()=>console.log(this.code))
			 .then(()=>this.getname())
			 .catch();

		// this.user = firebase.auth().currentUser.email;
		//  console.log(this.user);
	 }
    // openDishDetail(dish) {
    //     // this.navCtrl.push('page-dish-detail', {
	 //    //   'id': dish.id
	 //    // });
    // }

}
