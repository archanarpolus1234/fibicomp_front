import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard/dashboard.service';
import { SessionManagementService } from '../session/session-management.service';
import {LoginCheckService} from '../common/login-check.service';

@Component({
    template:'',
    providers:[DashboardService]
})
export class LogoutComponent {

    constructor( private dashboardService: DashboardService, private router: Router, private loginCheckService: LoginCheckService ) { 
        this.logout();
    }

    logout() {
        this.dashboardService.logout().subscribe( 
                data => {
                    console.log(data);
                    if(data != null){ 
                        if (data == 'SUCCESS') {
                            localStorage.removeItem('currentUser');
                            localStorage.removeItem('personId');
                            localStorage.removeItem('userFullname');
                            localStorage.removeItem('isAdmin');
                            this.loginCheckService.logout();
                            this.router.navigate( ['/loginpage'] );
                        }
                    }
                } );
    }
}
