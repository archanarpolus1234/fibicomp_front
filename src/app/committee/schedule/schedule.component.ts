import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs/Subscription";
import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleConfigurationService } from './schedule-configuration.service';
import { SessionManagementService } from "../../session/session-management.service";
import { ContentChild } from '@angular/core';
import { ScheduleHomeComponent } from './schedule-home/schedule-home.component';
import { MinutesComponent } from './minutes/minutes.component';
import { NavigationEnd } from '@angular/router';


@Component( {
    selector: 'app-schedule-component',
    templateUrl: './schedule.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
    providers: [SessionManagementService,ScheduleHomeComponent,MinutesComponent]
} )
export class ScheduleComponent implements OnInit {
    @ContentChild(ScheduleHomeComponent)
    @ContentChild(MinutesComponent)
    currentTab: string = 'schedule_home';
    scheduleId: number;
    result: any = {};
    public loadScheduleDataSub : Subscription;
    activatedRoute;
    isOnEditScheduleHome: boolean = false;
    showEditWarning: boolean = false;
    homeDetailFlag = false;
    attachmentFlag = false;
    attendanceFlag = false;
    minuteEditFlag = false;

    constructor( public changeRef : ChangeDetectorRef,private scheduleService: ScheduleService, private router: Router, private sessionService: SessionManagementService, private route: ActivatedRoute, private scheduleConfigurationService: ScheduleConfigurationService ) { 
        localStorage.setItem('currentUrl', window.location.href);
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
    }

    ngOnInit() {
        
        this.scheduleId = this.route.snapshot.queryParams['scheduleId'];
        this.currentTab = "schedule_home";
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
        this.scheduleConfigurationService.currentScheduleHomeDetailEditFlag.subscribe(val=>{this.homeDetailFlag = val;});
        this.scheduleConfigurationService.currentScheduleHomeAttachmentsEditFlag.subscribe(val=>{this.attachmentFlag = val;});
        this.scheduleConfigurationService.currentScheduleHomeAttendanceEditFlag.subscribe(val=>{this.attendanceFlag = val;});
        this.scheduleConfigurationService.currentMinutesEditFlag.subscribe(val=>{this.minuteEditFlag = val});
        this.currentTab = current_tab; 
        if(this.currentTab == 'minutes') {
            if( this.homeDetailFlag ==true || this.attachmentFlag ==true || this.attendanceFlag ==true ) {
                this.showEditWarning = true;
            } else {
                    this.showEditWarning = false;
                    this.router.navigate(['committee/schedule/minutes'],{queryParams:{"scheduleId" : this.scheduleId}});
            }
        } else if(this.currentTab == 'schedule_home') {
            if(this.minuteEditFlag == true) {
                this.showEditWarning = true;
             } else {
                this.showEditWarning = false; 
                this.router.navigate(['committee/schedule/scheduleHome'],{queryParams:{"scheduleId" : this.scheduleId}});
            }
        } else {
        }
    }

    onActivate( componentRef ) {
        this.activatedRoute = componentRef;
    }

    saveAndContinue(e) {
        e.preventDefault(); 
        if(this.currentTab == 'minutes') {
            this.activatedRoute.updateDetails();
            this.scheduleConfigurationService.currentTab.next('minutes');
        this.router.navigate(['committee/schedule/minutes'],{queryParams:{"scheduleId" : this.scheduleId}})
        } else {
            for(let index in this.activatedRoute.isEditMinuteItem ) {
                this.activatedRoute.updateMinuteItem(index,this.activatedRoute.result.committeeSchedule.committeeScheduleMinutes[index]);
            }
            this.scheduleConfigurationService.currentTab.next('schedule_home');
        this.router.navigate(['committee/schedule/scheduleHome'],{queryParams:{"scheduleId" : this.scheduleId}})
        }
    }
    
    stayOnPage() {
        this.showEditWarning = false;
        if(this.currentTab == 'schedule_home' ) {
            this.currentTab = 'minutes';
        } else {
            this.currentTab = 'schedule_home';
        }
    }
}
