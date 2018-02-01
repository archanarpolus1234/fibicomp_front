import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }
  showProtocolsTab($event){
      event.preventDefault();
      this.showProtocol = !this.showProtocol;
  }
  showAttendanceTab($event){
      event.preventDefault();
      this.showAttendance = !this.showAttendance;
  }
  showOtherActionsTab($event){
      event.preventDefault();
      this.showOtherActions = !this.showOtherActions;
  }
  showAttachmentTab($event){
      event.preventDefault();
      this.showAttachment = !this.showAttachment;
  }
}
