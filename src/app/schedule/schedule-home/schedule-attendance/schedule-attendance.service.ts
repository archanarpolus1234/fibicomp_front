import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Constants } from "../../../constants/constants.service";

@Injectable()
export class ScheduleAttendanceService {

    constructor( private http: Http, private constants: Constants ) { }

    addGuestMember( guestMemberObj: Object, scheduleId: number ): Observable<JSON> {
        var params = {
            scheduleId: scheduleId,
            updatedAttendance: guestMemberObj
        };
        return this.http.post( this.constants.addGuestMember, params )
            .map( res => res.json() )
            .catch( error => {
                console.log( error || error )
                return Observable.throw( error )
            } );
    }

    updateMemberattendanceDate( committeeId: string, scheduleId: number, memberObj: Object ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            updatedAttendance: memberObj
        };

        return this.http.post( this.constants.updateScheduleAttendanceData, params )
            .map( res => res.json() )
            .catch( error => {
                console.log( error );
                return Observable.throw( error )
            } );
    }

    deleteScheduleMemberAttendance( committeeId: string, scheduleId: number, commScheduleAttendanceId: number ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            commScheduleAttendanceId: commScheduleAttendanceId
        };
        return this.http.post( this.constants.deleteGuestMenberScheduleAttendance, params )
            .map( res => res.json() )
            .catch( error => {
                console.log( error );
                return Observable.throw( error )
            } );
    }
}
