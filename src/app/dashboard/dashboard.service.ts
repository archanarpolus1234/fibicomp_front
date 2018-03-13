import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { SessionManagementService } from '../session/session-management.service';
import { Constants } from '../constants/constants.service';

@Injectable()
export class DashboardService {
    username: string;
    personId: string;

    constructor( private http: Http, private sessionService: SessionManagementService, private constant: Constants ) {
        this.username = localStorage.getItem( 'currentUser' );
        this.personId = localStorage.getItem( 'personId' );
    }

    loadDashBoard( property1: string, property2: string, property3: string, property4: string, pageNumber: number, sortBy: string, reverse: string, tabIndex: string, currentPage: number, filterStartDate: Date, filterEndDate: Date ): Observable<JSON> {
        this.personId = localStorage.getItem( 'personId' );
        var params = {
            property1: property1,
            property2: property2,
            property3: property3,
            property4: property4,
            pageNumber: pageNumber,
            sortBy: sortBy,
            reverse: reverse,
            tabIndex: tabIndex,
            userName: this.username,
            personId: this.personId,
            currentPage: currentPage,
            filterStartDate: filterStartDate,
            filterEndDate: filterEndDate
        };
        return this.http.post( this.constant.dashboardUrl, params )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    getResearchSummaryData(): Observable<JSON> {
        this.personId = localStorage.getItem( 'personId' );
        var params = {
            personId: this.personId
        };
        return this.http.post( this.constant.summaryUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    userNotification( personId: string ): Observable<JSON> {
        var params = {
            personId: personId
        };
        return this.http.post( this.constant.notificationUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    logout(): Observable<string> {
        return this.http.get( this.constant.logoutUrl )
            .map( res => res.text() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }
}
