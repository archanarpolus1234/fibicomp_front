import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleConfigurationService } from '../common/schedule-configuration.service';

@Component( {
    selector: 'app-schedule-component',
    templateUrl: './schedule.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
} )
export class ScheduleComponent implements OnInit {

    currentTab: string = 'schedule_home';
    scheduleId: number;
    result: any = {};

    constructor( private scheduleService: ScheduleService, private activatedRoute: ActivatedRoute, private scheduleConfigurationService: ScheduleConfigurationService ) { }

    ngOnInit() {
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.scheduleService.loadScheduleData( this.scheduleId ).
            subscribe( data => {
                this.result = data;
                this.scheduleConfigurationService.changeScheduleData( this.result );
            } );
    }

    show_current_tab( e: any, current_tab ) {
        e.preventDefault();
        this.currentTab = current_tab;
    }
}
