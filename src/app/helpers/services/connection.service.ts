import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const baseApp = environment.backendUrl;

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':'Origin, X-Requested-With, Content-Type, Accept'
})
@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(public http: HttpClient) {
  }

  /**
   * Function to return shortest route
   */
  getShortestRoute(data: any): Observable<any>{
    return this.http.get(`${baseApp}/shortestroute/`,
    {
      headers: headers
    });
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
  autenticarUser(data: any): Observable<any>{
    return this.http.post(`${baseApp}/AutenticarUser/`, data,
    {
      headers: headers
    });
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
  cuentasApi(data: any): Observable<any> {
    return this.http.post(`${baseApp}/api/CuentasApi/Login`, data,
    {
      headers: headers
    });
  }

  /**
   * ## Create Stations
   * @param data
   * @returns
   */
  createStations(data: any): Observable<any> {
    return this.http.post(`${baseApp}/CreateStations`, data,
    {
      headers: headers
    });
  }

  /**
   * ## Insert Coordinates
   * @param data
   * @returns
   */
  insertCoordinates(data: any): Observable<any> {
    return this.http.post(`${baseApp}/InsertCoordinates`, data,
    {
      headers: headers
    });
  }

  /**
   * ## Create Restrictions
   * @param data
   * @returns
   */
  createRestrictions(data: any): Observable<any> {
    return this.http.post(`${baseApp}/CreateRestrictions`, data,
    {
      headers: headers
    });
  }

  calculateDistances(): Observable<any>{
    let data={}
    return this.http.post(`${baseApp}/CalculateDistances`, data,
    {
      headers: headers
    });
  }
  saveCloserSavings(): Observable<any>{
    let data={}
    return this.http.post(`${baseApp}/SaveCloserSavings`, data,
    {
      headers: headers
    });
  }
  saveCloserStation(): Observable<any>{
    let data={}
    return this.http.post(`${baseApp}/SaveCloserStation`, data,
    {
      headers: headers
    });
  }
  createPartialWay(): Observable<any>{
    let data={}
    return this.http.post(`${baseApp}/CreatePartialWay`, data,
    {
      headers: headers
    });
  }
  createFinalWay(): Observable<any>{
    let data={}
    return this.http.post(`${baseApp}/CreateFinalWay`, data,
    {
      headers: headers
    });
  }
}
