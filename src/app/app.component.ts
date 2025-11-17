import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Bank_App_Angular';
  showNavbar = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial state based on current route
    const currentUrl = this.router.url;
    const hiddenRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
    this.showNavbar = !hiddenRoutes.includes(currentUrl);

    // Listen for route changes
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Hide navbar on landing page, login page, signup page, forgot password, and reset password
        const hiddenRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password'];
        this.showNavbar = !hiddenRoutes.includes(event.url);
      });
  }
}
