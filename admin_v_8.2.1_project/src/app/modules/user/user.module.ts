import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDeleteComponent } from './user-delete/user-delete.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserAddComponent } from './user-add/user-add.component';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserEditComponent,
    UserDeleteComponent,
    UserAddComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientJsonpModule,
    FormsModule,
    NgbModule, //trabaja con ventanas emergentes
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule
  ]
})
export class UserModule { }
