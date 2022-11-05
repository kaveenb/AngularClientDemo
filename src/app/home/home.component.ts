import { Component, Input, OnInit, Output } from '@angular/core';
import { ProductModel } from '../_models/ProductModel';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  display = "none";
  info = "none";
  product: any;
  Addproduct: ProductModel = {
    name: '',
    description: '',
    sku: '',
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
  IsServiceUp:boolean=true;
  IsLoggedIn=false;
  ModalLable:string='Add Product';
  InfoLable:string='Product Added successfully!';



  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.IsServiceUp=true;
    this.LoadProducts();
  }

  LoadProducts(){
    this.http.get('https://localhost:5001/api/product').subscribe({
      next: (Response) => (this.product = Response),
      error: (error) => {console.log(error);
       this.IsServiceUp=false;
      }
    });
  }
  SaveChages(){
    if(this.IsDeleteClicked)
    this.delete();
    else if(this.IsUpdateClicked)
    this.update();
    else
    this.Addingproduct();
  }

  Addingproduct() {
    this.onCloseHandled();
    this.openInfoModal();
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
     this.http
      .delete('https://localhost:5001/api/product/' + this.Addproduct.id)
      .subscribe({
        next: (Response) => {
          this.DeleteSuccess = true;
          this.onCloseHandled();
          this.openInfoModal();
          return console.log(Response);
        },
        error: (error) => console.log(error),
      });
      this.onCloseHandled();
      this.openInfoModal();
  }

  update() {
    this.onCloseHandled();
          this.openInfoModal();
    return this.http
      .put('https://localhost:5001/api/product/' + this.Addproduct.id, this.Addproduct)
      .subscribe({
        next: (Response) => {
          this.onCloseHandled();
          this.openInfoModal();
          return console.log(Response);
        },
        error: (error) => console.log(error),
      });
  }

  AddClick(){
    this.ModalLable='Add Product';
    this.InfoLable='Product Added successfully!';
    this.openModal();
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

  SetLogin(event:boolean){
    this.IsLoggedIn=event;
  }

  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.IsDeleteClicked=false;
    this.IsUpdateClicked=false;
    this.display = "none";
  }

  openInfoModal() {
    this.info = "block";
  }
  
  onCloseInfoHandled() {
    this.LoadProducts();
    this.IsDeleteClicked=false;
    this.IsUpdateClicked=false;
    this.info = "none";
  }

}
