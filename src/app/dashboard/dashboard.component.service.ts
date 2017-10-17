import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { SessionmanagementService } from "../session/session.management.service";

@Injectable()
export class DashboardService {
    results;
    username: string;
    logindata: string;

    constructor( private http: Http, private sessionService: SessionmanagementService ) {
        this.username = sessionStorage.getItem( 'currentUser' );
    }

    loadDashBoard( propery1: string, propery2: string, propery3: string, propery4: string, pageNumber: number, sortBy: string, reverse: string, tabIndex: string, currentPage: number ): Observable<JSON> {
        var params = {
            property1: propery1,
            property2: propery2,
            property3: propery3,
            property4: propery4,
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

    getResearchSummaryData(): Observable<JSON> {
        var params = { userName: this.username };
        var summaryUrl = '/getResearchSummaryData';
        //var summaryUrl = 'http://192.168.1.76:8080/fibi-comp/getResearchSummaryData';
        // var summaryUrl = 'http://demo.fibiweb.com/fibi-comp/getResearchSummaryData';
        //this.url = 'http://demo.fibiweb.com/fibi-comp/getResearchSummaryData';
        return this.http.post( summaryUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    getLogindata( fullName: string ) {
        this.logindata = fullName;
    }

    setLogindata() {
        return this.logindata;
    }

    userNotification( userName: string ): Observable<JSON> {
        var params = {
            userName: userName
        };
        var notificationUrl = "/getUserNotification";
        //var notificationUrl = "http://demo.fibiweb.com/fibi-comp/getUserNotification/getUserNotification";
        //var notificationUrl = "http://192.168.1.76:8080/fibi-comp/getUserNotification";
        return this.http.post( notificationUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );

    }

    logout(): Observable<string> {
       var logoutUrl = "/logout";
        //var logoutUrl = "http://demo.fibiweb.com/fibi-comp/logout";
       //var logoutUrl = "http://192.168.1.76:8080/fibi-comp/logout";

        return this.http.get( logoutUrl )
            .map( res => res.text() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }

}
