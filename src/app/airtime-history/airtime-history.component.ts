import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-airtime-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './airtime-history.component.html',
  styleUrl: './airtime-history.component.css'
})
export class AirtimeHistoryComponent {
accountDetails: any;
  airtimeHistory: any[] = [];
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

  createOrGetAccount(): void {
    this.authService.createOrGetAccount(this.currentUser.user_id).subscribe(
      (res: any) => {
        if (res && res.status === true) {
          this.accountDetails = res.account;
          this.loadDataHistory(Number(this.accountDetails.id));
        }
      },
      (error) => {
        console.error('Error in createOrGetAccount:', error);
      }
    );
  }

loadDataHistory(accountId: number): void {
  this.authService.getAirtimeHistory(accountId).subscribe(
    (res: any) => {
      // Handle both array and object response
      if (Array.isArray(res)) {
        this.airtimeHistory = res;
      } else if (res && res.status === true && Array.isArray(res.airtimeHistory)) {
        this.airtimeHistory = res.airtimeHistory;
      } else {
        this.airtimeHistory = [];
        console.error('Failed to fetch airtime history:', res?.message);
      }
    },
    (error) => {
      this.airtimeHistory = [];
      console.error('Error fetching airtime history:', error);
    }
  );
}

  ngOnDestroy(): void {
    this.currentUserSubscription?.unsubscribe();
  }
}
