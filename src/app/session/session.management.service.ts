import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class SessionmanagementService implements CanActivate {

  constructor(private router: Router) { }
    canActivate() {
        if (sessionStorage.getItem('currentUser')) {
            return true;
        }
        this.router.navigate(['/loginpage']);
        return false;
    }
}
