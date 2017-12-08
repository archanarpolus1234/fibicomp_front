import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

@Injectable()
export class LoginCheckService {
    private loggedIn = new BehaviorSubject<boolean>( false );

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    constructor( private router: Router ) {
        if ( localStorage.getItem( 'currentUser' ) != null ) { 
            this.loggedIn.next( true );
        } else {
            this.loggedIn.next( false );
            this.router.navigate( ['/loginpage'] );
        }
    }

    login() {
        if ( localStorage.getItem( 'currentUser' ) != null ) {
            this.loggedIn.next( true );
        }
    }

    logout() {
        this.loggedIn.next( false );
        this.router.navigate( ['/loginpage'] );
    }
}
