import { Injectable } from '@angular/core';

import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants.service';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ExpandedviewService {

    constructor( private http: HttpClient, private constant: Constants ) { }

    loadExpandedView( statusCode: string, personId: string, piechartIndex: string ): Observable<JSON> {
        var params = {
            sponsorCode: statusCode,
            personId: personId,
            pieChartIndex: piechartIndex
        };
        var expandedViewUrl = this.constant.expandedViewUrl;
        return this.http.post( expandedViewUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    loadExpandedSummaryView( personId: string, researchSummaryIndex: string ): Observable<JSON> {
        var params = {
            personId: personId,
            researchSummaryIndex: researchSummaryIndex
        };
        var expandedSummaryViewUrl = this.constant.expandedSummaryViewUrl;
        return this.http.post( expandedSummaryViewUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    loadDonutExpandedView( statusCode: string, personId: string, donutChartIndex: string ): Observable<JSON> {
        var params = {
            sponsorCode: statusCode,
            personId: personId,
            donutChartIndex: donutChartIndex
        };
        var expandedDonutViewUrl = this.constant.expandedDonutViewUrl;
        return this.http.post( expandedDonutViewUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
