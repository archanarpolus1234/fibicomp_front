import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from "@angular/common/http";

import { Constants } from "../../../../constants/constants.service";

@Injectable()
export class ScheduleAttendanceService {

    constructor( private http: HttpClient, private constants: Constants ) { }

    addGuestMember( guestMemberObj: Object, scheduleId: number ){
        var params = {
            scheduleId: scheduleId,
            updatedAttendance: guestMemberObj
        };
        return this.http.post( this.constants.addGuestMember, params )
            .catch( error => {
                return Observable.throw( error )
            } );
    }

    updateMemberattendanceDate( committeeId: string, scheduleId: number, memberObj: Object ){
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            updatedAttendance: memberObj
        };

        return this.http.post( this.constants.updateScheduleAttendanceData, params )
            .catch( error => {
                return Observable.throw( error )
            } );
    }

    deleteScheduleMemberAttendance( committeeId: string, scheduleId: number, commScheduleAttendanceId: number ) {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            commScheduleAttendanceId: commScheduleAttendanceId
        };
        return this.http.post( this.constants.deleteGuestMenberScheduleAttendance, params )
            .catch( error => {
                return Observable.throw( error )
            } );
    }
}
