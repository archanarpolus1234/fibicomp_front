import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class ScheduleConfigurationService {

    private scheduleData = new BehaviorSubject<any>( {} );
    currentScheduleData = this.scheduleData.asObservable();
    scheduleHomeEdit = new BehaviorSubject<boolean>(false);
    currentschedulehomeEdit = this.scheduleHomeEdit.asObservable();
    

    currentTab = new BehaviorSubject<string>("");
    currentactivatedTab = this.currentTab.asObservable();

    scheduleHomeDetailEditFlag = new BehaviorSubject<boolean>(false);
    currentScheduleHomeDetailEditFlag = this.scheduleHomeDetailEditFlag.asObservable();

    scheduleHomeAttachmentsEditFlag = new BehaviorSubject<boolean>(false);
    currentScheduleHomeAttachmentsEditFlag = this.scheduleHomeAttachmentsEditFlag.asObservable();

    scheduleHomeAttendanceEditFlag = new BehaviorSubject<boolean>(false);
    currentScheduleHomeAttendanceEditFlag = this.scheduleHomeAttendanceEditFlag.asObservable();

    minutesEditFlag = new BehaviorSubject<boolean>(false);
    currentMinutesEditFlag = this.minutesEditFlag.asObservable();

    constructor() {

    }

    changeScheduleData( scheduleData: any ) {
        this.scheduleData.next( scheduleData );
    }

    changeScheduleHomeDetailEditFlag (flag: boolean) {
        this.scheduleHomeDetailEditFlag.next(flag);
    }

    changeScheduleHomeAttachmentsEditFlag (flag: boolean) {
        this.scheduleHomeAttachmentsEditFlag.next(flag);
    }

    changeScheduleHomeAttendanceEditFlag (flag: boolean) {
        this.scheduleHomeAttendanceEditFlag.next(flag);
    }

    changeMinutesEditFlag (flag: boolean) {
        this.minutesEditFlag.next(flag);
    }
}
