import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyApiCallsService } from '../service/my-api-calls.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetData = {
    token: '',
    newPassword: '',
    confirmPassword: ''
  };
  message: string = '';
  messageType: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: MyApiCallsService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetData.token = params['token'] || '';
      if (!this.resetData.token) {
        this.message = 'Invalid reset token';
        this.messageType = 'error';
      }
    });
  }

  onSubmit(): void {
    if (this.resetData.newPassword !== this.resetData.confirmPassword) {
      this.message = 'Passwords do not match';
      this.messageType = 'error';
      return;
    }

    if (this.resetData.newPassword.length < 6) {
      this.message = 'Password must be at least 6 characters long';
      this.messageType = 'error';
      return;
    }

    this.isLoading = true;
    this.apiService.resetPassword(this.resetData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === true) {
          this.message = 'Password reset successfully! You can now log in with your new password.';
          this.messageType = 'success';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.message = response.message || 'Failed to reset password';
          this.messageType = 'error';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.message = 'An error occurred. Please try again.';
        this.messageType = 'error';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
