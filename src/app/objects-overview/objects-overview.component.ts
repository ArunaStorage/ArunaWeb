import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-objects-overview',
  templateUrl: './objects-overview.component.html',
  styleUrls: ['./objects-overview.component.scss']
})
export class ObjectsOverviewComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goBack(){
    this.router.navigate(["/dataset_overview"])
  }

  newObject(){

  }
}
