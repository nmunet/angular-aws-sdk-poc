import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buckets',
  template: `
    <h2>S3 Buckets</h2>
    <button (click)="loadBuckets()">Load Buckets</button>
    <ul>
      <li *ngFor="let b of buckets">{{ b }}</li>
    </ul>
    <button align="center" (click)=logout()>Logout</button>
  `
})
export class HomeComponent {
  buckets: string[] = [];

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  loadBuckets() {
    const token = this.auth.getToken();
    if (!token) {
      alert('Not authenticated');
      this.router.navigate(['/login'])
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<string[]>('http://localhost:8000/buckets', { headers }).subscribe({
      next: data => this.buckets = data,
      error: err => console.log('Failed to load buckets')
    });
  }

  logout() {
    this.auth.logout().subscribe(res => {
      this.router.navigate(['/login'])
    })
  }
}
