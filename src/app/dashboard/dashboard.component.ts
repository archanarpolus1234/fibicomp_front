import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.component.service';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SessionmanagementService } from "../session/session.management.service";
import { SessiontimeoutService } from '../sessionTimeout/sessiontimeout.service';
import { AwardQuickSearchComponent } from '../quick-search/award-quick-search.component';
import { DisclosureQuickSearchComponent } from '../quick-search/disclosure-quick-search.component';
import { IacucQuickSearchComponent } from '../quick-search/iacuc-quick-search.component';
import { IrbQuickSearchComponent } from '../quick-search/irb-quick-search.component';



@Component( {
    selector: 'dashboard-tpl',
    templateUrl: 'dashboard.component.html',
    providers: [SessionmanagementService, SessiontimeoutService],
    styleUrls: ['../css/bootstrap.min.css', '../css/font-awesome.min.css', '../../assets/css/style.css']
} )

export class DashboardComponent implements OnInit {
    advanceSearchCriteria = {
        property1: '',
        property2: '',
        property3: '',
        property4: ''
    };
    currentPosition: string = 'SUMMARY';
    pageNumber: number;
    sortBy: string = 'updateTimeStamp';
    sortOrder: string = "DESC";
    result: any = {};
    serviceRequestList: any[];
    pagedItems: any[];
    morethanThreeNotification: boolean = false;
    propertyName: string;
    reverse: boolean = true;
    // outputPath:string = 'http://192.168.1.242:8080/kc-dev';
    //outputPath:string = 'http://demo.fibiweb.com/kc-dev';
    outputPath: string = 'http://192.168.1.76:8080/kc-dev';
    userName: string;
    firstName: string;
    lastName: string;
    personID: string;
    displayToggle: boolean = false;
    currentRows: number;
    logo: string;
    footerLogo: string;
    dashBoardResearchSummaryMap: any[];
    fullName: string;
    placeholder1: string;
    placeholder2: string;
    placeholder3: string;
    placeholder4: string;
    notificationList: any[];
    first3notificationList: any[] = [];
    showmoreClicked: boolean = false;
    showmoreNeeded: boolean = true;
    advanceToggle: boolean = false;
    currentPage: number = 1;
    adminAdvanceSearch: boolean = false;
    isAdmin: boolean = false;
    adminStatus: string;
    selectedValue: JSON;
    resultObject: JSON;
    awardNo: string;
    accountNo: string;
    title: string;
    sponsorName: string;
    piName: string;
    departmentName: string;
    resultAward: boolean = false;
    protocolNo: string;
    protocolId: string;
    unitNumber: string;
    status: string;
    protocolType: string;
    disclosureNo: string;
    disposition: string;

