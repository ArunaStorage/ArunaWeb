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

  objects_table: any
  displayedColumns: string[]
  valid = false;

  constructor(
    
    public apiService: ApiService,
    private dialog: MatDialog

  ) { 
    this.objects_table = new MatTableDataSource(this.apiService.objectGroup.currentRevision.objects)
    this.displayedColumns=[ "name", "description", "created", "actions"]
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
        this.objects_table = new MatTableDataSource(this.new_revision.objects.add)
        this.isValid()
      } else {
        console.log("Dialog dismissed")
      }
    })
  }
  

}
