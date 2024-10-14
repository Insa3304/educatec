import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Route, Router } from '@angular/router';

declare function  _clickDoc():any;
  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //clases : 
  //auth-login
  email:any = null;
  password:any = null;
  constructor(
    public authService: AuthService,
    public router: Router,
  ){}

    ngOnInit(): void{
      setTimeout(() =>{
        _clickDoc()
      }, 50);

      if(this.authService.user){ //redireccion automatica de usuarios autenticados, osea si estoy autenticado ya no tengo que tener acceso al login component
        this.router.navigateByUrl("/");
        return;
      }
    }
  login (){
    if(!this.email || !this.password){
      alert("Necesitas ingresar todos los campos")
      return;
    }
    this.authService.login(this.email,this.password).subscribe((resp:any)=> {
      console.log(resp);
      if(resp){
        window.location.reload(); //para que me redirija automaticamente a la pagina principal

      }else{
        alert("DATOS INCORRECTOS")
      }
    })
  }

}
