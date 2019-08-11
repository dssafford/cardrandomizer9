import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoadImgComponent } from './load-img/load-img.component';
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from './app-material.module.ts/app-material.module.ts.module';

@NgModule({
  declarations: [
    AppComponent,
    LoadImgComponent
  ],
  imports: [HttpClientModule, BrowserModule, BrowserAnimationsModule,
      ReactiveFormsModule, FormsModule, MaterialModule, MatInputModule,
      MatRadioModule, MatDialogModule, MatCheckboxModule, MatIconModule,
      MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
