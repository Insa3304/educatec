import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service';
import { CartService } from '../service/cart.service';


declare function courseView():any;
declare function showMoreBtn():any;
declare function magnigyPopup():any;
declare function alertDanger([]):any;
declare function alertWarning([]):any;
declare function alertSuccess([]):any;


@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.css']
})
export class CoursesDetailComponent implements OnInit{
 SLUG:any = null;
 LANDING_COURSE: any=null;
 user: any =null;

 is_have_course:any = false;

  constructor(
    public activedRouter: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService,
    public cartService: CartService,
    public router:Router,
  ) {
   
  }


  ngOnInit(): void {
    this.activedRouter.params.subscribe((resp:any)=>{
      console.log(resp);
      this.SLUG = resp.slug;
    })
    this.tiendaGuestService.landingCourse(this.SLUG).subscribe((resp:any)=>{
      console.log(resp);
      this.LANDING_COURSE=resp.course;
      
      
      this.is_have_course = resp.is_have_course;
    })

    
    

  setTimeout(()=>{
    courseView();
    showMoreBtn();
  },50);

   this.user= this.cartService.authService.user;
   
  }
  getTotalPrice(COURSE:any){
    return COURSE.precio;

  }
 
  addCart(){
    if(!this.user){
      alertWarning("NECESITAS REGISTRARTE EN LA TIENDA");
      this.router.navigateByUrl("auth/login");
      return;
    }
    let data ={
       //user_id:this.LANDING_COURSE,
        course_id: this.LANDING_COURSE.id,
        total: this.getTotalPrice(this.LANDING_COURSE),
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

