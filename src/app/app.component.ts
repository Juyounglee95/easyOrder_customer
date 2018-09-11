import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { FCM } from '@ionic-native/fcm';

export interface MenuItem {
    title: string;
    component: any;
    icon: string;
}
// Initialize Firebase
var config = {
	apiKey: "AIzaSyAQI9atTgFtDK5XTr23RcpsB-f9Gt8ngpo",
	authDomain: "easyordercustomer.firebaseapp.com",
	databaseURL: "https://easyordercustomer.firebaseio.com",
	projectId: "easyordercustomer",
	storageBucket: "easyordercustomer.appspot.com",
	messagingSenderId: "1063191754261"
};

@Component({
    templateUrl: 'app.html'
})

export class foodIonicApp {
    @ViewChild(Nav) nav: Nav;

  	tabsPlacement: string = 'bottom';
  	tabsLayout: string = 'icon-top';
	email:string='';
    rootPage: any = 'page-auth';

    showMenu: boolean = true;

    homeItem: any;

    initialItem: any;

    messagesItem: any;

    settingsItem: any;

    appMenuItems: Array<MenuItem>;

    yourRestaurantMenuItems: Array<MenuItem>;

    accountMenuItems: Array<MenuItem>;

    helpMenuItems: Array<MenuItem>;
	public  db :any;

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,private fcm: FCM) {
		firebase.initializeApp(config);
		firebase.auth().onAuthStateChanged((user)=>{
			if(user){
				this.rootPage = 'page-home';
				this.email=user.email;
				this.platform.ready().then(() => {
					this.db=firebase.firestore();
					this.fcm.getToken().then(token => {
						// Your best bet is to here store the token on the user's profile on the
						// Firebase database, so that when you want to send notifications to this
						// specific user you can do it from Cloud Functions.
					});
					console.log(this.email);
					this.fcm.subscribeToTopic(this.email).catch(reason => {});
					this.fcm.onNotification().subscribe(data => {
						if (data.wasTapped) {
							console.log("Received in background");
						} else {
							console.log("Received in foreground");
						}
					});
					this.fcm.onTokenRefresh().subscribe(token => {
						console.log(token);
					});

					this.statusBar.overlaysWebView(false);
					this.splashScreen.hide();
				});
				if (!this.platform.is('mobile')) {
					this.tabsPlacement = 'top';
					this.tabsLayout = 'icon-left';
				}
			}else{
				this.rootPage = 'page-auth';
			}
		})


        this.homeItem = { component: 'page-home' };
        this.messagesItem = { component: 'page-message-list'};


        this.appMenuItems = [
            // {title: 'Restaurants', component: 'page-restaurant-list', icon: 'home'},
			{title: 'Latest Orders', component: 'page-dish-list', icon: 'list-box'},
			{title: 'Order', component: 'page-orders', icon: 'camera'},
            {title: 'Nearby', component: 'page-nearby', icon: 'compass'},
            {title: 'Waiting', component: 'page-category', icon: 'albums'},
			{title: 'Events', component: 'page-event', icon: 'albums'},
			{title: 'Notice', component: 'page-notice', icon: 'list-box'},
            // {title: 'Cart', component: 'page-cart', icon: 'cart'},
			// {title: 'Favorite Restaurants', component: 'page-favorite-list', icon: 'heart'}
        ];

        this.yourRestaurantMenuItems = [
            {title: 'Register Restaurant', component: 'page-your-restaurant', icon: 'clipboard'}
        ];


        this.accountMenuItems = [
            {title: 'Login', component: 'page-auth', icon: 'log-in'},
            {title: 'My Account', component: 'page-my-account', icon: 'contact'},
            {title: 'Logout', component: 'page-auth', icon: 'log-out'},
        ];

        this.helpMenuItems = [
            {title: 'About', component: 'page-about', icon: 'information-circle'},
            {title: 'Support', component: 'page-support', icon: 'call'},
            {title: 'App Settings', component: 'page-settings', icon: 'cog'},
            // {title: 'Walkthrough', component: 'page-walkthrough', icon: 'photos'}
        ];

    }
	logout(){
		firebase.auth().signOut().then(function() {
			// Sign-out successful.
			console.log("logout");
		}).catch(function(error) {
			// An error happened.
			console.log("error");
		});
	}
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.overlaysWebView(false);
            this.splashScreen.hide();
        });

	    if (!this.platform.is('mobile')) {
	      this.tabsPlacement = 'top';
	      this.tabsLayout = 'icon-left';
	    }
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
