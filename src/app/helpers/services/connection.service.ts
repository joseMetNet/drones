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
  getShortestRoute(data:any):Observable<any> {
    return this.http.get(`${baseApp}/shortestroute/`);
  }
}
