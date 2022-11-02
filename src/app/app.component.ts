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
  product: any;
  display = "none";
  Addproduct: ProductModel = {
    name: 'Angular Demo',
    description: 'Angular demo by Kaveen',
    sku: 'abc',
    date_created: new Date(),
    units_in_stock: 1,
    unit_price: 99.99,
    last_updated: new Date(),
    active: true,
    image_url: 'abc',
    id: 11,
    category_id: 1,
  };
  AddSuccess: boolean = false;
  DeleteSuccess: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/product').subscribe({
      next: (Response) => (this.product = Response),
      error: (error) => console.log(error),
    });
  }

  Addingproduct() {
    console.log(this.Addproduct);
    return this.http
      .post('https://localhost:5001/api/product', this.Addproduct)
      .subscribe({
        next: (Response) => {
          this.AddSuccess = true;
          return console.log(Response);
        },
        error: (error) => console.log(error),
      });
  }

  delete() {
    return this.http
      .delete('https://localhost:5001/api/product/' + this.Addproduct.id)
      .subscribe({
        next: (Response) => {
          this.DeleteSuccess = true;
          return console.log(Response);
        },
        error: (error) => console.log(error),
      });
  }
  openModal() {
    this.display = "block";
  }
  
  onCloseHandled() {
    this.display = "none";
  }
}
