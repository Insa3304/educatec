import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiendaAuthService {
  urlMercadoPago = URL_SERVICIOS;
   headers = new HttpHeaders({'Authorization': 'Bearer '+this.authService.token});

  constructor(
    public http:HttpClient,
    public authService: AuthService,
  ) { }

  profileClient(){
      let URL = URL_SERVICIOS+"/ecommerce/profile";
      return this.http.post(URL,{},{headers: this.headers});
  }

  createPreference(idUsuario: number): Observable<any> {
    const URL = `${this.urlMercadoPago}/ecommerce/create-preference`; // Asegúrate de que esta URL sea correcta.
    const headers = this.headers; // Confirma que headers está correctamente configurado.

    return this.http.post(URL, idUsuario,{ headers });
  }

  getDetailsCart(): Observable<any> {
    const URL = `${this.urlMercadoPago}/ecommerce/cart/`;
    const headers = this.headers;

    return this.http.get(URL, { headers });
  }

}
