import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateHeaders, Param } from '../helper/helper';

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: Param[]): Observable<T> {
    const headers = generateHeaders();
    const httpParams: HttpParams = new HttpParams();
    params?.forEach((x) => httpParams.append(x.name!, x.value!));
    // let isFirstParam = true;
    // let paramsString = '';
    // params?.forEach((param) => {
    //   if (isFirstParam) {
    //     isFirstParam = false;
    //     paramsString += '?';
    //   } else {
    //     paramsString += `&`;
    //   }
    //   paramsString += `${param.name}=${param.value}`;
    // });
    return this.http.get<T>(url, {
      headers: headers,
      params: httpParams,
    });
  }

  post<T>(url: string, body: Partial<T>) {
    const headers = generateHeaders();
    return this.http.post<T>(url, body, { headers: headers });
  }

  put<T>(url: string, body: T) {
    const headers = generateHeaders();
    return this.http.put<T>(url, body, { headers: headers });
  }

  delete<T>(url: string) {
    const headers = generateHeaders();
    return this.http.delete<T>(url, { headers: headers });
  }
}
