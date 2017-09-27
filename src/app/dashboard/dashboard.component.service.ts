import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DashboardService {
    results;
    url = '/fibiDashBoard';
    params = JSON.stringify({
    pageNumber:30,
    sortBy:null,
    reverse:null,
    tabIndex: 'AWARD'}); 

    constructor( private http:Http ) { }
    loadDashBoard(pageNumber: number,sortBy: string,reverse: string,tabIndex: string) : Observable<JSON> {
        console.log(pageNumber);
        var params = {
            pageNumber:30,
            sortBy:sortBy,
            reverse:reverse,
            tabIndex:tabIndex}; 
        console.log(params);
        return this.http.post(this.url,params)
                        .map(res => res.json()
                                )
                        .catch(error=>{
                            console.error(error.message || error);
                            return Observable.throw(error.message || error)
                        });
     }
}
