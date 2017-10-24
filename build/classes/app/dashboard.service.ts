import { Injectable } from '@angular/core';
import { Http,HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
//import { HttpClient } from '@angular/common/http';

@Injectable()
export class DashboardService {
    results;
    url = "/api";
    // tabIndex = "PROPOSAL";
    // pageNumber:30;
    // sortBy;
    // reverse;
    
    constructor(private http:Http) { }
    loadDashBoard(){//: Observable<Book[]> {
        // console.log("test2");
        // return this.http.get("api")
        // .subscribe(data => console.log(data));
       var params = JSON.stringify({tabIndex:'PROPOSAL',
                                     pageNumber:30,
                                     sortBy:null,
                                     reverse:null}); 

       var headers = new Headers();
       headers.append('Content-Type','application/x-www-form-urlencoded');
      
         //return this.http.get("getAllUsers").map(res => res.json);
         return this.http.post("fibiDashBoard",params,{headers: headers}).map(res => res.json);
     }
}
