import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  depositData: any = {
    accountNumber: '',
    amount: 0,
    password: ''
  };
  accountName: string = '';
  message: string = '';
  isPasswordModalVisible: boolean = false;
  processing: boolean = false;

  constructor(private apiService: MyApiCallsService, private router: Router) {}

  ngOnInit(): void {}

  getAccountName(): void {
    if (this.depositData.accountNumber) {
      this.apiService.getAccountName(this.depositData.accountNumber).subscribe(
        (response) => {
          if (response && response.status === true) {
            this.accountName = response.accountName || '';
          } else {
            this.accountName = '';
            this.showMessage(response.message || 'Account not found');
          }
        },
        (error) => {
          console.error('Error fetching account name:', error);
          this.showMessage('Error fetching account name');
        }
      );
    }
  }

  openPasswordModal(): void {
    this.processing = true;
    setTimeout(() => {
      this.processing = false;
      this.isPasswordModalVisible = true;
    }, 2000);
  }

  closePasswordModal(): void {
    this.isPasswordModalVisible = false;
  }

  confirmDeposit(): void {
    this.processing = true;
    this.apiService.deposit(this.depositData).subscribe(
      (response) => {
        this.processing = false;
        if (response && response.status === true) {
          this.closePasswordModal();
          this.showMessage('✅ Deposit successful');
        } else {
          this.showMessage(response.message || '❌ Deposit failed');
        }
      },
      (error) => {
        console.error('Error making deposit:', error);
        this.processing = false;
        this.showMessage('❌ Deposit failed due to an error');
      }
    );
  }

  onDeposit(): void {
    if (!this.depositData.accountNumber || !this.depositData.amount) {
      this.showMessage('⚠ Please fill in all fields');
      return;
    }
    this.openPasswordModal();
  }

  // Helper to display message & auto-hide after 3 seconds
  private showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
