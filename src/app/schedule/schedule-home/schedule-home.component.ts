import { Component, OnInit } from '@angular/core';

import {ScheduleConfigurationService} from '../../common/schedule-configuration.service';

@Component({
  selector: 'app-schedule-home',
  templateUrl: './schedule-home.component.html',
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
})
export class ScheduleHomeComponent implements OnInit {
  showProtocol : boolean = false;
  showAttendance : boolean = false;
  showOtherActions : boolean = false;
  showAttachment : boolean = false;
  result: any;

  constructor(public scheduleConfigurationService: ScheduleConfigurationService) { 
  }

  ngOnInit() {
      this.scheduleConfigurationService.currentScheduleData.subscribe(data=>{
              this.result = data;
      });
  }
  
  showProtocolsTab(event: any){
      event.preventDefault();
      this.showProtocol = !this.showProtocol;
  }
  
  showAttendanceTab(event: any){
      event.preventDefault();
      this.showAttendance = !this.showAttendance;
  }
  
  showOtherActionsTab(event: any){
      event.preventDefault();
      this.showOtherActions = !this.showOtherActions;
  }
  
  showAttachmentTab(event: any){
      event.preventDefault();
      this.showAttachment = !this.showAttachment;
  }
  
}
