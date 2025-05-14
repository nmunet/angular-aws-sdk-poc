import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token: string | null = null;

  constructor(private http: HttpClient) {}

  login(accessKey: string, secretKey: string, endpointUrl?: string) {
    const body = {
      access_key: accessKey,
      secret_key: secretKey,
      ...(endpointUrl && { endpoint_url: endpointUrl })
    };
    return this.http.post<{ token: string, arn: string }>('http://localhost:8000/login', body);
  }

  logout() {
    return this.http.post('http://localhost:8000/logout', {}, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }
}
