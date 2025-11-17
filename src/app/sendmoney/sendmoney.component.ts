import { Component, OnInit } from '@angular/core';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sendmoney',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './sendmoney.component.html',
  styleUrls: ['./sendmoney.component.css']
})
export class SendmoneyComponent implements OnInit {
  sendMoneyForm: FormGroup;
  message: string = '';
  buttonState: 'Send Money' | 'Sending' | 'Sent' = 'Send Money';
  showModal: boolean = false;
  password: string = '';
  senderAccountName: string = '';
  receiverAccountName: string = '';

  constructor(private fb: FormBuilder, private authService: MyApiCallsService, private router: Router) {
    this.sendMoneyForm = this.fb.group({
      senderAccountNumber: ['', Validators.required],
      receiverAccountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.sendMoneyForm.get('senderAccountNumber')?.valueChanges.subscribe(value => {
      this.getAccountName(value, 'sender');
    });

    this.sendMoneyForm.get('receiverAccountNumber')?.valueChanges.subscribe(value => {
      this.getAccountName(value, 'receiver');
    });
  }

  getAccountName(accountNumber: string, type: 'sender' | 'receiver'): void {
    if (accountNumber.trim()) {
      this.authService.getAccountName(accountNumber).subscribe(
        (response) => {
          if (response && response.status === true) {
            if (type === 'sender') {
              this.senderAccountName = response.accountName || '';
            } else {
              this.receiverAccountName = response.accountName || '';
            }
          } else {
            this.clearAccountNames(type);
            this.message = response.message || 'Account not found';
          }
        },
        (error) => {
          this.clearAccountNames(type);
          this.message = 'Error fetching account name';
        }
      );
    }
  }

  clearAccountNames(type: 'sender' | 'receiver'): void {
    if (type === 'sender') {
      this.senderAccountName = '';
    } else {
      this.receiverAccountName = '';
    }
  }

  openConfirmModal(): void {
    if (this.sendMoneyForm.valid) {
      this.buttonState = 'Sending';
      setTimeout(() => {
        this.showModal = true;
        this.buttonState = 'Send Money'; 
      }, 2000);
    }
  }

  confirmTransaction(): void {
    const data = {
      ...this.sendMoneyForm.value,
      password: this.password
    };

    this.buttonState = 'Sending';
    this.authService.sendMoney(data).subscribe(
      (res: any) => {
        this.message = res.message;
        this.buttonState = 'Sent';

        setTimeout(() => {
          this.message = '';
          this.resetButtonState();
          this.router.navigate(['/mainpage']);
        }, 3000);
      },
      (error) => {
        console.error('Error sending money:', error);
        this.message = 'Error sending money';
        setTimeout(() => {
          this.message = '';
        }, 3000);
        this.resetButtonState();
      }
    );

    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
  }

  private resetButtonState(): void {
    setTimeout(() => {
      this.buttonState = 'Send Money';
    }, 2000);
  }
}
