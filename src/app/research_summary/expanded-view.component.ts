import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionManagementService } from "../session/session-management.service";
import { SessionTimeoutComponent } from '../session/session-timeout.component';
import { Constants } from '../constants/constants.service';
import { DashboardService } from '../dashboard/dashboard.service';
import { ExpandedviewService } from "./expanded-view.service";
import { ExpandedViewDataService } from './expanded-view-data-service';

@Component({
    selector: 'expanded-view',
    templateUrl: 'expanded-view.component.html',
    providers: [SessionManagementService, Constants, DashboardService, ExpandedviewService],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css']
})

export class ExpandedviewComponent implements OnInit{
    awardsheading: string;
    proposalheading:string;
    piechartIndex: string;
    summaryResult: any={};
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
    toggleBox : boolean = false;
    result: any = {};
    serviceRequestList: any[];
    polusWebsite : string ='http://polussolutions.com/';
    sortBy: string = 'updateTimeStamp';
    sortOrder: string = "DESC";
    reverse: boolean = true;
    summaryIndex: string;
    summaryheading: string;

    @ViewChild('notificationBar') notificationBar: ElementRef;
    
	constructor(private router: Router, private sessionService: SessionManagementService, private constant: Constants, private dashboardService: DashboardService, private route: ActivatedRoute, private expandedViewService: ExpandedviewService,  public expandedViewDataService: ExpandedViewDataService ) {
	    this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        this.outputPath = this.constant.outputPath;
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        } else {
            this.router.navigate( ['/expandedview'] );
        }
        document.addEventListener('mouseup', this.offClickHandler.bind(this));
	}
	
	offClickHandler(event:any) {
        if (!this.notificationBar.nativeElement.contains(event.target)) { 
                this.toggleBox = false;
        }
    }
	
	 ngOnInit() {
	        this.adminStatus = localStorage.getItem( 'isAdmin' );
	        this.userName = localStorage.getItem( 'currentUser' );
	        this.fullName = localStorage.getItem( 'userFullname' );
	        this.piechartIndex = localStorage.getItem( 'piechartIndex' );
	        this.awardsheading= localStorage.getItem('exapandedViewAwardHeading');
	        this.proposalheading= localStorage.getItem('exapandedViewProposalHeading');
	        this.summaryIndex = localStorage.getItem('researchSummaryIndex');
	        this.summaryheading=localStorage.getItem('expandedViewHeading');
	        if ( this.adminStatus == 'true' ) {
	            this.isAdmin = true;
	        }
	        if( localStorage.getItem('piechartIndex') != null){
	        this.expandedViewService.loadExpandedView( localStorage.getItem('sponsorCode'),  localStorage.getItem('personId'), localStorage.getItem('piechartIndex') ).subscribe(
                    data => {
                        this.piechartResult = data || [];
                        if ( localStorage.getItem('piechartIndex') == "AWARD" ) {
                        this.serviceRequestList = this.piechartResult.awardViews;
                        }
                        if ( localStorage.getItem('piechartIndex') == "PROPOSAL" ) {
                            this.serviceRequestList = this.piechartResult.proposalViews;
                        }
                    } );
	        }
	        if(  localStorage.getItem('researchSummaryIndex') != null ){
	            this.expandedViewService.loadExpandedSummaryView( localStorage.getItem('personId'), localStorage.getItem('researchSummaryIndex')).subscribe(
	                    data => {
	                        this.summaryResult = data || [];
	                        if ( localStorage.getItem('researchSummaryIndex') == "PROPOSALSSUBMITTED" ) { 
	                        this.serviceRequestList = this.summaryResult.proposalViews;
	                        }
	                        if ( localStorage.getItem('researchSummaryIndex') == "PROPOSALSINPROGRESS" ) {
	                            this.serviceRequestList = this.summaryResult.proposalViews;
	                        }
	                        if ( localStorage.getItem('researchSummaryIndex') == "AWARDSACTIVE" ) {
                                this.serviceRequestList = this.summaryResult.awardViews;
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
