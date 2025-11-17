import { Component } from '@angular/core';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  depositData: any = {
    accountNumber: '',
    amount: 0,
    password: ''
  };
  accountName: string = '';  // Added accountName to hold the retrieved name
  message: string = '';
  isPasswordModalVisible: boolean = false;
  processing: boolean = false;

  constructor(private apiService: MyApiCallsService, private router: Router) {}

  // Fetch account holder's name based on account number
  getAccountName() {
    if (this.depositData.accountNumber) {
      this.apiService.getAccountName(this.depositData.accountNumber).subscribe(
        (response) => {
          if (response && response.status === true) {
            this.accountName = response.accountName;  // Set account holder's name
          } else {
            this.accountName = '';  // Clear account name if not found
            this.message = response.message || 'Account not found';
          }
        },
        (error) => {
          this.message = 'Error fetching account name';
        }
      );
    }
  }

  // Open the password confirmation modal
  openPasswordModal() {
    this.processing = true;

    // Show "Processing" for 2 seconds before displaying the password modal
    setTimeout(() => {
      this.processing = false;
      this.isPasswordModalVisible = true;
    }, 2000);  // 2 seconds delay
  }

  // Close the modal
  closePasswordModal() {
    this.isPasswordModalVisible = false;
  }

  // Confirm deposit action (password entered)
  confirmDeposit() {
    this.processing = true;

    // Make the deposit API call with password
    this.apiService.deposit(this.depositData).subscribe(
      (response) => {
        if (response && response.status === true) {
          // First, close the modal
          this.closePasswordModal();

          // Show success message after a short delay
          setTimeout(() => {
            this.message = 'Deposit successful';
            this.processing = false;

            // Navigate to user profile after showing the success message
            setTimeout(() => {
              this.router.navigate(['/profile']);
            }, 2000); // Delay navigation to allow message to be visible
          }, 500); // Delay before showing success message to ensure modal closes
          
        } else {
          this.message = response.message || 'Deposit failed';
          this.processing = false;
        }
      },
    );
  }

  // Initial deposit action (opens modal)
  onDeposit() {
    if (!this.depositData.accountNumber || !this.depositData.amount) {
      this.message = 'Please fill in all fields';
      return;
    }
    // Open modal to confirm password before proceeding with the deposit
    this.openPasswordModal();
  }
}
