import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TiendaGuestService {

  constructor(
    public http: HttpClient,
     public autService: AuthService,

  ) { }
  

  landingCourse(slug:string){
    let headers= new HttpHeaders({"Authorization": "Bearer "+this.autService.token});
    let URL = URL_SERVICIOS+"/ecommerce/course-detail/"+slug;
    return this.http.get(URL,{headers : headers});
  }
}
