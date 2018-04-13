import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";

import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleConfigurationService } from './schedule-configuration.service';
import { SessionManagementService } from "../../session/session-management.service";


@Component( {
    selector: 'app-schedule-component',
    templateUrl: './schedule.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
    providers: [SessionManagementService]
} )
export class ScheduleComponent implements OnInit {

    currentTab: string = 'schedule_home';
    scheduleId: number;
    result: any = {};
    public loadScheduleDataSub : Subscription;

    constructor( private scheduleService: ScheduleService, private router: Router, private sessionService: SessionManagementService, private activatedRoute: ActivatedRoute, private scheduleConfigurationService: ScheduleConfigurationService ) { 
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
    }

    ngOnInit() {
        this.scheduleId = this.activatedRoute.snapshot.queryParams['scheduleId'];
        this.loadScheduleDataSub = this.scheduleService.loadScheduleData( this.scheduleId ).
            subscribe( data => {
                this.result = data;
                if(this.result !== null){
                    this.scheduleConfigurationService.changeScheduleData( this.result );
                }
            } );
    }
    ngOnDestroy() {
        this.loadScheduleDataSub.unsubscribe();
    }

    show_current_tab( e: any, current_tab ) {
        e.preventDefault();
        this.currentTab = current_tab;
    }
}
