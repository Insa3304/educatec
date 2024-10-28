import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isLoading$: Observable<boolean>; //variables que nos permitiran renderizar la vista en donde este el servicio
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  listUsers(search:any,state:any){
    
    this.isLoadingSubject.next(true);

    let headers = new HttpHeaders({'Autorization': 'Bearer' + this.authservice.token});
    let LINK = "?T=";
    if(search){
      LINK +="&search="+search;

    }
    if(state){
      LINK +="&state="+state;
    }

    let URL = URL_SERVICIOS + "/users"+LINK;

    return this.http.get(URL,{headers: headers}).pipe
    (finalize(() => this.isLoadingSubject.next(false))); 

  }

  register(data:any){

    this.isLoadingSubject.next(true);

    let headers = new HttpHeaders({'Autorization': 'Bearer' + this.authservice.token});

    let URL = URL_SERVICIOS + "/users";

    return this.http.post(URL,data,{headers: headers}).pipe
    (finalize(() => this.isLoadingSubject.next(false))); // retornara la url y la data del nuevo registro
  }
  update(data:any, user_id:string){

    this.isLoadingSubject.next(true);

    let headers = new HttpHeaders({'Autorization': 'Bearer' + this.authservice.token});

    let URL = URL_SERVICIOS + "/users/"+user_id;

    return this.http.post(URL,data,{headers: headers}).pipe
    (finalize(() => this.isLoadingSubject.next(false)));
  }

  deleteUser(user_id:string)
{
  this.isLoadingSubject.next(true);

    let headers = new HttpHeaders({'Autorization': 'Bearer' + this.authservice.token});

    let URL = URL_SERVICIOS + "/users/"+user_id;

    return this.http.delete(URL,{headers: headers}).pipe
    (finalize(() => this.isLoadingSubject.next(false)));
}}
