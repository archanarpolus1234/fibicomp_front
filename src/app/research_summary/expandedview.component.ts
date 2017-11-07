import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SessionmanagementService } from "../session/session.management.service";
import { SessiontimeoutComponent } from '../session/sessiontimeout.component';
import { Constants } from '../constants/constants.service';
import { DashboardService } from '../dashboard/dashboard.component.service';
import { ExpandedviewService } from "./expandedview.service";
import { DataService } from './dataservice';

@Component({
    selector: 'expanded-view',
    templateUrl: 'expandedview.component.html',
    providers: [SessionmanagementService, Constants, DashboardService, ExpandedviewService],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css']
})

export class ExpandedviewComponent implements OnInit{
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

	constructor(private router: Router, private sessionService: SessionmanagementService, private constant: Constants, private dashboardService: DashboardService, private route: ActivatedRoute, private expandedViewService: ExpandedviewService,  public dataservice: DataService ) {
	    this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        this.outputPath = this.constant.outputPath;
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        } else {
            this.router.navigate( ['/expandedview'] );
        }
	}
	
	 ngOnInit() {
	        this.adminStatus = localStorage.getItem( 'isAdmin' );
	        this.userName = localStorage.getItem( 'currentUser' );
	        this.fullName = localStorage.getItem( 'userFullname' );
	        if ( this.adminStatus == 'true' ) {
	            this.isAdmin = true;
	        }
	        
	        if( this.dataservice.piechartIndex != null){
	        this.expandedViewService.loadExpandedView( this.dataservice.sponsorCode, this.dataservice.personId, this.dataservice.piechartIndex ).subscribe(
                    data => {
                        this.piechartResult = data || [];
                        if ( this.dataservice.piechartIndex == "AWARD" ) {
                        this.serviceRequestList = this.piechartResult.awardViews;
                        console.log( 'Award data: '+JSON.stringify(this.serviceRequestList) );
                        }
                        if ( this.dataservice.piechartIndex == "PROPOSAL" ) {debugger;
                            this.serviceRequestList = this.piechartResult.proposalViews;
                            console.log( 'Proposal data: '+JSON.stringify(this.serviceRequestList) );
                        }
                    } );
	        }
	        if( this.dataservice.researchSummaryIndex != null ){
	            this.expandedViewService.loadExpandedSummaryView( this.dataservice.personId, this.dataservice.researchSummaryIndex ).subscribe(
	                    data => {
	                        this.summaryResult = data || [];
	                        if ( this.dataservice.researchSummaryIndex == "PROPOSALSSUBMITTED" ) { debugger;
	                        this.serviceRequestList = this.summaryResult.proposalViews;
	                        console.log( 'submitted proposals: '+JSON.stringify(this.serviceRequestList) );
	                        }
	                        if ( this.dataservice.researchSummaryIndex == "PROPOSALSINPROGRESS" ) {
	                            this.serviceRequestList = this.summaryResult.proposalViews;
	                            console.log( 'Proposal data: '+JSON.stringify(this.serviceRequestList) );
	                        }
	                        if ( this.dataservice.researchSummaryIndex == "AWARDSACTIVE" ) {
                                this.serviceRequestList = this.summaryResult.awardViews;
                                console.log( 'Proposal data: '+JSON.stringify(this.serviceRequestList) );
                            }
	                    } );
	            }
	        }
	    
	 
	  myDashboard( event: any ){
	        event.preventDefault();
	        this.router.navigate( ['/dashboard'] );
	    }
	  
	    logout() {
        this.dashboardService.logout().subscribe(
            data => {
                if ( data == 'SUCCESS' ) {
                    localStorage.removeItem( 'currentUser' );
                    localStorage.removeItem( 'personId' );
                    localStorage.removeItem( 'userFullname' );
                    localStorage.removeItem( 'isAdmin' );
                    this.router.navigate( ['/loginpage'] );
                }
            } );
    }

    userNotification( e: any ) {
        e.preventDefault();
        this.toggleBox = !this.toggleBox;
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.first3notificationList = [];
        this.personId = localStorage.getItem( 'personId' );
        if ( this.toggleBox == true ){
            this.dashboardService.userNotification( this.personId )
            .subscribe( data => {
                this.result = data || [];
                this.notificationList = this.result;
                if ( this.notificationList.length > 3 ) {
                    this.morethanThreeNotification = true;
                    for ( let i = 0; i < 3; i++ ) {
                        this.first3notificationList.push( this.notificationList[i] );
                    }
                }
            } );  
        }
    }
    
    showMore( event: any ) {
        this.showmoreClicked = true;
        event.preventDefault();
        this.showmoreNeeded = false;
    }
}