    constructor( private dashboardService: DashboardService, private router: Router, private sessionService: SessionmanagementService, private sessiontimeout: SessiontimeoutService ) {
        this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        } else {
            this.router.navigate( ['/dashboard'] );
        }
    }

    ngOnInit() {
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.initialLoad( this.currentPage );
        this.getResearchSummaryData();
        this.fullName = this.dashboardService.setLogindata();
    }

    currentNumberOfRecords: number;
    totalPage: number = 0;

    initialLoad( currentPage ) {
        this.dashboardService.loadDashBoard( this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage )
            .subscribe(
            data => {
                this.result = data || [];
                //console.log( this.result );
                this.totalPage = this.result.totalServiceRequest;
                if ( this.currentPosition == "AWARD" ) {
                    this.serviceRequestList = this.result.awardViews;
                }
                if ( this.currentPosition == "PROPOSAL" ) {
                    this.serviceRequestList = this.result.proposalViews;
                }
                if ( this.currentPosition == "IRB" ) {
                    this.serviceRequestList = this.result.protocolViews;
                }
                if ( this.currentPosition == "IACUC" ) {
                    this.serviceRequestList = this.result.iacucViews;
                }
                if ( this.currentPosition == "DISCLOSURE" ) {
                    this.serviceRequestList = this.result.disclosureViews;
                }
                //this.serviceRequestList = this.result.dashBoardDetailMap;
                //this.currentNumberOfRecords = this.result.serviceRequestCount;
                this.userName = sessionStorage.getItem( 'currentUser' );
                this.fullName = sessionStorage.getItem( 'userFullname' );
            } );
    }

    showTab( currentTabPosition ) {
        this.result = null;
        this.resultAward = false;
        this.serviceRequestList = [];
        this.currentPage = 1;
        this.displayToggle = false;
        this.adminAdvanceSearch = false;
        this.adminStatus = sessionStorage.getItem( 'isAdmin' );
        if ( this.adminStatus == 'true' ) {
            this.isAdmin = true;
        }
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        this.pageNumber = 20;
        this.propertyName = '';
        this.currentPosition = currentTabPosition;
        this.pagedItems = null;
        this.sortBy = 'updateTimeStamp';
        //this.initialLoad(this.currentPage);
        if ( currentTabPosition === 'SUMMARY' ) {
            this.getResearchSummaryData();
        } else {
            this.initialLoad( this.currentPage );
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
        this.initialLoad( this.currentPage );
    }



    getResearchSummaryData() {
        this.dashboardService.getResearchSummaryData()
            .subscribe( data => {
                this.result = data || [];
                this.dashBoardResearchSummaryMap = this.result.summaryViews;
            } );
    }

    searchUsingAdvanceOptions( currentPage ) {
        if ( this.resultAward === true ) {
            this.resultAward = false;
        }
        if ( sessionStorage.getItem( 'isAdmin' ) ) {
            this.adminAdvanceSearch = true;
        }
        //this.dashboardService.searchUsingAdvanceOptions(this.advanceSearchCriteria.property1,  this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.userName, this.currentPosition)
        this.dashboardService.loadDashBoard( this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage )
            .subscribe( data => {
                this.result = data || [];
                if ( this.currentPosition == "AWARD" ) {
                    this.serviceRequestList = this.result.awardViews;
                }
                if ( this.currentPosition == "PROPOSAL" ) {
                    this.serviceRequestList = this.result.proposalViews;
                }
                if ( this.currentPosition == "IRB" ) {
                    this.serviceRequestList = this.result.protocolViews;
                }
                if ( this.currentPosition == "IACUC" ) {
                    this.serviceRequestList = this.result.iacucViews;
                }
                if ( this.currentPosition == "DISCLOSURE" ) {
                    this.serviceRequestList = this.result.disclosureViews;
                }
                //this.serviceRequestList = this.result.dashBoardDetailMap;
                //console.log(this.result.dashBoardDetailMap);
            } );
    }

    clear() {
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        if ( sessionStorage.getItem( 'isAdmin' ) ) {
            this.adminAdvanceSearch = true;
        }
        this.initialLoad( this.currentPage );
    }

    logout() {
        this.dashboardService.logout().subscribe(
            data => {
                if ( data == 'SUCCESS' ) {
                    sessionStorage.removeItem( 'currentUser' );
                    sessionStorage.removeItem( 'userFullname' );
                    sessionStorage.removeItem( 'isAdmin' );
                    this.router.navigate( ['/loginpage'] );
                }
            } );
    }

    userNotification( e: any ) {
        e.preventDefault();
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.first3notificationList = [];
        this.dashboardService.userNotification( this.userName )
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

    advanceSearch( event: any ) {
        event.preventDefault();
        this.displayToggle = !this.displayToggle;
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        if ( this.currentPosition === 'AWARD' ) {
            this.placeholder1 = 'Account';
            this.placeholder2 = 'Sponsor';
            this.placeholder3 = 'Department';
            this.placeholder4 = 'PI';
        }
        if ( this.currentPosition === 'PROPOSAL' ) {
            this.placeholder1 = 'Proposal Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Sponsor';
        }
        if ( this.currentPosition === 'IRB' ) {
            this.placeholder1 = 'Protocol Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Protocol type';
        }
        if ( this.currentPosition === 'DISCLOSURE' ) {
            this.placeholder1 = 'Disclosure Number';
            this.placeholder2 = 'Name';
            this.placeholder3 = 'Disclosure Disposition';
            this.placeholder4 = 'Module item key';
        }
        if ( this.currentPosition === 'IACUC' ) {
            this.placeholder1 = 'Protocol Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Protocol type';
        }
    }

    showMore( event: any ) {
        this.showmoreClicked = true;
        event.preventDefault();
        this.showmoreNeeded = false;
    }

    pageChange( currentPage ) {
        this.initialLoad( currentPage );
    }

    autocompleteAwardChanged(value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.awardNo = value.obj.account_number;
        this.accountNo = value.obj.award_number;
        this.title = value.obj.title;
        this.piName = value.obj.pi_name;
        this.departmentName = value.obj.lead_unit_name;
    }
    
    autocompleteIrbChanged(value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.protocolNo = value.obj.protocol_number;
        this.protocolId = value.obj.protocol_id;
        this.title = value.obj.title;
        this.unitNumber = value.obj.unit_number;
        this.departmentName = value.obj.lead_unit;
        this.status = value.obj.status;
    }
    
    autocompleteIacucChanged(value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.protocolNo = value.obj.protocol_number;
        this.protocolId = value.obj.protocol_id;
        this.title = value.obj.title;
        this.status = value.obj.status;
        this.protocolType = value.obj.protocol_type;
        this.departmentName = value.obj.lead_unit_number;
    }
    
    autocompleteDisclosureChanged(value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.disclosureNo = value.obj.coi_disclosure_number;
        this.fullName = value.obj.full_name;
        this.disposition = value.obj.disclosure_dispositin;
        this.status = value.obj.disclosure_status;
    }
    
    foundItemsChanged(items) {
        console.log( 'Value Detected: ' + items );
    }

    closeResultTab() {
        if ( this.resultAward === true ) {
            this.resultAward = false;
        }
    }

}
