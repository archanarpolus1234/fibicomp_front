import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.component.service';
import { DashboardService } from '../dashboard/dashboard.component.service';
import { SessionmanagementService } from "../session/session.management.service";

@Component({
    selector: 'login-tpl',
    templateUrl: 'login.component.html',
    styleUrls: ['../css/bootstrap.min.css', '../css/font-awesome.min.css', '../../assets/css/style.css'],
    providers: [SessionmanagementService],
    outputs: ['fullName']
})

export class LoginComponent{
    credentials = {
        username:'',
        password:''
    };
    fullName: string;
    errorMsg: string;
    isAuthenticated: string;
    loginFail: boolean = false;
    result: any ={};
    personDTO: any[];
    constructor(private loginService:LoginService , private router : Router , private dashboardService:DashboardService, private sessionService : SessionmanagementService){
        if (!this.sessionService.canActivate()) {
            this.router.navigate(['/loginpage']);
          } else {
            this.router.navigate( ['/dashboard']);
          }
    }
    login(){
         this.loginService.login(this.credentials.username,this.credentials.password).subscribe(
             data => {
                        this.result=data || [];
                        localStorage.setItem('currentUser', this.credentials.username);
                        this.fullName =this.result.fullName;
                        localStorage.setItem('userFullname', this.result.fullName);
                        this.dashboardService.getLogindata(this.fullName);
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
