import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../../constants/constants.service';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AwardSummaryService {
    constructor( private http: HttpClient, private constant: Constants ) {

    }

    public loadAwardSummary( awardId: string ): Observable<JSON> {
        var params = {
            awardId: awardId
        };
        return this.http.post( this.constant.awardSummaryUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
