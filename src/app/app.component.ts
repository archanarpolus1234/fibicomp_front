import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { LoginCheckService } from './common/login-check.service';
import { SessionManagementService } from './session/session-management.service';
import { SessionTimeoutComponent } from './session/session-timeout.component';

@Component( {
    selector: 'app-root',
    templateUrl: 'app.component.html',
    providers: [SessionManagementService],
    styleUrls: ['../assets/css/bootstrap.min.css', '../assets/css/font-awesome.min.css', '../assets/css/style.css', '../assets/css/search.css']
} )

export class AppComponent implements OnInit {
    isLoggedIn$: Observable<Boolean>;

    constructor( private loginCheckService: LoginCheckService, private sessionService: SessionManagementService, private router: Router ) {
        if ( !sessionService.canActivate() ) { 
            this.router.navigate( ['/loginpage'] );
        } else {
            this.router.navigate( ['/dashboard'] );
        }
    }

    ngOnInit(): void {
        this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
    }

}
