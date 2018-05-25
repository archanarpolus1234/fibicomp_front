import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from '@angular/router';

import { LoginCheckService } from './common/login-check.service';
import { SessionManagementService } from './session/session-management.service';
import { Subscription } from "rxjs/Subscription";

@Component( {
    selector: 'app-root',
    templateUrl: 'app.component.html',
    providers: [SessionManagementService],
    styleUrls: ['../assets/css/bootstrap.min.css', '../assets/css/font-awesome.min.css', '../assets/css/style.css', '../assets/css/search.css']
} )

export class AppComponent implements OnInit {
    isLoggedIn$: Observable<Boolean>;
    public subscription: Subscription;

    constructor( private loginCheckService: LoginCheckService, private sessionService: SessionManagementService, private router: Router ) {
        this.subscription = router.events.subscribe( event => {
            if ( event instanceof NavigationEnd ) {
                if ( event.url == '/logout' ) {
                    localStorage.removeItem( 'currentUser' );
                    this.loginCheckService.logout();
                    this.router.navigate( ['/loginpage'] );
                }
            }
        } );
        localStorage.setItem('currentUrl', window.location.href);
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
    }

    ngOnInit(): void {
        this.isLoggedIn$ = this.loginCheckService.isLoggedIn;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
