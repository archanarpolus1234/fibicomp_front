import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionManagementService } from "../session/session-management.service";
import { SessionTimeoutComponent } from '../session/session-timeout.component';
import { Constants } from '../constants/constants.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ExpandedviewService } from "./expanded-view.service";
import { ExpandedViewDataService } from './expanded-view-data-service';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';


@Component( {
    selector: 'expanded-view',
    templateUrl: 'expanded-view.component.html',
    providers: [SessionManagementService, Constants, DashboardService, ExpandedviewService],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css']
} )

export class ExpandedviewComponent implements OnInit {
    awardsheading: string;
    sponsorCode: string;
    proposalheading: string;
    donutAwardHeading: string;
    donutProposalHeading: string;
    piechartIndex: string;
    donutchartIndex: string;
    summaryResult: any = {};
    piechartResult: any = {};
    morethanThreeNotification: boolean = false;
    personId: string;
    isAdmin: boolean = false;
    fullName: string;
    userName: string;
    adminStatus: string;
    outputPath: string;
    footerLogo: string;
    logo: string;
    notificationList: any[];
    first3notificationList: any[] = [];
    showmoreClicked: boolean = false;
    showmoreNeeded: boolean = true;
    toggleBox: boolean = false;
    result: any = {};
    serviceRequestList: any[];
    polusWebsite: string = 'http://polussolutions.com/';
    sortBy: string = 'updateTimeStamp';
    sortOrder: string = "DESC";
    reverse: boolean = true;
    summaryIndex: string;
    summaryheading: string;
    nullPiechartAwardData: boolean = false;
    nullPiechartProposalData: boolean = false;
    nullDonutchartAwardData: boolean = false;
    nullDonutchartInprogressData: boolean = false;
    nullResearchSummaryAwardData: boolean = false;
    nullResearchSummaryProposalSubmittedData: boolean = false;
    nullResearchSummaryProposalInprogressData: boolean = false;
    public onDestroy$ = new Subject<void>();

    constructor( private router: Router, private sessionService: SessionManagementService, private constant: Constants, private dashboardService: DashboardService, private route: ActivatedRoute, private expandedViewService: ExpandedviewService, public expandedViewDataService: ExpandedViewDataService ) {
        this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        this.outputPath = this.constant.outputPath;
        if ( !sessionService.canActivate() ) {
            localStorage.setItem('currentUrl', window.location.href);
            this.router.navigate( ['/loginpage'] );
        } 
    }
    
    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
    
    ngOnInit() {
        this.adminStatus = localStorage.getItem( 'isAdmin' );
        this.userName = localStorage.getItem( 'currentUser' );
        this.fullName = localStorage.getItem( 'userFullname' );
        this.sponsorCode = this.route.snapshot.queryParamMap.get('sponsorCode');
        this.awardsheading = this.route.snapshot.queryParamMap.get('expandedViewAwardHeading');
        this.donutProposalHeading = this.route.snapshot.queryParamMap.get('donutProposalHeading');
        this.piechartIndex = this.route.snapshot.queryParamMap.get('pieChartIndex');
        this.donutAwardHeading = this.route.snapshot.queryParamMap.get('donutAwardHeading');
        this.proposalheading = this.route.snapshot.queryParamMap.get('proposalheading');
        this.summaryIndex = this.route.snapshot.queryParamMap.get('summaryIndex');
        this.summaryheading = this.route.snapshot.queryParamMap.get('summaryheading');
        this.donutchartIndex = this.route.snapshot.queryParamMap.get('donutchartIndex');
       
        if ( this.adminStatus == 'true' ) {
            this.isAdmin = true;
        }
        
         if ( this.piechartIndex != "null" ) {
            this.expandedViewService.loadExpandedView( this.sponsorCode, localStorage.getItem( 'personId' ),this.piechartIndex ).takeUntil(this.onDestroy$).subscribe(
                data => {
                    this.piechartResult = data || [];
                    if ( this.piechartIndex == "AWARD" ) {
                        this.serviceRequestList = this.piechartResult.awardViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullPiechartAwardData = true;
                        }
                    }
                    if (  this.piechartIndex == "PROPOSAL" ) {
                        this.serviceRequestList = this.piechartResult.proposalViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullPiechartProposalData = true;
                        }
                    }
                } );
        }
        if ( this.summaryIndex != "null" ) {
            this.expandedViewService.loadExpandedSummaryView( localStorage.getItem( 'personId' ), this.summaryIndex ).takeUntil(this.onDestroy$).subscribe(
                data => {
                    this.summaryResult = data || [];
                    if ( this.summaryIndex == "PROPOSALSSUBMITTED" ) {
                        this.serviceRequestList = this.summaryResult.proposalViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullResearchSummaryProposalSubmittedData = true;
                        }
                    }
                    if ( this.summaryIndex == "PROPOSALSINPROGRESS" ) {
                        this.serviceRequestList = this.summaryResult.proposalViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullResearchSummaryProposalInprogressData = true;
                        }
                    }
                    if (  this.summaryIndex  == "AWARDSACTIVE" ) {
                        this.serviceRequestList = this.summaryResult.awardViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullResearchSummaryAwardData = true;
                        }
                    }
                } );
        }
        if ( this.donutchartIndex != "null" ) {
            this.expandedViewService.loadDonutExpandedView( this.sponsorCode, localStorage.getItem( 'personId' ), this.donutchartIndex ).takeUntil(this.onDestroy$).subscribe(
                data => {
                    this.piechartResult = data || [];
                    if ( this.donutchartIndex == "AWARDED" ) {
                        this.serviceRequestList = this.piechartResult.proposalViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullDonutchartAwardData = true;
                        }
                    }
                    if (  this.donutchartIndex == "INPROGRESS" ) {
                        this.serviceRequestList = this.piechartResult.proposalViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullDonutchartInprogressData = true;
                        }
                    }
                } );
        }
    }

    sortResult( sortFieldBy, current_Position ) {
        this.reverse = ( this.sortBy === sortFieldBy ) ? !this.reverse : false;
        if ( this.reverse ) {
            this.sortOrder = "DESC";
        } else {
            this.sortOrder = "ASC";
        }
        this.sortBy = sortFieldBy;
    }
}
