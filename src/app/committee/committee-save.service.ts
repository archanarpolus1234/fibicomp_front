import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CommitteeSaveService {

    constructor( private http: HttpClient, private constant: Constants ) {

    }

    saveCommitteeData( committeeObj: Object ): Observable<JSON> {
        return this.http.post( this.constant.committeeSaveUrl, committeeObj )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    saveResearchAreaCommitteeData( committeeId, committeeObj ) {
        var params = {
            committeeId: committeeId,
            committeeResearchArea: committeeObj
        };
        return this.http.post( this.constant.researchAreaSaveUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteAreaOfResearch( commResearchAreasId, committeeId ) {
        var params = {
            commResearchAreasId: commResearchAreasId,
            committeeId: committeeId
        };
        return this.http.post( this.constant.deleteResearchAreaUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    saveScheduleData( scheduleData: Object ): Observable<JSON> {
        return this.http.post( this.constant.generateScheduleUrl, scheduleData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    updateScheduleData( scheduleData: Object ): Observable<JSON> {
        return this.http.post( this.constant.updateScheduleUrl, scheduleData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteScheduleData( sendScheduleRequestData: Object ): Observable<JSON> {
        return this.http.post( this.constant.deleteScheduleUrl, sendScheduleRequestData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    filterScheduleData( scheduleData: Object ): Observable<JSON> {
        return this.http.post( this.constant.filterScheduleUrl, scheduleData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    resetFilterSchedule( scheduleData: Object ): Observable<JSON> {
        return this.http.post( this.constant.resetFilterScheduleUrl, scheduleData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
