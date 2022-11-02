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
  info="none";
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
  ModalLable:string='Add Product';
  InfoLable:string='Product Added successfully!';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/product').subscribe({
      next: (Response) => (this.product = Response),
      error: (error) => console.log(error),
    });
  }

  SaveChages(){
    if(this.IsDeleteClicked)
    this.delete();
    else
    this.Addingproduct();
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
    this.onCloseHandled();
          this.openInfoModal();
    return this.http
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
  }

  DeleteClick(){
    this.ModalLable='Delete Product by Id';
    this.InfoLable='Product deleted successfully!';
    this.IsDeleteClicked=true;
    this.openModal();
  }

  openModal() {
    this.display = "block";
  }
  
  onCloseHandled() {
    this.display = "none";
  }

  openInfoModal() {
    this.display = "block";
  }
  
  onCloseInfoHandled() {
    this.display = "none";
  }


}
