import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from './_models/ProductModel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AngularClientDemo';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
  }
}
