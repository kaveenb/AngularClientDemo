import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserModel } from '../_models/UserModel';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() IsLoggedInEmit = new EventEmitter();
  display = "none";
  info = "none";
  IsSignUpClicked=false;
  IsLoggedIn=false;
  InfoLable!:string;
  ModalbuttonLable!:string;
  ModalLable!:string;
  AccountName!:string;
  user:UserModel={
    user_name:'',
    password:'',
    favorite_qn:'',
    answer:''

  };
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }
  SaveChages(){
    if(this.IsSignUpClicked)
    this.SignUp();
    else{
      this.Login();
      console.log('loggin pressed')
    }
    
  }

  Login(){
    this.onCloseHandled();
    this.http.post<UserModel>('https://localhost:5001/User/login',this.user).subscribe({
      next: (Response:UserModel) => {
        if(Response){
                this.IsLoggedIn=true;
                this.IsLoggedInEmit.emit(true);
                this.AccountName=Response.user_name;
              }
              else{
                this.openInfoModal();
              }
      },
      error: (Response)=>console.log(Response)
    })
  }
  SignUp(){
    this.onCloseHandled();
    this.http.post<UserModel>('https://localhost:5001/User/register',this.user).subscribe({
      next: (Response:UserModel) => {
        if(Response){
                this.IsLoggedIn=true;
                this.AccountName=Response.user_name;
                this.IsLoggedInEmit.emit(true);
              }
              else{
                this.openInfoModal();
              }
      },
      error: (Response)=>console.log(Response)
    })
  }
   LoginClicked():Boolean{
    this.ModalLable='Login to your account!';
    this.InfoLable='Login failed! Incorrect Username or Password';
    this.ModalbuttonLable='Login';
    this.openModal();
    return true;
  }
  LogoutClicked():boolean{
    this.IsLoggedInEmit.emit(false);
    this.IsSignUpClicked=false;
    this.IsLoggedIn=false;
    return true;
  }
  SignUpClicked():Boolean{
    this.ModalLable='Sign-Up for free!';
    this.ModalbuttonLable='Sign-Up';
    this.IsSignUpClicked=true;
    this.openModal();
    return true;
  }
  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.display = "none";
  }

  
  openInfoModal() {
    this.info = "block";
  }
  
  onCloseInfoHandled() {
    this.info = "none";
  }
}
