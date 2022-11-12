import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateHeaders, Param } from '../helper/helper';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  constructor(private http: HttpClient) {}

  get(url: string, params?: Param[]): Observable<any> {
    const headers = generateHeaders();
    let isFirstParam = true;
    let paramsString = '';
    params?.forEach((param) => {
      if (isFirstParam) {
        isFirstParam = false;
      } else {
        paramsString += `&`;
      }
      paramsString += `${param.name}=${param.value}`;
    });
    return this.http.get(url + '?' + paramsString, { headers: headers });
  }

  post(url: string, body: any) {
    const headers = generateHeaders();
    return this.http.post(url, body, { headers: headers });
  }

  put(url: string, body: any) {
    const headers = generateHeaders();
    return this.http.put(url, body, { headers: headers });
  }

  delete(url: string) {
    const headers = generateHeaders();
    return this.http.delete(url, { headers: headers });
  }
}
