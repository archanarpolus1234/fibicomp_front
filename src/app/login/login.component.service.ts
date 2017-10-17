import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
    private authUrl: string = 'http://reqres.in/api/login';
    private loggedIn: boolean = false;

    constructor( private http: Http ) { }

    login( userName: string, password: string ): Observable<JSON> {
        var loginUrl = "/login";
        //var loginUrl = "http://demo.fibiweb.com/fibi-comp/login";
       // var loginUrl = "http://192.168.1.76:8080/fibi-comp/login";
        return this.http.post( loginUrl, { userName, password } )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    getTest( userName: string, password: string ): Observable<JSON> {
        return this.http.get( "https://reqres.in/api/users/2" )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
