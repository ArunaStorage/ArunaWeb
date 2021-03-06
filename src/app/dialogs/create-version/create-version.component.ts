import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ChipDetailsComponent } from '../chip-details/chip-details.component';
import { LoadingComponent } from '../loading/loading.component';
import { MetadataAddComponent } from '../metadata-add/metadata-add.component';
import { MetadataDetailsComponent } from '../metadata-details/metadata-details.component';

@Component({
  selector: 'app-create-version',
  templateUrl: './create-version.component.html',
  styleUrls: ['./create-version.component.scss']
})
export class CreateVersionComponent implements OnInit {

  new_version = {
    name: "", datasetId: "", description: "",
    version: { major: 0, minor: 0, patch: 0, revision: 0, stage: "STABLE" },
    labels: [],
    metadata: [],
    objectGroupIds: [],
  }
  label = { key: "", value: "" };
  semVersion = "0.0.0.0";
  label_table: any
  notValid = true
  requirements = [" Name", " Description", " Semantic Version", " Min. 1 selected Group"]

  labelColumns: string[]
  selectedTableColums: string[]
  objectGroups_data: any
  displayed_objectGroups: any
  selectedGroups_table: any
  selectedGroups_arr = []
  disabled = true
  maxDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)

  //keywordFilter = ""
  filterObject = { keywords: "", name: "", objectcount: { min: 0, max: 0 }, onlySelected: false, onlyUnselected: false, date_range: { start: null, end: null } }

  metaColumns: string[]
  meta_table: any
  metadata_html = []

  disableAnimation = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    console.log(this.data);
    this.labelColumns = ["key", "value", "delete"]
    this.selectedTableColums = ["name", "description", "created", "delete"]
    this.metaColumns = ["name", "actions"]
    this.new_version.datasetId = this.data.dataset.id
    this.label_table = new MatTableDataSource(this.new_version.labels)
    this.selectedGroups_table = new MatTableDataSource(this.selectedGroups_arr)
    this.meta_table = new MatTableDataSource(this.metadata_html)
    this.displayed_objectGroups = this.data.objectGroups
    console.log(this.objectGroups_data)
    console.log(this.maxDate)
    if (this.data.fromOld) {
      console.log("from Old version")
      this.createFromOldVersion()
    }
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //WORKAROUND EXPANDED FLICKER
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }

  addtoLabels() {
    var add = true
    for (let label_inObj of this.new_version.labels) {
      if (label_inObj.key == this.label.key) {
        add = false
      }
    }
    if (this.label.key != "" && this.label.value != "") {
      if (add) {
        this.new_version.labels.push(this.label)
        this.label = {
          key: "",
          value: ""
        }
        this.label_table = new MatTableDataSource(this.new_version.labels)
      } else {
        this.snackBar.open("Key already in use.", "", {
          duration: 3000,
          panelClass: ["warning-snackbar"]
        })
      }
    } else {
      this.snackBar.open("Key or Value can't be empty.", "", {
        duration: 3000,
        panelClass: ["warning-snackbar"]
      })
    }
  }

  deleteLabel(element) {
    const index: number = this.new_version.labels.indexOf(element)
    //console.log(index)
    this.new_version.labels.splice(index, 1)
    this.label_table = new MatTableDataSource(this.new_version.labels)
  }

  /*textFilter(event: Event) {
    //Function for filtering the project table
    const filterValue = (event.target as HTMLInputElement).value;
    this.objectGroups_data.filter = filterValue.trim().toLowerCase();
  }*/

  textFilter(event: Event, scope) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase()
    console.log(filterValue, scope)

    this.displayed_objectGroups = this.data.objectGroups.filter(e => e[scope].includes(filterValue))
    console.log(this.displayed_objectGroups)
  }
  clickedChip(group) {
    console.log(group)
    const dialogRef = this.dialog.open(ChipDetailsComponent, {
      hasBackdrop: true,
      data: {
        group: group
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Dialog closed: ", result)
        if (result == "select") {
          this.data.objectGroups[this.data.objectGroups.indexOf(group)].isSelected = true
          if (!this.selectedGroups_arr.includes(group)) {
            this.selectedGroups_arr.push(group)
            this.selectedGroups_table = new MatTableDataSource(this.selectedGroups_arr)
            this.validVersion()
            console.log(this.data)
          }
        }
        if (result == "unselect") {
          this.removeChip(group)
        }
      } else {
        console.log("Dialog dismissed")
      }
    })
  }
  removeChip(group) {
    this.data.objectGroups[this.data.objectGroups.indexOf(group)].isSelected = false
    if (this.selectedGroups_arr.includes(group)) {
      this.selectedGroups_arr.splice(this.selectedGroups_arr.indexOf(group), 1)
      this.selectedGroups_table = new MatTableDataSource(this.selectedGroups_arr)
    }
    this.validVersion()
    console.log(this.data)
  }
  applyFilter() {
    console.log("applyFilter", this.filterObject)
    var data_to_filter = this.data.objectGroups
    if (this.filterObject.onlySelected) {
      data_to_filter = data_to_filter.filter(e => e.isSelected == this.filterObject.onlySelected)
    }
    if (this.filterObject.onlyUnselected) {
      data_to_filter = data_to_filter.filter(e => e.isSelected != this.filterObject.onlyUnselected)
    }
    console.log(data_to_filter, this.data)
    if (this.filterObject.objectcount.max > 0) {
      data_to_filter = data_to_filter.filter(e => e.objectcount >= this.filterObject.objectcount.min && e.objectcount <= this.filterObject.objectcount.max)
    }
    console.log(data_to_filter, this.data)

    if (this.filterObject.date_range.start != null) {
      data_to_filter = data_to_filter.filter(e => e.created >= this.filterObject.date_range.start.toISOString())
    }
    if (this.filterObject.date_range.end != null) {
      data_to_filter = data_to_filter.filter(e => e.created <= this.filterObject.date_range.end.toISOString())
    }
    if (this.filterObject.name != "") {
      data_to_filter = data_to_filter.filter(e => e.name.toLowerCase().includes(this.filterObject.name.toLowerCase()))
    }
    console.log(data_to_filter, this.data, this.filterObject.keywords.split(","))
    if (this.filterObject.keywords != "") {

      data_to_filter = data_to_filter.filter(e => this.filterObject.keywords.split(",").some(keyword =>
        e.labels.some(label =>
          label.key.toLowerCase().includes(keyword.toLowerCase().trim()) ||
          label.value.toLowerCase().includes(keyword.toLowerCase().trim())) ||
        e.description.toLowerCase().includes(keyword.toLowerCase().trim())
      ))
    }
    console.log(data_to_filter, this.data)
    this.displayed_objectGroups = data_to_filter
  }
  filterUnseleced() {
    console.log("filterUnselected")
    if (this.filterObject.onlySelected) {
      this.displayed_objectGroups = this.data.objectGroups.filter(e => e.isSelected == this.filterObject.onlySelected)
    } else {
      this.displayed_objectGroups = this.data.objectGroups
    }
  }
  filterSeleced() {
    console.log("filterSelected")
    if (this.filterObject.onlyUnselected) {
      this.displayed_objectGroups = this.data.objectGroups.filter(e => e.isSelected != this.filterObject.onlyUnselected)
    } else {
      this.displayed_objectGroups = this.data.objectGroups
    }
  }
  resetFilter() {
    this.filterObject = { keywords: "", name: "", objectcount: { min: 0, max: 0 }, onlySelected: false, onlyUnselected: false, date_range: { start: null, end: null } }
    this.displayed_objectGroups = this.data.objectGroups
  }

  selectAll() {
    for (let group of this.displayed_objectGroups) {
      this.data.objectGroups[this.data.objectGroups.indexOf(group)].isSelected = true
      if (!this.selectedGroups_arr.includes(group)) {
        this.selectedGroups_arr.push(group)
      }
    }
    this.selectedGroups_table = new MatTableDataSource(this.selectedGroups_arr)
    this.validVersion()
  }
  unselectAll() {
    for (let group of this.displayed_objectGroups) {
      this.data.objectGroups[this.data.objectGroups.indexOf(group)].isSelected = false
      if (this.selectedGroups_arr.includes(group)) {
        this.selectedGroups_arr.splice(this.selectedGroups_arr.indexOf(group), 1)
      }
    }
    this.selectedGroups_table = new MatTableDataSource(this.selectedGroups_arr)
    this.validVersion()
  }

  validVersion() {
    this.requirements = [" Name", " Description", " Semantic Version", " Min. 1 selected Group"]
    this.requirements = []

    console.log(this.new_version.version.major + "." + this.new_version.version.minor + "." + this.new_version.version.patch)

    if (this.new_version.name != "" &&
      this.new_version.description != "" &&
      this.selectedGroups_arr.length != 0 &&
      this.new_version.version.major + "." + this.new_version.version.minor + "." + this.new_version.version.patch != "0.0.0") {
      this.notValid = false
      this.requirements = []

    }
    else {
      this.notValid = true

      if (this.new_version.name == "") {
        this.requirements.push(" Name")
      }
      if (this.new_version.description == "") {
        this.requirements.push(" Description")
      }
      if (this.new_version.version.major + "." + this.new_version.version.minor + "." + this.new_version.version.patch == "0.0.0") {
        this.requirements.push(" Semantic Version")
      }
      if (this.selectedGroups_arr.length == 0) {
        this.requirements.push(" Min. 1 selected Group")
      }
    }
  }

  addMetadata() {
    const dialogRef = this.dialog.open(MetadataAddComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: 'auto',
      data: {}
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("Dialog closed: ", result)
        this.new_version.metadata.push({ metadata: JSON.stringify(result) })
        console.log(this.new_version)
        this.metadata_html.push(result)
        this.meta_table = new MatTableDataSource(this.metadata_html)
      } else {
        console.log("Dialog dismissed")
      }
    })
  }
  viewMetadata(element) {

    const dialogRef = this.dialog.open(MetadataDetailsComponent, {
      hasBackdrop: true,
      data: element
    })
  }
  deleteMetadata(element) {
    //console.log(index)
    this.metadata_html.splice(this.metadata_html.indexOf(element), 1)
    this.new_version.metadata.splice(this.new_version.metadata.indexOf({ metadata: JSON.stringify(element) }), 1)
    this.meta_table = new MatTableDataSource(this.metadata_html)
    console.log(this.new_version, this.metadata_html)
  }

  createFromOldVersion() {

    this.new_version.name = "Copy: " + this.data.fromOld.versionDetails.name
    this.new_version.description = this.data.fromOld.versionDetails.description
    this.new_version.version.major = this.data.fromOld.versionDetails.version.major
    this.new_version.version.minor = this.data.fromOld.versionDetails.version.minor
    this.new_version.version.patch = this.data.fromOld.versionDetails.version.patch
    this.new_version.version.revision = this.data.fromOld.versionDetails.version.revision
    this.new_version.version.stage = this.data.fromOld.versionDetails.version.stage
    this.new_version.labels = this.data.fromOld.versionDetails.labels
    this.label_table = new MatTableDataSource(this.new_version.labels)
    this.new_version.metadata = this.data.fromOld.versionDetails.metadata
    for (let group of this.data.fromOld.selectedGroups) {
      console.log(group)
      var real_group = this.data.objectGroups.filter(v => v.id == group.id)[0]
      console.log(group, real_group)
      this.data.objectGroups[this.data.objectGroups.indexOf(real_group)].isSelected = true
      this.selectedGroups_arr.push(real_group)
      this.selectedGroups_table = new MatTableDataSource(this.selectedGroups_arr)
    }
    this.validVersion()
  }

}
