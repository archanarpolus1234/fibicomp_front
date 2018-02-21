import { Component, OnInit } from '@angular/core';
import {ScheduleService} from '../schedule/schedule.service';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-schedule-component',
  templateUrl: './schedule.component.html',
  providers:[ScheduleService],
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
})
export class ScheduleComponent implements OnInit {

  currentTab: string = 'schedule_home';
  scheduleId: number;

  constructor(private scheduleService: ScheduleService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
      this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
      this.scheduleService.loadScheduleData(this.scheduleId).
      subscribe(data=>{
      });
  }
  
  show_current_tab( e: any, current_tab ) {
      e.preventDefault();
      this.currentTab = current_tab;
  }
}
