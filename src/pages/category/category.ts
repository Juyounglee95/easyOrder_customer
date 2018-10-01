import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import {CategoryService} from '../../providers/category-service-mock';
import * as firebase from "firebase";
import {NgProgress} from "@ngx-progressbar/core";
import {HttpClient} from "@angular/common/http";
import {OrdersService} from "../../providers/orders-service-mock";
import {
	CameraPreview,
	CameraPreviewDimensions,
	CameraPreviewOptions,
	CameraPreviewPictureOptions
} from "@ionic-native/camera-preview";
import * as Tesseract from "tesseract.js";

@IonicPage({
	name: 'page-category',
	segment: 'category'
})

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
	picture:string;
	resultText:string;
	lastOrders: Array<any> = [];
	croppedImage:string;
	public code:string;
	public table: any;
	public store : any;
	public storeCollection: any;
	public storeCode: any;
	public tableCode: any;
	public tableCollection: any;
	public  db = firebase.firestore();
	categories: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: CategoryService, private http: HttpClient,public ordersService: OrdersService, private cameraPreview: CameraPreview, public forgotCtrl : AlertController, public progress: NgProgress, public platform : Platform) {
	  this.platform.ready().then(()=>{
		  this.getPreview();
	  }
	  )
  }
	getPreview(){
		const cameraPreviewOpts: CameraPreviewOptions = {
			x: 0,
			y: 0,
			width: window.screen.width,
			height: 200,
			camera: 'rear',
			tapPhoto: false,
			previewDrag: false,
			toBack: false,
			alpha: 1
		};
		const dimensions : CameraPreviewDimensions = {
			height: 200
		}
		this.cameraPreview.setPreviewSize(dimensions);
		this.cameraPreview.startCamera(cameraPreviewOpts);
		// this.cameraPreview.onBackButton(){this.cameraPreview.stopCamera()};

	}
	ionViewDidLeave() {
		console.log("ionViewWillLeave...");
		this.cameraPreview.stopCamera();
	}
	ionViewDidEnter() {
		console.log("ionViewDidEnter...");
		const cameraPreviewOpts: CameraPreviewOptions = {
			x: 0,
			y: 0,
			width: window.screen.width,
			height: 200,
			camera: 'rear',
			tapPhoto: false,
			previewDrag: false,
			toBack: false,
			alpha: 1
		};
		this.cameraPreview.startCamera(cameraPreviewOpts);
	}

	tesser(croppedImage){
		Tesseract.recognize(croppedImage)
			.then(result => {
				this.resultText = result.text;
				var storecode=this.resultText.substr(0,3);
				this.storeCode = storecode;

				this.storeCollection = this.db.collection("store");
				var store_a = this.storeAsync().then(store_a=> this.store = store_a)
					.then(()=>{
						if(this.store[0]!= undefined){
							this.navCtrl.push('page-restaurant-list',{store_code :this.store});
						}
						else{
							let alert = this.forgotCtrl.create({
								title: 'Wrong Code',
								subTitle: 'Please enter correct code',
								buttons: ['OK']
							});
							alert.present();
						}
						// this.navCtrl.push('page-cart',{store_code :this.store , table_num: this.table});?\
					});
			}).finally(resultOrError => {

		});
	}
	openFavoriteListPage(){
		this.navCtrl.push('page-walkthrough');
	}
	takePicture(){
		const pictureOpts: CameraPreviewPictureOptions = {
			// width: 1088,
			height: 600,
			quality: 100
		}
		this.cameraPreview.takePicture(pictureOpts).then((imageData) => {

			this.picture = 'data:image/jpeg;base64,' + imageData;
			let canvas = document.createElement('canvas');
			canvas.width = window.screen.width;
			canvas.height = 200;
			document.getElementById("canvasContainer").appendChild(canvas);

			let context = canvas.getContext('2d');
			let image = document.createElement('img');

			image.onload = (()=>{
				context.drawImage(image,0,430,image.width,200, 0, 0, canvas.width, 200);
				let finalImage = canvas.toDataURL("image/jpeg",1.0);
				this.croppedImage = finalImage;
				this.tesser(this.croppedImage);
			});
			image.src=this.picture;
			let finalImage = canvas.toDataURL("image/jpeg",1.0);
			this.croppedImage = finalImage;
		}, (err) => {
			console.log(err);
		}).then(()=>{this.tesser(this.croppedImage)},(err) => {
			console.log(err);});
	}
	async  storeAsync(){
		let val = await this._store();
		return val;
	}

	_store():Promise<any> {
		return new Promise<any>(resolve => {
			var store='';
			this.storeCollection.where("code", "==", this.storeCode)
				.onSnapshot(function (querySnapshot) {
						querySnapshot.forEach(function (doc) {
								if(doc!=null){
									store = doc.data().code
									//.log(store);
									resolve(store);
								}else{
									this.navCtrl.push('page-category');
								}
							}
						)
					}
				);
			//   resolve(store);
		})
	}

}
