import { Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FooterpageComponent } from './footerpage/footerpage.component';
import { SendmoneyComponent } from './sendmoney/sendmoney.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { AirtimedataComponent } from './airtimedata/airtimedata.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import { DepositComponent } from './deposit/deposit.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { adminGuard } from './guards/admin.guard';
import { AirtimeHistoryComponent } from './airtime-history/airtime-history.component';
import { DataHistoryComponent } from './data-history/data-history.component';



export const routes: Routes = [
    {path:'', component: LandingpageComponent},
    {path:'navbar', component: NavbarComponent},
    {path:'signup', component: SignupComponent},
    {path:'login', component: LoginComponent},
    {path:'forgot-password', component: ForgotPasswordComponent},
    {path:'reset-password', component: ResetPasswordComponent},
    {path:'profile', component: ProfileComponent},
    {path:'admin-dashboard', component: AdminDashboardComponent, canActivate: [adminGuard]},
    {path:'about', component: AboutComponent},
    {path:'contact', component: ContactComponent},
    {path:'sendmoney', component: SendmoneyComponent},
    {path:'mainpage', component: MainpageComponent},
    {path:'transactionhistory', component: TransactionHistoryComponent},
    {path:'airtimedata', component: AirtimedataComponent},
    {path: 'deposit', component: DepositComponent },
    {path:'airtime-history', component: AirtimeHistoryComponent },
    {path:'data-history', component: DataHistoryComponent },


];
