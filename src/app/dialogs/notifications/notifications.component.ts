import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})

export class NotificationsComponent implements OnInit {

  selected_project : any;
  subresources_checked: boolean = false;
  sub_from_date: boolean = false;
  notValid: boolean = true;
  picked_date: any;
  
  constructor(

    public apiService: ApiService,

  ) { }

  ngOnInit(): void {
  }

  send_subscription(){
    var new_subscription= {selected_project: this.selected_project, subresources_checked: this.subresources_checked, sub_from_date: this.sub_from_date, picked_date: this.picked_date}
    console.log("Subscription Object:", new_subscription)
    this.apiService.createSubscription(new_subscription)
  }

  isValid(){
    if(this.selected_project != undefined){
      if(this.picked_date != undefined || this.sub_from_date == false){
        this.notValid = false
      }
      else{
        this.notValid = true
      }
    }     
    else{
      this.notValid = true
    }  
  }
}
