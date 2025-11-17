import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyApiCallsService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private profilePictureSubject: BehaviorSubject<string>;
  public profilePicture: Observable<string>;

  constructor(private http: HttpClient) {
    const storedUser = this.isBrowser() ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null;
    
    this.currentUserSubject = new BehaviorSubject<any>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();

    this.profilePictureSubject = new BehaviorSubject<string>('');
    this.profilePicture = this.profilePictureSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  registerUser(data: any): Observable<any> {
    // Post to FrontendConnection.php (note: capital F and C to match PHP file casing)
    // Use responseType 'text' so we can handle HTML error pages (404) without JSON parse errors
    return this.http.post('/api/FrontendConnection.php', data, { observe: 'response', responseType: 'text' }).pipe(
      map(resp => {
        const contentType = resp.headers.get('content-type') || '';
        const bodyText = resp.body || '';
        // Prefer header-based detection, but be resilient if server forgets the header
        const isJson = contentType.includes('application/json');
        const looksHtml = contentType.includes('text/html') || bodyText.startsWith('<!DOCTYPE') || bodyText.startsWith('<html');

        if (isJson) {
          try {
            return JSON.parse(bodyText);
          } catch (e) {
            throw new Error('Server returned invalid JSON for registration response.');
          }
        }
        // Try to parse JSON even without the header
        try {
          return JSON.parse(bodyText);
        } catch {
          // If server returned HTML or non-JSON, surface a clear message
          const status = resp.status;
          if (looksHtml || status === 404) {
            throw new Error(`Registration endpoint not found or returned HTML (status ${status}). Confirm /api/frontendconnection.php exists and returns JSON.`);
          }
          throw new Error('Unexpected non-JSON response from registration endpoint.');
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        // Re-throw so component can display backend message
        return throwError(() => error);
      })
    );
  }
    
  login(data: any): Observable<any> {
    return this.http.post('/api/login.php', data)
      .pipe(
        tap((response: any) => {
          if (response && response.status === true) {
            // Store the complete user object instead of just userId
            if (this.isBrowser()) {
              localStorage.setItem('currentUser', JSON.stringify(response.user));
            }
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  updateUser(user: any) {
    this.currentUserSubject.next(user);
  }
  
  uploadProfilePicture(data: FormData): Observable<any> {
    return this.http.post('/api/UploadHandler.php', data)
      .pipe(
        tap((res: any) => {
          if (res && res.success) {
            // Update the current user with the new profile picture filename
            const updatedUser = { ...this.currentUserSubject.value, profile_picture: res.profile_picture };
            if (this.isBrowser()) {
              localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
            this.currentUserSubject.next(updatedUser);
            this.profilePictureSubject.next(res.profile_picture);
          }
        }),
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while uploading profile picture.'));
        })
      );
  }
  

  createOrGetAccount(userId: any): Observable<any> {
    // Use Angular dev-server proxy to avoid CORS in dev
    return this.http.post('/api/createaccount.php', { user_id: userId })
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while creating or getting account.'));
        })
      );
  }

  sendMoney(transaction: any): Observable<any> {
    return this.http.post('/api/send_receive.php', transaction)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while sending money.'));
        })
      );
  }
  getAccountName(accountNumber: string): Observable<any> {
    return this.http.get(`/api/getAccountName.php?accountNumber=${accountNumber}`);
  }
  
  getTransactionHistory(accountId: string): Observable<any> {
    return this.http.get(`/api/get_transaction_history.php?account_id=${accountId}`)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while fetching transaction history.'));
        })
      );
  }

  buyAirtime(accountId: number, phoneNumber: string, amount: number): Observable<any> {
    return this.http.post('/api/buyairtime.php', { accountId, phoneNumber, amount })
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while buying airtime.'));
        })
      );
  }

  buyData(accountId: number, phoneNumber: string, dataPlan: string, amount: number): Observable<any> {
    return this.http.post('/api/buydata.php', { accountId, phoneNumber, dataPlan, amount })
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while buying data.'));
        })
      );
  }

  getAccountBalance(accountId: number): Observable<number> {
    return this.http.get<number>(`/api/get_account_details.php?account_id=${accountId}`)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while fetching account balance.'));
        })
      );
  }
  deposit(data: any): Observable<any> {
    return this.http.post('/api/deposit.php', data)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while depositing money.'));
        })
      );
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.post('/api/deleteuser.php', { user_id: userId }).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Error deleting user.'));
      })
    );
  }

  editUser(userId: number, data: any): Observable<any> {
    return this.http.post('/api/edituser.php', { user_id: userId, ...data }).pipe(
      catchError(error => {
        console.error('Error editing user:', error);
        return throwError(() => new Error('Error editing user.'));
      })
    );
  }


  postNotification(data: any): Observable<any> {
    return this.http.post('/api/post_notification.php', data);
  }

  getUsers(): Observable<any> {
    return this.http.get('/api/get_users.php').pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => new Error('Error fetching users.'));
      })
    );
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post('/api/forgot_password.php', data)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while processing forgot password request.'));
        })
      );
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post('/api/reset_password.php', data)
      .pipe(
        catchError(error => {
          console.error('Error:', error);
          return throwError(() => new Error('An error occurred while resetting password.'));
        })
      );
  }
  
  getDataHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/get_data_history.php?user_id=${userId}`);
  }

  getAirtimeHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/get_airtime_history.php?user_id=${userId}`);
  }

  generateAccountNumber(userId: number): Observable<any> {
    return this.http.post('/api/generate_account.php', { userId }).pipe(
      tap((res: any) => {
        if (res.status && res.account_number) {
          // Update current user with account number and balance
          const currentUser = this.currentUserValue;
          if (currentUser) {
            currentUser.account_number = res.account_number;
            currentUser.balance = res.balance;
            if (this.isBrowser()) {
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            this.currentUserSubject.next(currentUser);
          }
        }
      }),
      catchError(error => {
        console.error('Error generating account number:', error);
        return throwError(() => new Error('Error generating account number.'));
      })
    );
  }

  getBalance(accountNumber: string): Observable<any> {
    return this.http.get(`/api/get_balance.php?account_number=${accountNumber}`).pipe(
      tap((res: any) => {
        if (res.status && res.balance !== undefined) {
          // Update current user balance
          const currentUser = this.currentUserValue;
          if (currentUser) {
            currentUser.balance = res.balance;
            if (this.isBrowser()) {
              localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            this.currentUserSubject.next(currentUser);
          }
        }
      }),
      catchError(error => {
        console.error('Error fetching balance:', error);
        return throwError(() => new Error('Error fetching balance.'));
      })
    );
  }


}
