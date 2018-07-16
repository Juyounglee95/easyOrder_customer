import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import * as firebase from 'firebase';

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

    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();
		firebase.initializeApp(config);
		firebase.auth().onAuthStateChanged((user)=>{
			if(user){
				this.rootPage = 'page-home';
			}else{
				this.rootPage = 'page-auth';
			}
		})


        this.homeItem = { component: 'page-home' };
        this.messagesItem = { component: 'page-message-list'};


        this.appMenuItems = [
            // {title: 'Restaurants', component: 'page-restaurant-list', icon: 'home'},
            {title: 'Order', component: 'page-dish-list', icon: 'camera'},
            {title: 'Nearby', component: 'page-nearby', icon: 'compass'},
            {title: 'Waiting', component: 'page-category', icon: 'albums'},
            {title: 'Latest Orders', component: 'page-orders', icon: 'list-box'},
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
