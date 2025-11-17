import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit{
  accountDetails: any;
  transactionHistory: any[] = [];
  currentUser: any;
  currentUserSubscription: Subscription | undefined;
 
  constructor(private authService: MyApiCallsService) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.authService.currentUser.subscribe(
      (user) => {
        this.currentUser = user;
        if (this.currentUser) {
          this.createOrGetAccount();
        }
      }
    );
  }

  // Getter for credit transactions count
  get creditCount(): number {
    return this.transactionHistory.filter(t => t.transaction_type === 'credit').length;
  }

  // Getter for debit transactions count
  get debitCount(): number {
    return this.transactionHistory.filter(t => t.transaction_type === 'debit').length;
  }

  createOrGetAccount(): void {
    this.authService.createOrGetAccount(this.currentUser.user_id).subscribe(
      (res: any) => {
        console.log('createOrGetAccount response:', res);
        if (res && res.status === true) {
          this.accountDetails = res.account;
          console.log('Account details:', this.accountDetails);
          this.loadTransactionHistory(this.accountDetails.id);
        }
      },
      (error) => {
        console.error('Error in createOrGetAccount:', error);
      }
    );
  }
  
  loadTransactionHistory(accountId: string): void {
    console.log('Loading transaction history for account ID:', accountId);
    this.authService.getTransactionHistory(accountId).subscribe(
      (res: any) => {
        console.log('Transaction history response:', res);
        if (res && res.status === true) {
          this.transactionHistory = res.transactions;
          console.log(res.transactions);
          
        } else {
          console.error('Failed to fetch transaction history:', res.message);
        }
      },
      (error) => {
        console.error('Error fetching transaction history:', error);
      }
    );
  }
}
