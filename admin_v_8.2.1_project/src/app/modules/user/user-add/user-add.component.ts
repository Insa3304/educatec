import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent {
  @Output() UserC: EventEmitter<any> = new EventEmitter();

  name : any = null;
  surname : any = null;
  email : any = null;
  password : any = null;
  confirmation_password : any =null;

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
  }
  cerrarModal(): void{
    this.modal.dismiss(); //cerrar ventana emergente
  }
  //registrarusuario():void{
    //this.isLoading= this.userService.isLoading$;
  //}

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
      if(!this.name || !this.surname || !this.email || !this.password ||!this.confirmation_password || !this.file_avatar){
        this.toastr.error('NECESITAS LLENAR TODOS LOS CAMPOS' , 'ATENCIÓN');
        return;
      }
      if(this.password !=this.confirmation_password){
        this.toastr.error('LAS CONTRASEÑAS NO SON IGUALES','ATENCION')
        return;

      }
      
    
    let formData = new FormData();
      formData.append("name", this.name);
      formData.append("surname", this.surname);
      formData.append("email", this.email);
      formData.append("password", this.password);
      formData.append("role_id","1");
      formData.append("type_user","2");
      formData.append("imagen",this.file_avatar);

      this.userService.register(formData).subscribe((resp:any) =>{ // recibimos la respuesta del backend
        console.log(resp);
        this.UserC.emit(resp.user);
        this.toastr.success('USUARIO REGISTRADO CORRECTAMENTE','EXITO');
        this.modal.close();
      })

}
}


