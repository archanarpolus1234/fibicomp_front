import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleHomeService } from "./schedule-home.service";
import { DatePipe } from '@angular/common';
import { ScheduleConfigurationService } from "../schedule-configuration.service";

@Component( {
    selector: 'app-schedule-home',
    templateUrl: './schedule-home.component.html',
    styleUrls: ['../../../../assets/css/bootstrap.min.css', '../../../../assets/css/font-awesome.min.css', '../../../../assets/css/style.css', '../../../../assets/css/search.css'],
    changeDetection: ChangeDetectionStrategy.Default
} )
export class ScheduleHomeComponent implements OnInit {

    showProtocol: boolean = false;
    showAttendance: boolean = false;
    showOtherActions: boolean = false;
    showAttachment: boolean = false;
    result: any = {};
    committeeSchedule: any = {};
    editDetails: boolean = false;
    isCommitteeDetailsEditMode = false;
    editClass: string;
    editFlag: boolean;
    errorFlag: boolean;
    mode: string;
    meetingDate: string;
    description: string;
    place: string;
    maxProtocols: string;
    availableToReviewers: string;
    comments: string;
    timeTemp: any;
    subDeadline: string;
    startTimeTemp: any;
    endTimeTemp: any;
    isToDisplayHomeData = true;
    scheduleTime: any;
    scheduleStartTime: any;
    scheduleEndTime: any;
    scheduleStatusSelected: string;
    scheduleStatus: any = [];

    constructor( public scheduleConfigurationService: ScheduleConfigurationService, private datePipe: DatePipe, public router: Router, private scheduleHomeService: ScheduleHomeService ) {
        this.result.committeeSchedule = {};
    }

    ngOnInit() {
        this.scheduleConfigurationService.currentScheduleData.subscribe( data => {
            this.result = data;
            if ( this.result !== undefined && this.result.committeeSchedule !== undefined ) {
                this.scheduleTime = new Date( this.result.committeeSchedule.time );
                this.scheduleStartTime = new Date( this.result.committeeSchedule.startTime );
                this.scheduleEndTime = new Date( this.result.committeeSchedule.endTime );
                this.scheduleStatus = this.result.scheduleStatus;
                this.scheduleStatusSelected = this.result.committeeSchedule.scheduleStatus.description;
            }
        } );
    }

    showProtocolsTab( event: any ) {
        event.preventDefault();
        this.showProtocol = !this.showProtocol;
    }

    showAttendanceTab( event: any ) {
        event.preventDefault();
        this.showAttendance = !this.showAttendance;
    }

    showOtherActionsTab( event: any ) {
        event.preventDefault();
        this.showOtherActions = !this.showOtherActions;
    }

    showAttachmentTab( event: any ) {
        event.preventDefault();
        this.showAttachment = !this.showAttachment;
    }

    showEditDetails( committeeSchedule ) {
        this.editDetails = !this.editDetails;
        this.isCommitteeDetailsEditMode = false;
        this.meetingDate = committeeSchedule.meetingDate;
        this.description = committeeSchedule.scheduleStatus.description;
        this.place = committeeSchedule.place;
        this.timeTemp = this.scheduleTime;
        this.subDeadline = committeeSchedule.protocolSubDeadline;
        this.maxProtocols = committeeSchedule.maxProtocols;
        this.startTimeTemp = this.scheduleStartTime;
        this.endTimeTemp = this.scheduleEndTime;
        this.availableToReviewers = committeeSchedule.availableToReviewers;
        this.comments = committeeSchedule.comments;
        if ( this.editDetails ) {
            this.editClass = 'scheduleBoxes';
        }
    }

    updateDetails() {
        this.editDetails = false;
        this.result.committeeId = this.result.committeeSchedule.committeeId;
        this.result.committeeSchedule.viewTime.time = this.datePipe.transform( this.scheduleTime, 'hh:mm' );
        this.result.committeeSchedule.viewTime.meridiem = this.datePipe.transform( this.scheduleTime, 'aa' );
        this.result.committeeSchedule.viewStartTime.time = this.datePipe.transform( this.scheduleStartTime, 'hh:mm' );
        this.result.committeeSchedule.viewStartTime.meridiem = this.datePipe.transform( this.scheduleStartTime, 'aa' );
        this.result.committeeSchedule.viewEndTime.time = this.datePipe.transform( this.scheduleEndTime, 'hh:mm' );
        this.result.committeeSchedule.viewEndTime.meridiem = this.datePipe.transform( this.scheduleEndTime, 'aa' );
        this.scheduleStatus.forEach(( value, index ) => {
            if ( value.description == this.scheduleStatusSelected ) {
                value.updateTimestamp = new Date();
                value.updateUser = localStorage.getItem( 'currentUser' );
                this.result.committeeSchedule.scheduleStatus = value;
                this.result.committeeSchedule.scheduleStatusCode = value.scheduleStatusCode;
                this.scheduleStatusSelected = value.description;
            }
        } );
        this.scheduleHomeService.saveScheduleData( this.result ).subscribe( data => {
            this.result = data;
        } );
    }

    cancelEditDetails() {
        this.errorFlag = false;
        this.editDetails = !this.editDetails;
        if ( !this.editDetails ) {
            this.editClass = 'committeeBoxNotEditable';
        }
        this.result.committeeSchedule.meetingDate = this.meetingDate;
        this.result.committeeSchedule.scheduleStatus.description = this.description;
        this.result.committeeSchedule.place = this.place;
        this.scheduleTime = this.timeTemp;
        this.result.committeeSchedule.protocolSubDeadline = this.subDeadline;
        this.result.committeeSchedule.maxProtocols = this.maxProtocols;
        this.scheduleStartTime = this.startTimeTemp;
        this.scheduleEndTime = this.endTimeTemp;
        this.result.committeeSchedule.availableToReviewers = this.availableToReviewers;
        this.result.committeeSchedule.comments = this.comments;
    }
}
