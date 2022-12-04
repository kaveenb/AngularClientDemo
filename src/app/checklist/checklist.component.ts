import { Component, Input, OnInit, Output,ViewChild } from '@angular/core';
import { ChecklistModel } from '../_models/ChecklistModel';
import { HttpClient } from '@angular/common/http';
import { MatSort} from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import {AngularFirestore} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.css']
})
export class ChecklistComponent implements OnInit {

  //Fields
  checklist!:any;
  Addchecklist:ChecklistModel = {
    item: '',
    description: '',
    action: '',
    id: 0
  };
  IsLoggedIn=false;
  IsRowClicked = false;
  ClickedRow = new Set<ChecklistModel>();
  datasource = new MatTableDataSource<ChecklistModel>();
  displayedColumns = ['id','item','description','action'];
  Actionitems:string[] = ['Buy','Available'];
  Category:string[] = ['Electronics','Utensils','Food','Other','Essentials'];

  @ViewChild(MatSort) sort!:MatSort;
  @ViewChild(MatPaginator) paginator!:MatPaginator;

  constructor(private fire:AngularFirestore) { }

  ngOnInit(): void {
    this.LoadProducts();
  }
  LoadProducts(){
    this.fire.collection<ChecklistModel>('checklist').valueChanges().subscribe({
      next:(user:ChecklistModel[])=> {
        this.checklist = user;
        this.datasource.data = this.checklist;
        this.datasource.sort = this.sort; this.datasource.paginator = this.paginator;
      }
    });
  }

  save(){
    this.fire.collection('checklist').doc(this.Addchecklist.id.toString()).set({
        id: this.Addchecklist.id,
        item: this.Addchecklist.item,
        description: this.Addchecklist.description,
        action: this.Addchecklist.action
    })
  }

  Update(){
    this.fire.doc('checklist/'+this.Addchecklist.id).delete();
    this.save();
  }

  Delete(){
    this.fire.doc('checklist/'+this.Addchecklist.id).delete();
  }

  SetLogin(event:boolean){
    this.IsLoggedIn=event;
  }

  RowClick(row:ChecklistModel){
    this.ClickedRow.clear();
    this.ClickedRow.add(row);
    this.Addchecklist = row;
    if(this.ClickedRow.has(row))
    this.IsRowClicked = true;
    else
    this.IsRowClicked = false;
  }
}
