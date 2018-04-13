import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Constants } from "../../../constants/constants.service";

@Injectable()
export class MinutesService {
    constructor( private http: HttpClient, private constant: Constants ) {

    }

    saveMinuteData( minuteData: Object ): Observable<JSON> {
        return this.http.post( this.constant.addScheduleMinuteUrl, minuteData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    deleteMinuteData( minuteData: Object ): Observable<JSON> {
        return this.http.post( this.constant.deleteScheduleMinuteUrl, minuteData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    updateMinuteData(updatedata: Object): Observable<JSON> {
        return this.http.post( this.constant.updateScheduleMinuteUrl, updatedata )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
}
