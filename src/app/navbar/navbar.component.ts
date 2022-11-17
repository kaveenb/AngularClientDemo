import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserModel } from '../_models/UserModel';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() IsLoggedInEmit = new EventEmitter();
  @Input() IsFireBaseUsed=false;
  display = "none";
  info = "none";
  IsSignUpClicked=false;
  IsForgotPwdClicked=false;
  IsLoggedIn=false;
  InfoLable!:string;
  ModalbuttonLable!:string;
  ModalLable!:string;
  AccountName!:string;
  SelectedQn!:string;
  CheckAnswer!:string;
  SlideLable!:string;
  user:UserModel={
    user_name:'',
    password:'',
    favorite_qn:'',
    answer:''
  };
  
  FavoriteQn:string[] = ['Favorite Teacher?','Favorite Actor?','Favorite Actress?','Place of Birth?','Name of your pet?'];


  constructor(private http:HttpClient,private fire:AngularFirestore) { }

  ngOnInit(): void {
  }
  SaveChages(){
    if(!this.IsForgotPwdClicked && this.IsSignUpClicked){
      if(this.user.user_name==''  || this.user.password=='' || this.user.favorite_qn =='' || this.user.answer=='')
      alert('Enter all fields');
      else
      this.Forgot();
    }
    else if(this.IsSignUpClicked){
      if(this.user.user_name==''  || this.user.password=='' || this.user.favorite_qn =='' || this.user.answer=='')
      alert('Enter all fields');
      else
      this.SignUp();
    }
    else{
      if(this.user.user_name==''  || this.user.password=='')
      alert('Enter all fields');
      else
      this.Login();  
    }
    
    
  }
  
  CurrentLogger(){
    const currentUser = JSON.parse(localStorage.getItem('user')!);
    if(currentUser.user_name!=='' || currentUser.password!==''){
      this.IsLoggedIn=true;
                this.IsLoggedInEmit.emit(true);
                this.AccountName=currentUser.user_name;
    }
  }

  Login(){
    this.onCloseHandled();
    if(!this.IsFireBaseUsed){
      this.onCloseHandled();
      this.http.post<UserModel>('https://localhost:5001/User/login',this.user).subscribe({
        next: (Response:UserModel) => {
          if(Response){
                  this.IsLoggedIn=true;
                  this.IsLoggedInEmit.emit(true);
                  this.AccountName=Response.user_name;
                  localStorage.setItem('user', JSON.stringify(Response))
                }
                else{
                  this.openInfoModal();
                }
        },
        error: (Response)=>console.log(Response)
      })
    }
    else{
      this.fire.collection<UserModel>('user').valueChanges().subscribe({
        next:(user:UserModel[])=> {
          if(this.user.user_name===user[0].user_name && this.user.password===user[0].password){
                  this.IsLoggedIn=true;
                  this.IsLoggedInEmit.emit(true);
                  this.AccountName=user[0].user_name;
                  localStorage.setItem('user', JSON.stringify(user[0]))
          }else
          this.openInfoModal();
        }
      });
    }
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

  Forgot(){
    this.onCloseHandled();
    this.http.put<UserModel>('https://localhost:5001/User/',this.user).subscribe({
      next: (Response:UserModel) => {
        if(Response){
                this.IsSignUpClicked=true;
                this.IsLoggedIn=true;
                this.AccountName=Response.user_name;
                this.InfoLable='Hurray! Password changed successfully';
                this.IsLoggedInEmit.emit(true);
                this.openInfoModal();
              } else{
                this.InfoLable='Login failed! Incorrect Username or Password';
                this.openInfoModal();
              }
              
      },
      error: (Response)=>console.log(Response)
    })
  }
   LoginClicked(){
    console.log(this.IsFireBaseUsed);
    this.IsForgotPwdClicked=false;
    this.ModalLable='Login to your account!';
    this.InfoLable='Login failed! Incorrect Username or Password';
    this.ModalbuttonLable='Login';
    this.openModal();
  }
  LogoutClicked(){
    this.IsLoggedInEmit.emit(false);
    this.IsSignUpClicked=false;
    this.IsLoggedIn=false;
    localStorage.removeItem('user');
  }
  SignUpClicked(){
    this.IsForgotPwdClicked=false;
    this.ModalLable='Sign-Up for free!';
    this.ModalbuttonLable='Sign-Up';
    this.IsSignUpClicked=true;
    this.openModal();
  }

  CheckAnswerClick(){
    if(this.CheckAnswer==this.user.answer){
      this.IsForgotPwdClicked=false;
      this.IsSignUpClicked=true;
    }else{
      this.onCloseHandled();
      this.InfoLable='Oops! Wrong answer!';
      this.openInfoModal();
    }
   
  }

  ForgorPwdClicked(){
    if(this.user.user_name=='')
    alert('Please enter Username');
    else{
      this.IsForgotPwdClicked=true;
      this.ModalbuttonLable='Confirm';
      
      this.user.answer='';
      this.http.get<UserModel>('https://localhost:5001/User/'+this.user.user_name).subscribe({
        next: (Response:UserModel)=>{
          this.user.favorite_qn = Response.favorite_qn;
          this.CheckAnswer = Response.answer;
        } ,
        error:(Response)=>console.log(Response)
      })
    }
    
  }

  Reset(){
    this.IsSignUpClicked=false;
    this.IsForgotPwdClicked=false;
    this.IsLoggedIn=false;
    this.InfoLable='';
    this.ModalbuttonLable='';
    this.ModalLable='';
    this.AccountName='';
  }

  openModal() {
    this.display = "block";
  }
  onCloseHandled() {
    this.Reset();
    this.display = "none";
  }

  
  openInfoModal() {
    this.info = "block";
  }
  
  onCloseInfoHandled() {
    this.info = "none";
  }
}
