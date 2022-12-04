import { Component, Input, OnInit, Output,ViewChild } from '@angular/core';
import { ProductModel } from '../_models/ProductModel';
import { HttpClient } from '@angular/common/http';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import {AngularFirestore} from '@angular/fire/compat/firestore';
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
  Id!:number;
  AddSuccess = false;
  DeleteSuccess = false;
  IsDeleteClicked = false;
  IsUpdateClicked = false;
  IsRowClicked = false;
  IsServiceUp=true;
  IsLoggedIn=false;
  IsDataLoaded=false;
  IsFireBaseUsed = true;
  ModalLable='Add Product';
  InfoLable='Product Added successfully!';
  ClickedRow = new Set<ProductModel>();
  displayedColumns = ['id', 'name','description','unit_price'];
  datasource = new MatTableDataSource<ProductModel>();
  selection = new SelectionModel<ProductModel>(false, []);
  

  @ViewChild(MatSort) sort!:MatSort;
  @ViewChild(MatPaginator) paginator!:MatPaginator;

  constructor(private http: HttpClient,private fire:AngularFirestore,private nav:NavbarComponent) { }
  ngOnInit(): void {
    this.IsServiceUp=true;
    this.LoadProducts();
  }
  
  LoadProducts(){
    if(!this.IsFireBaseUsed){
      this.IsDataLoaded=false;
      this.http.get<ProductModel>('https://localhost:5001/api/product').subscribe({
        next: (Response:ProductModel) =>{ (this.product = Response);this.IsDataLoaded=false; 
           this.datasource.data = this.product;this.datasource.sort = this.sort; this.datasource.paginator = this.paginator;
        },
        error: (error) => {console.log(error);
         this.IsServiceUp=false;
        }
      });
    }else{
      this.fire.collection<ProductModel>('products').valueChanges().subscribe({
        next:(user:ProductModel[])=> {
          this.product = user;
          this.datasource.data = this.product;this.datasource.sort = this.sort; this.datasource.paginator = this.paginator;
        }
      });
    }
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
    if(!this.IsFireBaseUsed){
      this.onCloseHandled();
      this.openInfoModal();
      this.http
        .post('https://localhost:5001/api/product', this.Addproduct)
        .subscribe({
          next: (Response) => {
            this.AddSuccess = true;
          },
          error: (error) => console.log(error),
        });
    }else{
      this.onCloseHandled();
      this.openInfoModal();
      this.fire.collection('products').doc(this.Addproduct.id.toString()).set({
        name: this.Addproduct.name,
        description: this.Addproduct.description,
        sku: this.Addproduct.sku,
        date_created: new Date(),
        units_in_stock: this.Addproduct.units_in_stock,
        unit_price: this.Addproduct.unit_price,
        last_updated: new Date(),
        active: this.Addproduct.active,
        image_url: this.Addproduct.image_url,
        id: this.Addproduct.id,
        category_id: this.Addproduct.category_id
      })
    }
    
  }

  delete() {
    this.onCloseHandled();
    this.openInfoModal();
    if(!this.IsFireBaseUsed){
      this.http
      .delete('https://localhost:5001/api/product/' + this.Addproduct.id)
      .subscribe({
        next: (Response) => {
          this.DeleteSuccess = true;
          this.onCloseHandled();
          this.openInfoModal();
        },
        error: (error) => console.log(error),
      });
    }else{
      this.fire.doc('products/'+this.Addproduct.id).delete();
    }
  }

  DeleteSelected(){
    if(!this.IsFireBaseUsed){
      this.http
      .delete('https://localhost:5001/api/product/' + this.Id)
      .subscribe({
        next: (Response) => {
          return console.log(Response);
        },
        error: (error) => console.log(error),
      });
    }else{
      this.fire.doc('products/'+this.Addproduct.id).delete();
    }
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
  FirebaseSwitch(){
    this.nav.IsFireBaseUsed = true;
    this.ngOnInit();
  }
  UpdateClick(){
    this.ModalLable='Update Product by Id';
    this.InfoLable='Product updated successfully!';
    this.IsUpdateClicked=true;
    this.openModal();
  }

  RowClick(row:ProductModel){
    this.Id = row.id;
    this.ClickedRow.clear();
    this.ClickedRow.add(row);
    if(this.ClickedRow.has(row))
    this.IsRowClicked = true;
    else
    this.IsRowClicked = false;
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
