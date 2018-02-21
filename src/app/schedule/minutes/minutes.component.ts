import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class MinutesComponent implements OnInit {
  isMinuteEntryPoppedUp: boolean = false;
  optionSelectedEntityType: string = 'adverseEvents';
  constructor() { }

  ngOnInit() {
  }
  
  showAddMinutes($event){
      if(this.isMinuteEntryPoppedUp == false) {
          this.isMinuteEntryPoppedUp = true;
      }
      this.optionSelectedEntityType = "adverseEvents";
  }
  
  saveMinutes() {
      
  }
  
  saveAndNew() {
      this.saveMinutes();
  }
  
  saveAndClose() {
      this.saveMinutes();
      if(this.isMinuteEntryPoppedUp == true) {
          this.isMinuteEntryPoppedUp = false;
      }
  }
}
