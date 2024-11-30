import { Component, OnInit } from '@angular/core';
import { HomeService } from './services/home.service';
import { CartService } from '../tienda-guest/service/cart.service';
import { Router } from '@angular/router';


declare var $:any ;
declare function HOMEINIT([]):any;
declare function alertWarning([]):any;
declare function alertDanger([]):any;
declare function alertSuccess([]):any;



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  
  CATEGORIES: any=[];
  COURSES_HOME: any=[];
  group_courses_categories: any = [];
  user:any=null;
  constructor(
    public homeService: HomeService,
    public cartService:CartService,
    public router: Router,

  ){
    setTimeout(() => {
      HOMEINIT($);
    }, 50);
  }


  ngOnInit(): void {
   
    this.homeService.home().subscribe((resp:any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.COURSES_HOME = resp.courses_home.data;
      this.group_courses_categories = resp.group_courses_categories;
    })
    this.user = this.cartService.authService.user;
  }

  getTotalPrice(COURSE:any){
    return COURSE.precio;
  }
  addCart(LANDING_COURSE:any){
    if(!this.user){
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    let data ={
       
        course_id:LANDING_COURSE.id,
        total: this.getTotalPrice(LANDING_COURSE) ,
    };

    this.cartService.registerCart(data).subscribe((resp:any)=>{
      if(resp.message ==403){
          alertDanger(resp.message_text);
        return;
      }else{
        this.cartService.addCart(resp.cart);
        alertSuccess("CURSO AGREGADO CORRECTAMENTE");
      }
    })
 
}

}



