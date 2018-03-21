import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpResponse } from "@angular/common/http";

@Injectable()
export class LoginService {
    private authUrl: string = 'http://reqres.in/api/login';
    private loggedIn: boolean = false;

    constructor( private http: HttpClient, private constant: Constants ) { }

    login(username: string, password: string): Observable <HttpResponse<object>>  {
        var params ={
                principalName: username,
                password:password
        }
        return this.http.post(this.constant.loginUrl, params, { observe: 'response' })
          .map(res => res);
      }
}
