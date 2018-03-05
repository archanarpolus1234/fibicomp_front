import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

import { LoginCheckService } from './login-check.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor( private logincheckService: LoginCheckService, private router: Router ) { }

    canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> {
        return this.logincheckService.isLoggedIn
            .take( 1 )
            .map(( isLoggedIn: boolean ) => {
                if ( !isLoggedIn ) {
                    this.router.navigate( ['/loginpage'] );
                    return false;
                }
                return true;
            } );
    }
}
