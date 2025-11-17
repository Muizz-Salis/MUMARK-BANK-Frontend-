import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { RouterModule } from '@angular/router';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Make sure this path is correct
})
export class LoginComponent {
  loginData: LoginData = { email: '', password: '' };
  message: string = '';

  constructor(private authService: MyApiCallsService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe(
      (res: any) => {
        if (res && res.status === true) {
          console.log('Login successful:', res.message);
          console.log('User ID:', res.user.userId);

          // Check user role and navigate accordingly
          if (res.user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']); // Adjust to your admin dashboard route
          } else if (res.user.role === 'user') {
            this.router.navigate(['/mainpage']);
          } else {
            this.message = 'Unknown role.';
          }
        } else {
          this.message = res.message || 'Login failed.';
        }
      },
      error => {
        console.error('Error during login:', error);
        this.message = 'An error occurred. Please try again.';
      }
    );
  }
}
