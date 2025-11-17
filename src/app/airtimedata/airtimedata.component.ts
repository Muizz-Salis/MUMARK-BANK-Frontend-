import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-airtimedata',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './airtimedata.component.html',
  styleUrls: ['./airtimedata.component.css']
})
export class AirtimedataComponent implements OnInit, OnDestroy {
  phoneNumber = '';
  dataPhoneNumber = '';
  dataPlan = '';
  amount: number | null = null;
  accountBalance = 0;
  dataPlans = ['500MB', '1GB', '2GB', '5GB', '10GB', '15GB', '20GB', '30GB', '40GB', '50GB'];
  currentUser: any;
  currentUserSubscription: Subscription | undefined;
  accountDetails: any;

  constructor(private snackBar: MatSnackBar, private apiService: MyApiCallsService) {}

  ngOnInit(): void {
    this.currentUserSubscription = this.apiService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadAccountDetails(user.user_id);
      }
    });
  }

  ngOnDestroy(): void {
    this.currentUserSubscription?.unsubscribe();
  }


  loadAccountDetails(userId: number): void {
    this.apiService.createOrGetAccount(userId).subscribe((res: any) => {
      if (res.status) {
        this.accountDetails = res.account;
        this.accountBalance = this.accountDetails.balance;
      }
    });
  }

  openSnackBar(message: string, action: string = 'Close') {
    this.snackBar.open(message, action, { duration: 3000, verticalPosition: 'top' });
  }

  buyAirtime() {
    if (!this.phoneNumber || !this.amount) {
      this.openSnackBar('Please fill all airtime fields.');
      return;
    }
    this.apiService.buyAirtime(this.accountDetails.id, this.phoneNumber, this.amount).subscribe((res: any) => {
      if (res.status) {
        this.openSnackBar('Airtime purchased successfully!');
        this.updateBalance();
      } else {
        this.openSnackBar(res.message || 'Failed to purchase airtime.');
      }
    }, () => {
      this.openSnackBar('Error purchasing airtime.');
    });
  }

  buyData() {
    if (!this.dataPhoneNumber || !this.dataPlan || !this.amount) {
      this.openSnackBar('Please fill all data purchase fields.');
      return;
    }
    this.apiService.buyData(this.accountDetails.id, this.dataPhoneNumber, this.dataPlan, this.amount).subscribe((res: any) => {
      if (res.status) {
        this.openSnackBar('Data purchased successfully!');
        this.updateBalance();
      } else {
        this.openSnackBar(res.message || 'Failed to purchase data.');
      }
    }, () => {
      this.openSnackBar('Error purchasing data.');
    });
  }

  updateBalance() {
    this.apiService.getAccountBalance(this.accountDetails.id).subscribe(
      (balance: number) => this.accountBalance = balance,
      () => this.openSnackBar('Failed to update balance.')
    );
  }
}
