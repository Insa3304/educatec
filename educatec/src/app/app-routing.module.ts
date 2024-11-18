import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';

export const routes: Routes =[


  {
    path: '',
    loadChildren: () => import ("./modules/home/home.module").then(m => m.HomeModule),
  },

  {
    path: '',
    loadChildren: () => import ("./modules/tienda-guest/tienda-guest.module").then(m => m.TiendaGuestModule),
  },
  {
    path: 'auth',
    loadChildren: () => import ("./modules/auth/auth.module").then(m => m.AuthModule),
  },

  {
    path:'',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo:'error/404'
  }

]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
