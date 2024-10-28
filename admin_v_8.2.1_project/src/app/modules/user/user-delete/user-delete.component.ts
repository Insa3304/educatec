import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent {
  @Input() user:any;

@Output() UserD: EventEmitter<any> = new EventEmitter();
isLoading:any;
constructor(
 
public userService: UserService,
    public toastr:ToastrService,
    public modal: NgbActiveModal,
  ){}
  ngOnInit():void{
    this.isLoading= this.userService.isLoading$; 
  }
  delete(){
    this.userService.deleteUser(this.user.id).subscribe((resp)=>{
      this.UserD.emit("");
      this.toastr.error('USUARIO ELIMINADO','ATENCIÓN');
      this.modal.dismiss();
    })
  }
}
