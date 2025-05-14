import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <h2>Login with AWS Credentials</h2>
<form (ngSubmit)="login()">
  <input [(ngModel)]="accessKey" name="accessKey" placeholder="Access Key" required />
  <input [(ngModel)]="secretKey" name="secretKey" placeholder="Secret Key" required type="password" />
  <input [(ngModel)]="endpointUrl" name="endpointUrl" placeholder="S3 Endpoint URL (optional)" />
  <button type="submit">Login</button>
</form>

  `
})
export class LoginComponent {
  accessKey = '';
  secretKey = '';
  endpointUrl = ''; // Optional

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.accessKey, this.secretKey, this.endpointUrl).subscribe({
      next: res => {
        this.auth.setToken(res.token);
        alert(`Logged in as ${res.arn}`);
        this.router.navigate(['/home'])
      },
      error: err => alert('Login failed: ' + err.message)
    });
  }
}