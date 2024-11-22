import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TiendaGuestService } from '../service/tienda-guest.service';


declare function courseView():any;

@Component({
  selector: 'app-courses-detail',
  templateUrl: './courses-detail.component.html',
  styleUrls: ['./courses-detail.component.css']
})
export class CoursesDetailComponent implements OnInit{
 SLUG:any = null;
 LANDING_COURSE: any=null;
  constructor(
    public activeRouter: ActivatedRoute,
    public tiendaGuestService: TiendaGuestService,
  ) {
   
  }


  ngOnInit(): void {
    this.activeRouter.params.subscribe((resp:any)=>{
      console.log(resp);
      this.SLUG = resp.slug;
    })
    this.tiendaGuestService.landingCourse(this.SLUG).subscribe((resp:any)=>{
      console.log(resp);
      this.LANDING_COURSE=resp.course;
    })
  setTimeout(()=>{
    courseView()
  },50);
 
    }
  }
