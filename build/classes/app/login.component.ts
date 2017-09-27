import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.component.service'

@Component({
    selector: 'login-tpl',
    templateUrl: 'login.component.html',
    styleUrls: ['css/style.css','css/jquery-ui.css','css/massautocomplete.theme.css']
})

export class LoginComponent{
    
    //constructor(private loginService:LoginService , private router : Router){}
    login(a,b){
        console.log("logging in "+a,b);
        // this.loginService.login(a,b).subscribe(result => {
        //         this.router.navigateByUrl('/dashboard');
        // });
    }

}