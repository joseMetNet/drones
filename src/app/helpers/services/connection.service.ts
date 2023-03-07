import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const baseApp = environment.backendUrl;

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(public http: HttpClient) {
  }

  /**
   * Function to return shortest route
   */
  getShortestRoute(data: any): Observable<any> {
    return this.http.get(`${baseApp}/shortestroute/`);
  }

  /**
   * autenticarUser
   * @param data
   * ```
   * data:{
   *   "email": "string",
   *   "password": "string"
   * }
   * ```
   * @returns
   * ```
   * {
   *   "idUser": 0,
   *   "name": "string",
   *   "idTypeUser": "string",
   *   "nameTypeUser": "string",
   *   "email": "string",
   *   "idProfile": "string",
   *   "nameProfile": "string",
   *   "photo": "string",
   *   "idCity": "string",
   *   "city": "string",
   *   "idStore": "string",
   *   "idStatus": "string",
   *   "password": "string",
   *   "valido": true,
   *   "result": {
   *     "valor": 0
   *   }
   * }
   * ```
   */
  autenticarUser(data: any) {
    return this.http.post(`${baseApp}/AutenticarUser/`, data);
  }

  /**
   * cuentasApi
   * @param data
   * ```
   * {
   *   "email": "string",
   *   "password": "string"
   * }
   * ```
   * @returns
   * ```
   * {
   *   "token": "string",
   *   "expiration": "2023-03-05T05:32:25.024Z"
   * }
   * ```
   */
  cuentasApi(data: any) {
    return this.http.post(`${baseApp}/api/CuentasApi/Login`, data);
  }

  /**
   * ## Create Stations
   * @param data
   * @returns
   */
  createStations(data: any) {
    return this.http.post(`${baseApp}/CreateStations`, data);
  }

  /**
   * ## Insert Coordinates
   * @param data
   * @returns
   */
  insertCoordinates(data: any) {
    return this.http.post(`${baseApp}/InsertCoordinates`, data);
  }

  /**
   * ## Create Restrictions
   * @param data
   * @returns
   */
  createRestrictions(data: any) {
    return this.http.post(`${baseApp}/CreateRestrictions`, data);
  }
}
