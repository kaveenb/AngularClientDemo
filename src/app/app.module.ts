import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { FeatureComponent } from './feature/feature.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [AppComponent, AboutComponent, HomeComponent, FeatureComponent, NavbarComponent, FooterComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule,
     AppRoutingModule,MatSelectModule,MatFormFieldModule,
     BrowserAnimationsModule,MatTableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
