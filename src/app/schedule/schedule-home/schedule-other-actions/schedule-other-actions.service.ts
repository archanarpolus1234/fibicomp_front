import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../constants/constants.service';

@Injectable()
export class ScheduleOtherActionsService {
    constructor( private http: Http, private constant: Constants ) {

    }

    public addOtherActions( committeeId, scheduleId: number, committeeScheduleActItems: Object ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            committeeScheduleActItems: committeeScheduleActItems
        };
        return this.http.post( this.constant.addOtherActions, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    public deleteOtherActions( committeeId, scheduleId: number, commScheduleActItemsId ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            commScheduleActItemsId: commScheduleActItemsId
        };
        return this.http.post( this.constant.deleteOtherActions, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
