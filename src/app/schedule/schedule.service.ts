import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';

@Injectable()
export class ScheduleService {
    constructor( private http: Http, private constant: Constants ) {

    }
    public loadScheduleData( scheduleId: number ): Observable<JSON> {
        var params = {"scheduleId": "895"};
            return this.http.post( this.constant.loadScheduleData, params )
                .map( res => res.json() )
                .catch( error => {
                    console.error( error.message || error );
                    return Observable.throw( error.message || error )
                } );
    }
}
