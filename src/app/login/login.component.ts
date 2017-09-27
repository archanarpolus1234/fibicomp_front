import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.component.service'

@Component({
    selector: 'login-tpl',
    templateUrl: 'login.component.html',
    styleUrls: ['../css/style.css','../css/jquery-ui.css','../css/massautocomplete.theme.css']
})

export class LoginComponent{
    credentials = {
        username:'',
        password:''
    };
    loginCheck: string;
    errorMsg: string;
    isAuthenticated: string;
    loginFail: boolean = false;
    constructor(private loginService:LoginService , private router : Router){}
    login(){
         this.loginService.login(this.credentials.username,this.credentials.password).subscribe(
             data => {
                        this.loginCheck=data;
                        console.log(this.loginCheck)
                        if( this.loginCheck === 'SUCCESS') {
                            console.log("logging in "+this.credentials.username,this.credentials.password);
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
