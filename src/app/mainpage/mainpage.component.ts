import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent implements OnInit, OnDestroy{
  currentUser: any;
  currentUserSubscription: Subscription | undefined;
  accountNumber: string = '';
  balance: number = 0;
  isLoadingAccount: boolean = false;

  constructor(public authService:MyApiCallsService){}

ngOnInit(): void {
  this.currentUserSubscription = this.authService.currentUser.subscribe(
    (user) => {
      this.currentUser = user;
      console.log('=== MAINPAGE DEBUG ===');
      console.log('Current user received:', this.currentUser);
      
      if (this.currentUser) {
        console.log('User ID:', this.currentUser.userId || this.currentUser.user_id || this.currentUser.id);
        console.log('Account Number:', this.currentUser.account_number);
        console.log('Balance:', this.currentUser.balance);
        
        // Check if user has account number, if not generate one
        if (this.currentUser.account_number) {
          this.accountNumber = this.currentUser.account_number;
          this.balance = this.currentUser.balance || 0;
          console.log('✓ Account number found:', this.accountNumber);
          
          // Refresh balance from database on page load
          this.refreshBalance();
        } else {
          console.log('✗ No account number, attempting to generate...');
          const userId = this.currentUser.userId || this.currentUser.user_id || this.currentUser.id;
          if (userId) {
            console.log('Calling generateAccountNumber with userId:', userId);
            this.generateAccountNumber();
          } else {
            console.error('ERROR: No user ID available for account generation');
            console.log('Available user keys:', Object.keys(this.currentUser));
          }
        }
      } else {
        console.log('No user logged in');
      }
      console.log('=== END DEBUG ===');
    }
  );
}

refreshBalance(): void {
  if (this.accountNumber) {
    this.authService.getBalance(this.accountNumber).subscribe(
      (res: any) => {
        if (res.status) {
          this.balance = res.balance;
          console.log('✓ Balance refreshed:', this.balance);
        }
      },
      (error) => {
        console.error('Error refreshing balance:', error);
      }
    );
  }
}

generateAccountNumber(): void {
  const userId = this.currentUser.userId || this.currentUser.user_id || this.currentUser.id;
  console.log('generateAccountNumber called with userId:', userId);
  
  if (!userId) {
    console.error('No user ID found in currentUser:', this.currentUser);
    console.log('Available keys:', Object.keys(this.currentUser));
    return;
  }
  
  console.log('Starting account generation for user ID:', userId);
  this.isLoadingAccount = true;
  
  this.authService.generateAccountNumber(userId).subscribe(
    (res: any) => {
      console.log('Generate account response:', res);
      this.isLoadingAccount = false;
      
      if (res.status) {
        this.accountNumber = res.account_number;
        this.balance = res.balance;
        console.log('✓ Account generated successfully!');
        console.log('  Account Number:', this.accountNumber);
        console.log('  Balance:', this.balance);
      } else {
        console.error('✗ Failed to generate account:', res.message);
        alert('Failed to generate account number: ' + res.message);
      }
    },
    (error) => {
      console.error('✗ Error generating account:', error);
      this.isLoadingAccount = false;
      alert('Error generating account number. Check console for details.');
    }
  );
}

ngOnDestroy(): void {
  if (this.currentUserSubscription) {
    this.currentUserSubscription.unsubscribe();
  }
}

}
