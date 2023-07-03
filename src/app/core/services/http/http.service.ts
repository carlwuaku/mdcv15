import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  public constructURL(url: string, doNotEncode?: boolean): string {
    if (doNotEncode) {
      return `${environment.appSettings.api.host}${environment.appSettings.api.namespace}${url}`;
    }
    return encodeURI(
      `${environment.appSettings.api.host}${environment.appSettings.api.namespace}${url}`
    );
  }

  private getHeaders(additionalHeaders?: HttpHeaders): HttpHeaders {
    const result: HttpHeaders = new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "cache-control": "no-cache",
      Pragma: "no-cache",
      Expires: "Sat, 01 Jan 2000 00:00:00 GMT"
    });

    if (!additionalHeaders) {
      return result;
    } // No additional headers, do an early exit

    for (const key in additionalHeaders.keys()) {
      if (result.has(key)) {
        // Header already exists, update its value
        result.set(key, additionalHeaders.get(key)!);
        continue;
      }

      result.append(key, additionalHeaders.get(key)!);
    }

    return result;
  }

  

  public get<T>(url: string, doNotEncode?: boolean): Observable<T> {
    const headers = this.getHeaders();

    return this.httpClient.get<T>(this.constructURL(url, doNotEncode), { headers: headers }).pipe(
      map(data => {
        return data;
      })
    );
  }
  
}
