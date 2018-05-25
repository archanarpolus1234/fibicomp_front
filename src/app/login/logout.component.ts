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
                    if(data != null){
                        if (data == 'SUCCESS') {
                            localStorage.removeItem( 'currentUser' );
                            localStorage.removeItem( 'personId' );
                            localStorage.removeItem( 'userFullname' );
                            localStorage.removeItem( 'isAdmin' );
                            localStorage.removeItem( 'exapandedViewProposalHeading' );
                            localStorage.removeItem( 'piechartIndex' );
                            localStorage.removeItem( 'exapandedDonutViewAwardHeading' );
                            localStorage.removeItem( 'donutChartIndex' );
                            localStorage.removeItem( 'exapandedViewAwardHeading' );
                            localStorage.removeItem( 'sponsorCode' );
                            localStorage.removeItem( 'researchSummaryIndex' );
                            localStorage.removeItem( 'dashboardproposalBySponsorTypesWidget' );
                            localStorage.removeItem( 'dashboardinProgressproposalBySponsorWidget' );
                            localStorage.removeItem( 'dashboardAwardBysponsorTypesWidget' );
                            localStorage.removeItem( 'dashboardawardedProposalBySponsorWidget' );
                            localStorage.removeItem( 'dashboardResearchSummaryWidget' );
                            localStorage.removeItem('dashboardExpenditureVolumeWidget');
                            localStorage.removeItem( 'provost' );
                            localStorage.removeItem(' grantManager ');
                            localStorage.removeItem(' currentUrl ');
                            this.loginCheckService.logout();
                            this.router.navigate( ['/loginpage'] );
                        }
                    }
                } );
    }
}
