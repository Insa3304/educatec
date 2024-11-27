import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { TiendaAuthService } from '../service/tienda-auth.service';

@Component({
  selector: 'app-profile-client',
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.css']
})
export class ProfileClientComponent  implements OnInit{

  nav_option:number=1;

  enrolled_course_count:number = 0;
  active_course_count:number = 0;
  termined_course_count:number = 0;
  user: any= null;

  enrolled_courses:any= [];
  active_courses:any= [];
  termined_courses:any= [];

 constructor(
  public authService: AuthService,
  public tiendaAuth: TiendaAuthService,

 )
 {
 }
 ngOnInit(): void {
     this.tiendaAuth.profileClient().subscribe((resp:any)=>{
      console.log(resp);

     this.enrolled_course_count =resp.enrolled_course_count;
     this.active_course_count=resp.active_course_count;
      this.termined_course_count=resp.termined_course_count;
      this.user =resp.user;

      this.enrolled_courses=resp.enrolled_courses;
      this.active_courses=resp.active_courses;
      this.termined_courses=resp.termined_courses;
      
     })
 }
navOption(val:number){
  this.nav_option= val;
}

logout(){
  this.authService.logout();
}

}
