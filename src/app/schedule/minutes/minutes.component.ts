import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-minutes',
  templateUrl: './minutes.component.html',
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class MinutesComponent implements OnInit {
  isMinuteEntryPoppedUp: boolean = false;
  isContigencyPoppedUp: boolean = false;
  isEditMinuteItem: boolean = false;
  selectedOptionEntityType: string;
  currenEntryTab: string;
  selectedProtocol: string;
  selectedItem: string;
  entityType = [
               {name:'Adverse Events', value:'adverseEvents'},
               {name:'Attendance', value:'attendance'},
               {name:'General Comments', value:'generalComments'},
               {name:'Other Business', value:'otherBusiness'},
               {name:'Protocol', value:'protocol'},
               {name:'Protocol Reviewer Comment', value:'protocolReviewerComment'}
               ];
  constructor() { }

  ngOnInit() {
  }
  
  showAddMinutes($event){
      if(this.isMinuteEntryPoppedUp == false) {
          this.isMinuteEntryPoppedUp = true;
      }
      this.selectedOptionEntityType = "generalComments";
  }
  
  onEntityTypeChange(newValue) {
      this.selectedOptionEntityType = newValue;
      switch(this.selectedOptionEntityType) {
          case 'adverseEvents': break;
          case 'attendance': break;
          case 'generalComments': break;
          case 'otherBusiness': break;
          case 'protocol': this.selectedProtocol = '17010213';
              break;
          case 'protocolReviewerComment': this.selectedProtocol = '17010213';
              break;
      }
  }
  
  onProtocolSelect($event) {
      
  }

  onOtherItemSelect($event) {
      
  }

  searchContigency() {
      if ( this.isContigencyPoppedUp == false ) {
         this.isContigencyPoppedUp = true; 
      }
  }

  selectContigencyItem() {
      if ( this.isContigencyPoppedUp == true ) {
          this.isContigencyPoppedUp = false; 
       }
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
  
  editMinuteItem(e) {
      e.preventDefault();
      if(this.isEditMinuteItem == false) {
          this.isEditMinuteItem = true;
      }
  }
  
  deleteMinuteItem(e) {
      e.preventDefault();
  }
  
  saveMinuteItem(e) {
      e.preventDefault();
      if(this.isEditMinuteItem == true) {
          this.isEditMinuteItem = false;
      }
  }
  
  cancelEditMinuteItem(e) {
      e.preventDefault();
      if(this.isEditMinuteItem == true) {
          this.isEditMinuteItem = false;
      }
  }
}
