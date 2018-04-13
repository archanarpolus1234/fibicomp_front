import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class ScheduleConfigurationService {

    private scheduleData = new BehaviorSubject<any>( {} );
    currentScheduleData = this.scheduleData.asObservable();
    scheduleHomeEdit = new BehaviorSubject<boolean>(false);
    currentschedulehomeEdit = this.scheduleHomeEdit.asObservable();
    
    constructor() {

    }

    changeScheduleData( scheduleData: any ) {
        this.scheduleData.next( scheduleData );
    }
}
