import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MyApiCallsService } from '../service/my-api-calls.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  forgotData = {
    email: ''
  };
  message: string = '';
  messageType: string = '';
  isLoading: boolean = false;
  debugResetLink: string = '';

  constructor(
    private router: Router,
    private apiService: MyApiCallsService
  ) {}

  onSubmit(): void {
    if (!this.forgotData.email) {
      this.message = 'Please enter your email address';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.apiService.forgotPassword(this.forgotData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === true) {
          this.message = 'Password reset instructions have been sent to your email.';
          this.messageType = 'success';
          // For development: show debug reset link
          if (response.debug_reset_link) {
            this.debugResetLink = response.debug_reset_link;
          }
        } else {
          this.message = response.message || 'Email not found';
          this.messageType = 'error';
          this.debugResetLink = '';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'An error occurred. Please try again.';
        this.messageType = 'error';
        this.debugResetLink = '';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
