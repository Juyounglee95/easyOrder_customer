import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WriteEditReviewPage } from './write-edit-review';
import { Ionic2RatingModule } from "ionic2-rating";
@NgModule({
  declarations: [
    WriteEditReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(WriteEditReviewPage),
	  Ionic2RatingModule
  ],exports: [
	WriteEditReviewPage
]
})
export class WriteEditReviewPageModule {}
