import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule-component',
  templateUrl: './schedule.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
})
export class ScheduleComponent implements OnInit {

  currentTab: string = 'schedule_home';
  constructor() { }

  ngOnInit() {
  }
  
  show_current_tab( e: any, current_tab ) {
      e.preventDefault();
      this.currentTab = current_tab;
  }
}
