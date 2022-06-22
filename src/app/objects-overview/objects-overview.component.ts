import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateObjectComponent } from '../dialogs/create-object/create-object.component';
import { ApiService} from '../services/api.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-objects-overview',
  templateUrl: './objects-overview.component.html',
  styleUrls: ['./objects-overview.component.scss']
})
export class ObjectsOverviewComponent implements OnInit {

  objects_table: any
  displayedColumns: string[]

  constructor(
    private router: Router,
    private dialog: MatDialog,    
    public apiService: ApiService,
  ) { 
    this.displayedColumns=[ "name", "type", "filesize","created", "status","actions"]
    this.objects_table = new MatTableDataSource(this.apiService.objects)
  }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigate(["/dataset_overview"])
  }

  newObject(){
    const dialogRef = this.dialog.open(CreateObjectComponent,
      {
        hasBackdrop: true,
        disableClose: true
      })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Dialog closed: ", result)
        
      } else {
        console.log("Dialog dismissed")
      }
    })
  }

  viewDetails(){

  }

  openSnackBar(){

  }

  downloadObject(){

  }

}
