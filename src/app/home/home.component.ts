import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../_models/ProductModel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  display = "none";
  product: any;
  Addproduct: ProductModel = {
    name: 'Name..',
    description: 'Description..',
    sku: ' ',
    date_created: new Date(),
    units_in_stock: 0,
    unit_price: 0,
    last_updated: new Date(),
    active: true,
    image_url: ' ',
    id: 0,
    category_id: 1,
  };
  AddSuccess: boolean = false;
  DeleteSuccess: boolean = false;
  IsDeleteClicked: boolean = false;
  IsUpdateClicked: boolean = false;
  ModalLable:string='Add Product';
  InfoLable:string='Product Added successfully!';
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.LoadProducts();
  }

  LoadProducts(){
    this.http.get('https://localhost:5001/api/product').subscribe({
      next: (Response) => (this.product = Response),
      error: (error) => console.log(error),
    });
  }

  DeleteClick(){
    this.ModalLable='Delete Product by Id';
    this.InfoLable='Product deleted successfully!';
    this.IsDeleteClicked=true;
    this.openModal();
  }

  UpdateClick(){
    this.ModalLable='Update Product by Id';
    this.InfoLable='Product updated successfully!';
    this.IsUpdateClicked=true;
    this.openModal();
  }

  openModal() {
    this.display = "block";
  }

}
