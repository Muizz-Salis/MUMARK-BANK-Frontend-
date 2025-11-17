import { Component, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { MyApiCallsService } from '../service/my-api-calls.service';

interface ContactInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address: string;
  phone_number: any;
  gender: string;
  role: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, MaterialmoduleModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  constructor(
    public Router: Router,
    public MyApi: MyApiCallsService,
    public formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  message: any = '';
  isAdminLoggedIn = false;

  public contact: ContactInterface = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    address: '',
    phone_number: '',
    gender: '',
    role: 'user' 
  };

  ngOnInit() {
    // Avoid SSR ReferenceError: localStorage is not defined
    if (isPlatformBrowser(this.platformId)) {
      try {
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
          let role: string | null = null;
          try {
            const parsed = JSON.parse(loggedInUser);
            role = typeof parsed === 'object' && parsed ? (parsed as any).role ?? null : null;
          } catch {
            // If value wasn't JSON (e.g., just an ID), ignore
          }
          if (role && role.toLowerCase() === 'admin') {
            this.isAdminLoggedIn = true;
          }
        }
      } catch {
        // No-op if storage is unavailable
      }
    }
  }

  submit() {
    const phone = (this.contact.phone_number || '').toString().trim();
    const phoneNormalized = this.normalizePhone(phone);

    const UserDetails = {
      first_name: this.contact.first_name,
      last_name: this.contact.last_name,
      email: this.contact.email,
      password: this.contact.password,
      address: this.contact.address,
      phone_number: phoneNormalized,
      gender: this.contact.gender,
      role: this.contact.role
    };

    console.log(UserDetails);

    this.MyApi.registerUser(UserDetails).subscribe(
      (res: any) => {
        console.log('Register response:', res);
        if (res?.status) {
          this.message = res.message || 'Registration successful.';

          // Try to get userId from register response; if not present, login to retrieve it
          const directUserId = (res?.user && (res.user.userId || res.user.id)) || res?.user_id || res?.userId || res?.id || null;

          const proceedWithAccount = (userId: any) => {
            if (!userId) {
              // If still no userId, navigate to login
              this.Router.navigate(['/login']);
              return;
            }
            this.MyApi.createOrGetAccount(userId).subscribe(
              (acctRes: any) => {
                console.log('Account response:', acctRes);
                // After ensuring account exists, go to login
                this.Router.navigate(['/login']);
              },
              (acctErr) => {
                console.error('Create/Get account error:', acctErr);
                // Still proceed to login; show message if backend provided one
                const msg = typeof acctErr?.error === 'string' ? acctErr.error : (acctErr?.error?.message || '');
                this.message = msg || 'Registration succeeded, but creating your account encountered an issue. Please log in and try again.';
                this.Router.navigate(['/login']);
              }
            );
          };

          if (directUserId) {
            proceedWithAccount(directUserId);
          } else {
            // Fallback: login with provided credentials to obtain userId
            this.MyApi.login({ email: this.contact.email, password: this.contact.password }).subscribe(
              (loginRes: any) => {
                const userId = (loginRes?.user && (loginRes.user.userId || loginRes.user.id)) || loginRes?.user_id || loginRes?.userId || loginRes?.id || this.MyApi.currentUserValue || null;
                proceedWithAccount(userId);
              },
              (loginErr) => {
                console.error('Auto-login after register failed:', loginErr);
                // If auto-login fails, just send user to login
                this.Router.navigate(['/login']);
              }
            );
          }
        } else {
          this.message = res?.message || 'Registration failed.';
        }
      },
      (error) => {
        console.error('API Error:', error);
        // Surface backend error message if available
        const backendMsg = typeof error?.error === 'string' ? error.error : (error?.error?.message || '');
        this.message = backendMsg || 'An error occurred during registration.';
      }
    );
  }

  private normalizePhone(input: string): string {
    // Remove spaces and dashes
    const raw = input.replace(/\s|-/g, '');
    if (raw.startsWith('+')) {
      // Already E.164-style
      return raw;
    }
    // Nigeria-specific convenience: 0XXXXXXXXXX -> +234XXXXXXXXXX
    if (/^0\d{10}$/.test(raw)) {
      return '+234' + raw.substring(1);
    }
    // If already starts with 234, add plus
    if (/^234\d{7,12}$/.test(raw)) {
      return '+' + raw;
    }
    // Fallback: if only digits and between 10 and 15, prefix plus
    if (/^\d{10,15}$/.test(raw)) {
      return '+' + raw;
    }
    return input; // leave as given if none matched
  }
}
