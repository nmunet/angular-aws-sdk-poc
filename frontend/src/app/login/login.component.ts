import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  accessKey = '';
  secretKey = '';

  isLoading = false;
  error: string | null = null;
  success: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    this.error = null;
    this.success = false;

    this.authService
      .authenticateUser({
        access_key: this.accessKey,
        secret_key: this.secretKey,
      })
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.authenticated) {
            this.success = true;
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 500);
          } else {
            this.error = res.error || 'Authentication failed';
          }
        },
        error: () => {
          this.isLoading = false;
          this.error = 'Could not connect to server';
        },
      });
  }
}
