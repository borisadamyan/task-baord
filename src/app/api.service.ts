import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getTickects() {
    return this.http.get('http://www.mocky.io/v2/5def635c2f000004178e09b1');
  }
}
