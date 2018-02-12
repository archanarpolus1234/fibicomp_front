import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';

@Injectable()
export class CommitteeSaveService {

    constructor( private http: Http, private constant: Constants ) {

    }

    saveCommitteeData( committeeObj: Object ): Observable<JSON> {
        return this.http.post( this.constant.committeeSaveUrl, committeeObj )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    saveResearchAreaCommitteeData( committeeObj ) {
        return this.http.post( this.constant.researchAreaSaveUrl, committeeObj )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    deleteAreaOfResearch( researchAreaId) {
        var params = {
                researchAreaId: researchAreaId,
            };
        return this.http.get(this.constant.deleteResearchAreaUrl, {params: params })
    }   
    
    saveScheduleData(scheduleData: Object):Observable<JSON> {
        return this.http.post( this.constant.generateScheduleUrl, scheduleData )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteScheduleData(scheduleData: number):Observable<JSON> {
        var params = {
                scheduleId : scheduleData
        }
        return this.http.get( this.constant.deleteScheduleUrl, { params: params } )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
