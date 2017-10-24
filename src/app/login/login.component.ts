import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.component.service';
import { DashboardService } from '../dashboard/dashboard.component.service';
import { SessionmanagementService } from "../session/session.management.service";

@Component({
    selector: 'login-tpl',
    templateUrl: 'login.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css'],
    providers: [SessionmanagementService],
    outputs: ['fullName']
})

export class LoginComponent{
    credentials = {
        username: '',
        password: ''
    };
    fullName: string;
    errorMsg: string;
    isAuthenticated: string;
    loginFail: boolean = false;
    result: any = {};
    personDTO: any[];
    isAdmin : boolean = false;
    personId : string;
    firstName: string;
    lastName: string;
    
    constructor( private loginService: LoginService, private router : Router, private dashboardService:DashboardService, private sessionService : SessionmanagementService ){
        if (!this.sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
          } else {
            this.router.navigate( ['/dashboard']);
          }
    }
    
    login(){
         this.loginService.login( this.credentials.username , this.credentials.password ).subscribe(
             data => {
                        this.result = data || [];
                        this.fullName = this.result.fullName;
                        this.personId = this.result.personID;
                        this.isAdmin = this.result.unitAdmin;
                        this.firstName = this.result.firstName;
                        this.lastName = this.result.lastName;
                        console.log('currentUser : ' + this.result.userName);
                        sessionStorage.setItem( 'currentUser' , this.result.userName);
                        sessionStorage.setItem( 'personId' , this.personId);
                        sessionStorage.setItem( 'userFullname' , this.result.fullName);
                        sessionStorage.setItem( 'firstName' , this.result.firstName);
                        sessionStorage.setItem( 'lastName' , this.result.lastName);
                        sessionStorage.setItem( 'isAdmin' , String(this.isAdmin));
                        if( this.result != null) {
                            this.router.navigate( ['/dashboard'] ); 
                        } else {
                            console.log("invalid user");
                            this.loginFail = true;
                        }
                    },
             error => { 
                        console.log(error); 
                    },
        );      
    } 
}
