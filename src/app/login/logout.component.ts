import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard/dashboard.component.service';
import { SessionManagementService } from '../session/session-management.service';

@Component( {
    selector: 'app-logout-tpl',
    template: '',
    providers: [SessionManagementService, DashboardService],
} )

export class LogoutComponent {

    constructor( private dashboardService: DashboardService, private router: Router ) {
        this.logout();
    }

    logout() {
        this.dashboardService.logout().subscribe(
            data => {
                if ( data === 'SUCCESS' ) {
                    localStorage.removeItem( 'currentUser' );
                    localStorage.removeItem( 'personId' );
                    localStorage.removeItem( 'userFullname' );
                    localStorage.removeItem( 'isAdmin' );
                    this.router.navigate( ['/loginpage'] );
                }
            } );
    }
}
