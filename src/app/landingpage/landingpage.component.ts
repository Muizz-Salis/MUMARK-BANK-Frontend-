import { Component, OnInit } from '@angular/core';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [MaterialmoduleModule, FormsModule, RouterModule, CommonModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent implements OnInit{
  isLoading: boolean = true;
  isPageReady: boolean = false;
  
  constructor(public rout:Router){}
  
  signup(){
    this.rout.navigate([`/signup`]);
  }
  
  login(){
    this.rout.navigate(['/login'])
  }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      setTimeout(() => {
        this.isPageReady = true;
      }, 100);
    }, 4000); 
  }
}
