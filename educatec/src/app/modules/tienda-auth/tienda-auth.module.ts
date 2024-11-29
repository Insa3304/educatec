import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { TiendaAuthRoutingModule } from './tienda-auth-routing.module';
import { TiendaAuthComponent } from './tienda-auth.component';
import { ListCartsComponent } from './list-carts/list-carts.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileClientComponent } from './profile-client/profile-client.component';
<<<<<<< HEAD
import { PaymentComponent } from './payment/payment.component';
=======
import { CourseLeasonComponent } from './course-leason/course-leason.component';
>>>>>>> e4c9704a9393a7ec0cf9477c38538e85c41d3182




@NgModule({
  declarations: [
    TiendaAuthComponent,
    ListCartsComponent,
    ProfileClientComponent,
<<<<<<< HEAD
    PaymentComponent
=======
    CourseLeasonComponent
>>>>>>> e4c9704a9393a7ec0cf9477c38538e85c41d3182
  ],
  imports: [
    CommonModule,
    TiendaAuthRoutingModule,


    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,


    SharedModule,
  ]
})
export class TiendaAuthModule { }




