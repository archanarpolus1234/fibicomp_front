import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class LoginService {
    private authUrl: string = 'http://reqres.in/api/login';
    private loggedIn: boolean = false;

    constructor( private http: Http, private constant: Constants ) { }

    login( userName: string, password: string ): Observable<JSON> {
        return this.http.post( this.constant.loginUrl, { userName, password } )
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
