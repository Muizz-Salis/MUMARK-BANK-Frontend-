import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyApiCallsService } from '../service/my-api-calls.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [
    CommonModule,
  
  ]
})
export class NavbarComponent {
  currentUser: any;
  currentUserSubscription: Subscription | undefined;

    isProfileMenuOpen: boolean = false;
    isMobileMenuOpen: boolean = false;
  
    constructor(public authService: MyApiCallsService, private router: Router) {}
    ngOnInit(): void {
      this.currentUserSubscription = this.authService.currentUser.subscribe(
        (user) => {
          this.currentUser = user;
        }
      );
    }
  
    ngOnDestroy(): void {
      if (this.currentUserSubscription) {
        this.currentUserSubscription.unsubscribe();
      }
    }
  
    toggleProfileMenu(): void {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    }
  
    toggleMobileMenu(): void {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  
    closeDropdowns(): void {
      this.isProfileMenuOpen = false;
      this.isMobileMenuOpen = false;
    }

    logout(): void {
      this.authService.logout();
      this.router.navigate(['/login']); 
    }
  

}
