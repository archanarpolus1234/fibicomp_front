import { Component, OnInit } from '@angular/core';
import { ScheduleConfigurationService } from "../../../common/schedule-configuration.service";

@Component({
  selector: 'app-schedule-attendance',
  templateUrl: './schedule-attendance.component.html',
  styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css']
})
export class ScheduleAttendanceComponent implements OnInit {
  result: any= {};
  showCommentFlag: boolean = false;
  presentFlag: boolean = false;
  attendanceIndex: number;
  commentsIndex: number;

  constructor(private scheduleConfigurationService : ScheduleConfigurationService) { }

  ngOnInit() {
      this.scheduleConfigurationService.currentScheduleData.subscribe(data=>{
         this.result = data;
      });
  }

  showComment(event: any, commentIndex: number){
      event.preventDefault();
      this.showCommentFlag = !this.showCommentFlag;
      this.commentsIndex = commentIndex;
  }
  
  markAttendance(event: any, markingIndex: number){
      event.preventDefault();
      this.presentFlag = !this.presentFlag;
      this.attendanceIndex = markingIndex;
  }
}
