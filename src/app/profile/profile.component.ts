import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy{
  accountDetails: any;
  transactionHistory: any[] = [];
  currentUser: any;
  currentUserSubscription: Subscription | undefined;
  profilePictureSubscription: Subscription | undefined;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profilePictureUrl: string = '';

constructor(public authService:MyApiCallsService){}

ngOnInit(): void {
  this.authService.profilePicture.subscribe(url => {
    this.profilePictureUrl = url;
  });
  this.currentUserSubscription = this.authService.currentUser.subscribe(
    (user) => {
      this.currentUser = user;
      if (this.currentUser) {
        this.profilePictureUrl = this.currentUser.profile_picture ? `http://localhost/bankapp/pictures/${this.currentUser.profile_picture}` : '';
        this.createOrGetAccount();
      }
    }
  );
  this.profilePictureSubscription = this.authService.profilePicture.subscribe(
    (url) => {
      this.profilePictureUrl = url;
    }
  );
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

ngOnDestroy(): void {
  
  if (this.currentUserSubscription) {
    this.currentUserSubscription.unsubscribe();
  }
  if (this.profilePictureSubscription) {
    this.profilePictureSubscription.unsubscribe();
  }
}




uploadProfilePicture(): void {
  const file = this.fileInput.nativeElement.files?.[0]; 

  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', this.currentUser.user_id);

    this.authService.uploadProfilePicture(formData).subscribe(
      (res: any) => {
        if (res && res.success) {
          // Update the currentUser with the new profile picture filename
          this.currentUser.profile_picture = res.profile_picture;
          this.profilePictureUrl = res.profile_picture;
          // Update the profile picture in the service
          this.authService.updateUser(this.currentUser);
          console.log('Profile picture uploaded successfully:', res.message);
        } else {
          console.error('Error uploading profile picture:', res.error);
          alert('Upload failed: ' + (res.error || 'Unknown error'));
        }
      },
      (error) => {
        console.error('Error uploading profile picture:', error);
        alert('Upload failed: ' + (error.error?.error || error.message || 'Unknown error'));
      }
    );
  } else {
    alert('Please select a file to upload');
  }
}




// loadAccountDetails(): void {
//   this.authService.getAccountDetails(this.currentUser.user_id).subscribe(
//     (res: any) => {
//       if (res && res.status === true) {
//         this.accountDetails = res.account;
//         this.loadTransactionHistory(this.accountDetails.user_id);
//       }
//     }
//   );
// }

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
