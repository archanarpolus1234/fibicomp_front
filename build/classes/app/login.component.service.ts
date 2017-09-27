import { Injectable } from '@angular/core';
import { Http,HttpModule,Headers } from '@angular/http'

@Injectable()
    export class LoginService{
        constructor(private http:Http){}
        username;

        login(a,b){
            var url ="http://localhost:8080/FibiComp"
            var params = {username:a,password:b};
            var headers = new Headers();
            headers.append('Content-Type','application/x-www-form-urlencoded');

            
            console.log("login service");
            return this.http.post("login",params,{headers: headers})
        }
    };