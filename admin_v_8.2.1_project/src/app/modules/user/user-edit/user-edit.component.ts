import { Component,EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
 @Input() user:any;

 @Output() UserE: EventEmitter<any> = new EventEmitter(); //salida hacia la clase padre

 name : any = null;
  surname : any = null;
  email : any = null;
  password : any = null;
  confirmation_password : any =null;
  state:any = 1;
  is_instructor:any = null;
  profesion: any = null;
  description :any = null;

  imagen_previsualiza: any= "./assets/media/avatars/300-6.jpg";
  file_avatar: any= null; //imagen que se desee subir
  isLoading:any;
  constructor(
    public userService: UserService,
    public toastr:ToastrService,
    public modal: NgbActiveModal,
  ){}

  ngOnInit():void{
    this.isLoading= this.userService.isLoading$; //conecto el isloading del user service con el de user add
    
    this.name=this.user.name;
    this.surname=this.user.surname;
    this.email=this.user.email;
    this.state=this.user.state;
    this.imagen_previsualiza=this.user.avatar;
    this.is_instructor = this.user.is_instructor;
    this.profesion= this.user.profesion;
    this.description= this.user.description;
  }
  cerrarModal(): void{
    this.modal.dismiss(); //cerrar ventana emergente
  }
  

  processAvatar($event: any) { //previsualización de imagen de perfil
    if ($event.target.files[0].type.indexOf("image") < 0) { 
      this.toastr.error('SOLO SE ACEPTAN IMAGENES', 'ATENCIÓN');
      return;
    }
    this.file_avatar =$event.target.files[0] // aqui se leera la imagen que quiera ser subida
    let reader = new FileReader();
    reader.readAsDataURL(this.file_avatar); //se lee en data URL
    reader.onloadend = () => this.imagen_previsualiza = reader.result; //luego se lee esta informacion  en base 64
  }
  store(){ 
      if(!this.name || !this.surname || !this.email){
        this.toastr.error('NECESITAS LLENAR TODOS LOS CAMPOS' , 'ATENCIÓN');
        return;
      }
      if(this.password){
      if(this.password !=this.confirmation_password){
        this.toastr.error('LAS CONTRASEÑAS NO SON IGUALES','ATENCION')
        return;

      }
    }
      
    
    let formData = new FormData();
      
      formData.append("name", this.name);
      formData.append("surname", this.surname);
      formData.append("email", this.email);
      formData.append("state", this.state);
      if(this.is_instructor){
        formData.append("is_instructor", this.is_instructor ? "1" : "0");
        formData.append("profesion", this.profesion);
      formData.append("description", this.description);
      }
      if(this.password){
        formData.append("password", this.password);
    }
      if(this.file_avatar){
        formData.append("imagen",this.file_avatar);
        
      }
    
      

      this.userService.update(formData,this.user.id).subscribe((resp:any) =>{ // recibimos la respuesta del backend
        console.log(resp);
        this.UserE.emit(resp.user); // emitir al padre
        this.toastr.success('EL USUARIO SE ACTUALIZO  CORRECTAMENTE','EXITO');
        this.modal.close();
      })

}
isInstructor(){
  this.is_instructor =!this.is_instructor;
}
}




 