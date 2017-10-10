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
    username : string;
    url = '/fibiDashBoard';
    //url = 'http://demo.fibiweb.com/fibi-comp/fibiDashBoard';
    params = JSON.stringify({
    pageNumber:30,
    sortBy:null,
    reverse:null,
    tabIndex: 'AWARD'}); 
    logindata : string;

    constructor( private http:Http, private sessionService : SessionmanagementService ) {
        this.username = localStorage.getItem('currentUser');
        console.log('username inside constructor : ' +this.username);
    }
    loadDashBoard(pageNumber: number,sortBy: string,reverse: string,tabIndex: string) : Observable<JSON> {
        console.log(pageNumber);
        var params = {
            pageNumber:pageNumber,
            sortBy:sortBy,
            reverse:reverse,
            tabIndex:tabIndex,
            userName :this.username}; 
        console.log(params);
        return this.http.post(this.url,params)
                        .map(res => res.json()
                                )
                        .catch(error=>{
                            console.error(error.message || error);
                            return Observable.throw(error.message || error)
                        });
     }
    getResearchSummaryData() : Observable<JSON> {
        var params = {
                userName :this.username}; 
        return this.http.post('/getResearchSummaryData',params)
        //return this.http.get('http://demo.fibiweb.com/fibi-comp/getResearchSummaryData')
                        .map(res => res.json())
                        .catch(error=>{
                            console.error(error.message || error);
                            return Observable.throw(error.message || error)
                        });
        
    }
    getLogindata(fullName: string){
        this.logindata = fullName;
    }
    setLogindata(){
        return this.logindata;
    }
    
    logout() : Observable <string>{
        return this.http.get('/logout ')
        //return this.http.get('http://demo.fibiweb.com/fibi-comp/logout ')
        .map(res => res.text())
        .catch(error => {
            console.error(error.message || error);
            return Observable.throw(error.message || error);
        });
        
    }
    
}
