import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from "@angular/common/http";
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
    tokenValue: string;

    constructor( private http: HttpClient, private sessionService: SessionManagementService, private constant: Constants ) {
        /*this.username = localStorage.getItem( 'currentUser' );
        this.personId = localStorage.getItem( 'personId' );*/
    }

    loadDashBoard( property1: string, property2: string, property3: string, property4: string, pageNumber: number, sortBy: string, reverse: string, tabIndex: string, currentPage: number, filterStartDate: Date, filterEndDate: Date ): Observable<JSON> {
        this.username = localStorage.getItem( 'currentUser' );
        this.personId = localStorage.getItem( 'personId' );
        var provost = ( localStorage.getItem( 'provost' ) == 'true' ) ? true : false;
        var reviewer = ( localStorage.getItem( 'reviewer' ) == 'true' ) ? true : false;
        var personId = (localStorage.getItem('isAdmin') != 'true') ? this.personId : '';
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
            personId: personId,
            currentPage: currentPage,
            isUnitAdmin:localStorage.getItem('isAdmin'),
            unitNumber: localStorage.getItem('unitNumber'),
            provost: provost,
            reviewer: reviewer
        };
        return this.http.post( this.constant.dashboardUrl, params )
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
        return this.http.post( this.constant.summaryUrl, params)
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
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    logout(): Observable<string> {
        return this.http.get( this.constant.logoutUrl )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }

    applicationReport( reportItemId, reportName, personId ) {
        var params = {};
        if ( reportName == 'Expenditure by Project' ) {
            params = {
                awardNumber: reportItemId,
                reportName: reportName,
                personId: personId
            }
        } else {
            params = {
                grantCallId: reportItemId,
                reportName: reportName,
                personId: personId
            }
        }

        return this.http.post( this.constant.applicationReport, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }

    fetchAllReportData(): Observable<JSON> {
        return this.http.post( this.constant.fetchOpenGrantIds,{} )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error );
        } );
    }

}
