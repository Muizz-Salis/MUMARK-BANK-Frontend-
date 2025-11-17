import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  declarations: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,
  ],
  exports:[
    HttpClientModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    CommonModule,

  ],
})
export class MaterialmoduleModule { }
