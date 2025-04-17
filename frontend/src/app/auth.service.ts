import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthRequest {
  access_key: string;
  secret_key: string;
}

interface AuthResponse {
  authenticated: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private backendUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  authenticateUser(auth: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.backendUrl}/auth`, auth);
  }
}
