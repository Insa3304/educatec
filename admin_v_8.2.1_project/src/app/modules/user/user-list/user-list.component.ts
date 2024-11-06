import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {UserAddComponent} from '../user-add/user-add.component';
import { UserService } from '../service/user.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserDeleteComponent } from '../user-delete/user-delete.component';

@Component({

  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit{
  USERS:any =[];
  isLoading:any = null;

  search:any = null;
  state:any = null;

 constructor(
  public modalService: NgbModal,
  public userService: UserService,
 ) {}
 ngOnInit(): void{
  this.isLoading = this.userService.isLoading$;
  
    this.listUser();
  } 
 

  listUser(){
  this.userService.listUsers(this.search,this.state).subscribe((resp:any)=> {
    console.log(resp)//recibo todos los usuarios desde el backend de tipo admin
    this.USERS = resp.users.data;
 })
}
  openModalCreatedUser(){

 const modalRef= this.modalService.open(UserAddComponent,{centered: true, size: 'md'});
  
    modalRef.componentInstance.UserC.subscribe((User:any) => {
      console.log(User);
      
      this.USERS.unshift (User);
    })
    
  }

  editUser(USER:any){
    const modalRef= this.modalService.open(UserEditComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.user= USER; //componentInstance permite acceder a variables dentro de user component y setear el valor con alguna variable que desee(usuario)
    modalRef.componentInstance.UserE.subscribe((User:any) => {
      console.log(User);
      let INDEX =this.USERS.findIndex((item:any) => item.id == User.id);
      this.USERS[INDEX] = User;
    })
  }
  deleteUser(USER:any){
    const modalRef= this.modalService.open(UserDeleteComponent,{centered: true, size: 'md'});
    modalRef.componentInstance.user= USER; //componentInstance permite acceder a variables dentro de user component y setear el valor con alguna variable que desee(usuario)
    modalRef.componentInstance.UserD.subscribe((resp:any) => {
      
      let INDEX =this.USERS.findIndex((item:any) => item.id == USER.id);
      this.USERS.splice(INDEX,1);
    })

  }
}