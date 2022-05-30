import { Component, OnInit } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ApiService } from '../../services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { CreateObjectComponent } from '../create-object/create-object.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-create-revision',
  templateUrl: './create-revision.component.html',
  styleUrls: ['./create-revision.component.scss']
})
export class CreateRevisionComponent implements OnInit {

  new_revision = {
    name: "",
    description:"",
    id: "",
    parentRevisionId: "",
    objects: {add:[], update:[], delete:[]},
    metadata: {add:[], update:[], delete:[]}
  }

  objects_table_overview: any
  objects_table_add: any
  objects_table_update: any
  objects_table_delete: any

  displayedColumns_overview: string[]
  displayedColumns_add: string[]
  displayedColumns_update: string[]
  displayedColumns_delete: string[]

  valid = false;

  constructor(
    
    public apiService: ApiService,
    private dialog: MatDialog

  ) { 
    this.objects_table_overview = new MatTableDataSource(this.apiService.objectGroup.currentRevision.objects)
    //current revision aktuell provisorisch, da keine anderen verfügbar
    this.objects_table_add = new MatTableDataSource(this.new_revision.objects.add)
    this.objects_table_update = new MatTableDataSource(this.new_revision.objects.update)
    this.objects_table_delete = new MatTableDataSource(this.new_revision.objects.delete)

    this.displayedColumns_overview=["name", "description", "created", "actions"]
    this.displayedColumns_add = ["name", "description", "created", "actions"]
    this.displayedColumns_update = ["name", "description", "created", "actions"]
    this.displayedColumns_delete = ["name", "description", "created", "actions"]

  }

  ngOnInit(): void {
  }

  isValid(){
    if(this.new_revision != null){
      this.valid = true;
    }
    console.log(this.new_revision)
  }

  createObject() {
    const dialogRef = this.dialog.open(CreateObjectComponent,
      {
        hasBackdrop: true,
        disableClose: true
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Dialog closed: ", result)
        this.new_revision.objects.add.push(result)
        this.objects_table_add = new MatTableDataSource(this.new_revision.objects.add)
        this.objects_table_update = new MatTableDataSource(this.new_revision.objects.update)
        this.objects_table_delete = new MatTableDataSource(this.new_revision.objects.delete)
        this.isValid()
      } else {
        console.log("Dialog dismissed")
      }
    })
  }
  

}
