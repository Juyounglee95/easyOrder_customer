import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditReviewPage } from './edit-review';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    EditReviewPage,
  ],
  imports: [
    IonicPageModule.forChild(EditReviewPage),
	  Ionic2RatingModule
  ],exports: [
	EditReviewPage
]
})
export class EditReviewPageModule {}
