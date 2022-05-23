import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProfileDialogComponent } from '../dialogs/profile-dialog/profile-dialog.component';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';
import { DetailsDialogComponent } from '../dialogs/details-dialog/details-dialog.component';
import { LoadingComponent } from '../dialogs/loading/loading.component';
import { ConfigDetailsDialogComponent } from '../dialogs/config-details-dialog/config-details-dialog.component';
import { CreateRevisionComponent} from '../dialogs/create-revision/create-revision.component';

@Component({
  selector: 'app-version-overview',
  templateUrl: './revision-overview.component.html',
  styleUrls: ['./revision-overview.component.scss']
})
export class RevisionOverviewComponent  implements OnInit {

  @ViewChild(MatSort) sort: MatSort

  table_data: any
  displayedColumns: string[]
  forward_disabled = false
  back_disabled = false

  constructor(
    private dialog: MatDialog,
    public apiService: ApiService,
    public authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
   
   }
  

  ngOnInit(): void {
    
  }

  ngAfterViewInit():void{
    this.table_data.sort = this.sort
  }

  async newRevision(element?: any) {
    console.log('Creating new Revision')
    const loadingRef = this.dialog.open(LoadingComponent, {
      hasBackdrop: true,
      disableClose: true
      
    })
    const dialogRef = this.dialog.open(CreateRevisionComponent, {
      hasBackdrop: true,
      width: '100%',
      height: 'auto',
      disableClose: true,
    })
  }

  refreshVersions(){
    //Function to refresh the data table
    this.apiService.viewDatasetVersions(this.apiService.dataset).then(()=> {
      this.table_data = new MatTableDataSource(this.apiService.datasetVersions)
      this.table_data.sort = this.sort
    })
  }

  openEndpoints(){
    //Function to open the EndpointURL dialog
    const dialogRef = this.dialog.open(ConfigDetailsDialogComponent, {
      position: {right: "10px", top: "10px"},
      hasBackdrop: true,
      width: "30%"
    })
  }

  openProfile() {
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      position: { right: "10px", top: "10px" },
      hasBackdrop: true,

    })
  }
  goBack() {
    this.router.navigate(["/dataset_overview"])
  }
  openSnackBar(){
    //Function to show a snackbar
    this.snackBar.open("ID copied to Clipboard.","",{
      duration: 3000,
      panelClass: ["success-snackbar"]
    })
  }

}
