import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReviewPage } from './review';
import { Ionic2RatingModule } from "ionic2-rating";
@NgModule({
  declarations: [
    ReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(ReviewPage),
	  Ionic2RatingModule
  ],exports: [
		ReviewPage
	]
})
export class ReviewPageModule {}
