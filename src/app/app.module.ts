import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { foodIonicApp } from './app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser'

import { PipesModule } from '../pipes/pipes.module';
import {MessageService} from "../providers/message-service-mock";
import {RestaurantService} from "../providers/restaurant-service-mock";
import {DishService} from "../providers/dish-service-mock";
import {CategoryService} from "../providers/category-service-mock";
import {CartService} from "../providers/cart-service-mock";
import {OrdersService} from "../providers/orders-service-mock";
import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import {CameraPreview} from "@ionic-native/camera-preview";
import { NgProgressModule} from "@ngx-progressbar/core";
import { IamportService } from 'iamport-ionic-kcp';

@NgModule({
  declarations: [
    foodIonicApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(foodIonicApp, {
    	preloadModules: true,
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name: '__foodIonicDB',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    PipesModule,
	  NgProgressModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    foodIonicApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    RestaurantService,
    DishService,
    CategoryService,
    MessageService,
    CartService,
  	CameraPreview,
    OrdersService,
	  IamportService,
	  InAppBrowser,
	  {provide: ErrorHandler, useClass: IonicErrorHandler},
	  Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
