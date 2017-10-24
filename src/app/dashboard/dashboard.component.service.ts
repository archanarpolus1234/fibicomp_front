import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { SessionmanagementService } from "../session/session.management.service";

@Injectable()
export class DashboardService {
    username: string;
    personId: string;

    constructor( private http: Http, private sessionService: SessionmanagementService ) {
        this.username = sessionStorage.getItem( 'currentUser' );
        this.personId = sessionStorage.getItem( 'personId' );
    }

    loadDashBoard( property1: string, property2: string, property3: string, property4: string, pageNumber: number, sortBy: string, reverse: string, tabIndex: string, currentPage: number ): Observable <JSON> {
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
            currentPage: currentPage
        };
        var dashboardUrl = "/fibiDashBoard";
        //var dashboardUrl = "http://demo.fibiweb.com/fibi-comp/fibiDashBoard";
        //var dashboardUrl = "http://192.168.1.76:8080/fibi-comp/fibiDashBoard";
        return this.http.post( dashboardUrl, params )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    getResearchSummaryData(): Observable <JSON> {
        this.personId = sessionStorage.getItem( 'personId' );
        var params = { personId: this.personId };
        var summaryUrl = '/getResearchSummaryData';
        //var summaryUrl = 'http://192.168.1.76:8080/fibi-comp/getResearchSummaryData';
       // var summaryUrl = 'http://demo.fibiweb.com/fibi-comp/getResearchSummaryData';
        return this.http.post( summaryUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    userNotification( personId: string ): Observable <JSON> {
        var params = {
                personId: personId
        };
        var notificationUrl = "/getUserNotification";
       // var notificationUrl = "http://demo.fibiweb.com/fibi-comp/getUserNotification";
        //var notificationUrl = "http://192.168.1.76:8080/fibi-comp/getUserNotification";
        return this.http.post( notificationUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
        }

    logout(): Observable <string> {
       var logoutUrl = "/logout";
       //var logoutUrl = "http://demo.fibiweb.com/fibi-comp/logout";
       //var logoutUrl = "http://192.168.1.76:8080/fibi-comp/logout";

        return this.http.get( logoutUrl )
            .map( res => res.text() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            });
    }
}
