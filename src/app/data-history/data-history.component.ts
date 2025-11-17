import { Component, OnInit, OnDestroy } from '@angular/core';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-history.component.html',
  styleUrls: ['./data-history.component.css']
})
export class DataHistoryComponent implements OnInit, OnDestroy {
  accountDetails: any;
  dataHistory: any[] = [];
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
  this.authService.getDataHistory(accountId).subscribe(
    (res: any) => {
      // Handle both array and object response
      if (Array.isArray(res)) {
        this.dataHistory = res;
      } else if (res && res.status === true && Array.isArray(res.dataHistory)) {
        this.dataHistory = res.dataHistory;
      } else {
        this.dataHistory = [];
        console.error('Failed to fetch data history:', res?.message);
      }
    },
    (error) => {
      this.dataHistory = [];
      console.error('Error fetching data history:', error);
    }
  );
}

  ngOnDestroy(): void {
    this.currentUserSubscription?.unsubscribe();
  }
}