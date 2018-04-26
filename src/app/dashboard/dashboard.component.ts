import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { SlicePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from "rxjs/Subject";
import 'rxjs/add/operator/takeUntil';

import { SessionManagementService } from '../session/session-management.service';
import { ElasticSearchComponent } from '../elastic-search/elastic-search.component';
import { Constants } from '../constants/constants.service';
import { ExpandedViewDataService } from '../research_summary/expanded-view-data-service';
import { DashboardData } from '../dashboard/dashboard-data.service';
import { ExpandedviewService } from '../research_summary/expanded-view.service';
import { DashboardConfigurationService } from '../common/dashboard-configuration-service';

@Component( {
    templateUrl: 'dashboard.component.html',
    providers: [SessionManagementService, Constants, DashboardData],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
} )

export class DashboardComponent implements OnInit {

    filterStartDate: Date;
    filterEndDate: Date;
    isFilterDatePrevious: boolean = false;
    isMandatoryFilterFilled: boolean = true;
    filterValidationMessage: string; 
    nullScheduleData: boolean = false;
    nullCommitteeData: boolean = false;
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
    propertyName: string;
    reverse: boolean = true;
    outputPath: string;
    userName: string;
    firstName: string;
    lastName: string;
    displayToggle: boolean = false;
    currentRows: number;
    fullName: string;
    placeholder1: string;
    placeholder2: string;
    placeholder3: string;
    placeholder4: string;
    currentPage: number = 1;
    adminAdvanceSearch: boolean = false;
    isAdmin: boolean = false;
    adminStatus: string;
    selectedValue: JSON;
    resultObject: JSON;
    resultAward: boolean = false;

    accountNo: string;
    awardNo: string;
    title: string;
    sponsor: string;
    piName: string;
    departmentName: string;
    proposalNo: string;
    status: string;
    protocolNo: string;
    type: string;
    leadUnit: string;
    disclosureNo: string;
    disFullName: string;
    disposition: string;
    protocolType: string;
    personId: string;

    toggleBox: boolean = false;
    currentNumberOfRecords: number;
    totalPage: number = 0;
    awardId: string;
    documentNo: string;
    summaryViews: any[];
    adminClear: boolean = true;
    constval: string;

    private proposalOptions;
    private awardOptions;
    private proposalData;
    private propsalChart;
    private awardChart;
    private awardData;
    private resultPie: any = {};
    private awardList: any[];
    private proposalList: any[];
    private awardStateList: any[] = [];
    private awardLength: number;
    private proposalStateList: any[] = [];
    private proposalLength: number;
    private statuscode: any[] = [];
    private proposalstatuscode: any[] = [];
    private sponsorType: string;
    private proposalType: string;
    private isLoginPage: boolean = true;
    private nullAwardData: boolean = false;
    private nullProposalData: boolean = false;
    private nullIrbData: boolean = false;
    private nullIacucData: boolean = false;
    private nullDisclosureData: boolean = false;
    private dashboardHeaderData: any[];

    public dashboardExpenditureVolumeWidget: boolean = true;
    public dashboardResearchSummaryWidget: boolean = true;
    public dashboardawardedProposalBySponsorWidget: boolean = true;
    public dashboardAwardBysponsorTypesWidget: boolean = true;
    public dashboardproposalBySponsorTypesWidget: boolean = true;
    public dashboardinProgressproposalBySponsorWidget: boolean = true;
    public message: string;
    public onDestroy$ = new Subject<void>();
  

    constructor( private dashboardService: DashboardService, private router: Router, private sessionService: SessionManagementService, private constant: Constants, public expandedViewDataservice: ExpandedViewDataService, private dashboardData: DashboardData, private dashboardConfigurationService: DashboardConfigurationService ) {
        this.outputPath = this.constant.outputPath;
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
        this.getResearchSummaryData();
    }
    
    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
    ngOnInit() {
        this.dashboardConfigurationService.currentdashboardExpenditureVolumeWidget.takeUntil(this.onDestroy$).subscribe( status => {
            this.dashboardExpenditureVolumeWidget = status;
        } );
        this.dashboardConfigurationService.currentdashboardResearchSummaryWidget.takeUntil(this.onDestroy$).subscribe( status => {
            this.dashboardResearchSummaryWidget = status;
        } );
        this.dashboardConfigurationService.currentdashboardawardedProposalBySponsorWidget.takeUntil(this.onDestroy$).subscribe( status => {
            this.dashboardawardedProposalBySponsorWidget = status;
        } );
        this.dashboardConfigurationService.currentdashboardAwardBysponsorTypesWidget.takeUntil(this.onDestroy$).subscribe( status => {
            this.dashboardAwardBysponsorTypesWidget = status;
        } );
        this.dashboardConfigurationService.currentdashboardproposalBySponsorTypesWidget.takeUntil(this.onDestroy$).subscribe( status => {
            this.dashboardproposalBySponsorTypesWidget = status;
        } );
        this.dashboardConfigurationService.currentdashboardinProgressproposalBySponsorWidget.takeUntil(this.onDestroy$).subscribe( status => {
            this.dashboardinProgressproposalBySponsorWidget = status;
        } );

       // localStorage.setItem( 'researchSummaryIndex', null );
        this.adminStatus = localStorage.getItem( 'isAdmin' );
        this.userName = localStorage.getItem( 'currentUser' );
        this.fullName = localStorage.getItem( 'userFullname' );
        if ( this.adminStatus == 'true' ) {
            this.isAdmin = true;
        }
    }

    initialLoad( currentPage ) {
        console.log(this.currentPosition)
        this.constval = this.constant.index_url;
        this.dashboardService.loadDashBoard( this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage, this.filterStartDate, this.filterEndDate )
            .takeUntil(this.onDestroy$).subscribe(
            data => {
                this.result = data || [];
                if ( this.result !== null) {
                    this.totalPage = this.result.totalServiceRequest;
                    if ( this.currentPosition == "AWARD" ) {
                        this.serviceRequestList = this.result.awardViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullAwardData = true;
                        }
                    }
                    if ( this.currentPosition == "PROPOSAL" ) {
                        this.serviceRequestList = this.result.proposalViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullProposalData = true;
                        }
                    }
                    if ( this.currentPosition == "IRB" ) {
                        this.serviceRequestList = this.result.protocolViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullIrbData = true;
                        }
                    }
                    if ( this.currentPosition == "IACUC" ) {
                        this.serviceRequestList = this.result.iacucViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullIacucData = true;
                        }
                    }
                    if ( this.currentPosition == "DISCLOSURE" ) {
                        this.serviceRequestList = this.result.disclosureViews;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullDisclosureData = true;
                        }
                    }
                    if ( this.currentPosition == "COMMITTEE" ) {
                        this.serviceRequestList = this.result.committees;
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullCommitteeData = true;
                        }
                    }
                    if ( this.currentPosition == "SCHEDULE" ) {
                        this.serviceRequestList = this.result.committeeSchedules;
                        console.log(this.result);
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullScheduleData = true;
                        }
                    }
                    if ( this.currentPosition == "GRANT" ) {
                        this.serviceRequestList = this.result.grantCalls;
                        console.log(this.result)
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullScheduleData = true;
                        }
                    }

                    if ( this.currentPosition == "SMU_PROPOSAL" ) {
                        this.serviceRequestList = this.result.proposal;
                        console.log(this.result)
                        if ( this.serviceRequestList == null || this.serviceRequestList.length == 0 ) {
                            this.nullScheduleData = true;
                        }
                    }
                    this.userName = localStorage.getItem( 'currentUser' );
                    this.fullName = localStorage.getItem( 'userFullname' );
                    this.firstName = localStorage.getItem( 'firstName' );
                    this.lastName = localStorage.getItem( 'lastName' );
                }
            } );
    }

   
    showTab( currentTabPosition ) {
        this.personId = localStorage.getItem( 'personId' );
        this.result = null;
        this.resultAward = false;
        this.serviceRequestList = [];
        this.currentPage = 1;
        this.displayToggle = false;
        this.adminAdvanceSearch = false;
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        this.pageNumber = 20;
        this.propertyName = '';
        this.currentPosition = currentTabPosition;

        this.pagedItems = null;
        if ( currentTabPosition === 'COMMITTEE' || currentTabPosition === 'SCHEDULE' ) {
            this.sortBy = 'updateTimestamp';
        } else {
            this.sortBy = 'updateTimeStamp';
        }
        this.adminStatus = localStorage.getItem( 'isAdmin' );
        this.accountNo = ' ';
        this.awardNo = ' ';
        this.title = ' ';
        this.sponsor = ' ';
        this.piName = ' ';
        this.departmentName = ' ';
        this.proposalNo = ' ';
        this.status = ' ';
        this.protocolNo = ' ';
        this.type = ' ';
        this.leadUnit = ' ';
        this.disclosureNo = ' ';
        this.disFullName = ' ';
        this.disposition = ' ';
        this.awardId = ' ';
        this.documentNo = ' ';
        if ( currentTabPosition === 'SUMMARY' ) {
            this.getResearchSummaryData();
        } else if ( this.adminStatus != 'true' ) {
            this.initialLoad( this.currentPage );
            this.adminClear = false;
        }
        if ( currentTabPosition == 'SCHEDULE' ) {
            this.filterStartDate = null;
            this.filterEndDate = null;
            this.filterValidationMessage = "";
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true; 
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
        this.dashboardData.setDashboardAreaChartData1([]);
        this.dashboardData.setDashboardPieChartData1({});
        this.dashboardService.getResearchSummaryData()
            .takeUntil(this.onDestroy$).subscribe( data => {
                this.result = data || [];
                if ( this.result != null ) {
                    this.dashboardData.setdashboardAreaChartData( this.result.expenditureVolumes );
                    this.dashboardData.setDashboardAreaChartData1(this.result.expenditureVolumes);
                    this.dashboardData.setDashboardPieChartData( this.result );
                    this.dashboardData.setDashboardPieChartData1(this.result);
                    this.summaryViews = this.result.summaryViews;
                }
            } );
    }

    searchUsingAdvanceOptions( currentPage ) {
        this.adminClear = false;
        if ( this.resultAward === true ) {
            this.resultAward = false;
        }
        if ( localStorage.getItem( 'isAdmin' ) ) {
            this.adminAdvanceSearch = true;
        }

        this.dashboardService.loadDashBoard( this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage, this.filterStartDate, this.filterEndDate )
            .takeUntil(this.onDestroy$).subscribe( data => {
                this.result = data || [];
                if ( this.result != null ) {
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
                }
            } );
    }
    
    //clear all advanced search fields
    clear() {
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        this.adminClear = true;
        if ( localStorage.getItem( 'isAdmin' ) ) {
            this.adminAdvanceSearch = true;
        }
        if ( this.adminStatus != 'true' ) {
            this.adminClear = false;
            this.initialLoad( this.currentPage );
        }
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
            this.placeholder2 = 'Lead Unit';
            this.placeholder3 = 'Sponsor';
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

    pageChange( currentPage ) {
        this.initialLoad( currentPage );
    }

    autocompleteAwardChanged( value ) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.awardNo = value.obj.award_number;
        this.accountNo = value.obj.account_number;
        this.title = value.obj.title;
        this.piName = value.obj.pi_name;
        this.departmentName = value.obj.lead_unit_name;
        this.awardId = value.obj.award_id;
        this.documentNo = value.obj.document_number;
        this.sponsor = value.obj.sponsor;
    }

    autocompleteProposalChanged( value ) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.proposalNo = value.obj.proposal_number;
        this.piName = value.obj.person_name;
        this.title = value.obj.title;
        this.departmentName = value.obj.lead_unit_name;
        this.sponsor = value.obj.sponsor;
        this.documentNo = value.obj.document_number;
        this.status = value.obj.status;
    }

    autocompleteIrbChanged( value ) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.protocolNo = value.obj.protocol_number;
        this.title = value.obj.title;
        this.piName = value.obj.person_name;
        this.departmentName = value.obj.lead_unit;
        this.status = value.obj.status;
        this.type = value.obj.protocol_type;
        this.leadUnit = value.obj.lead_unit_name;
        this.documentNo = value.obj.document_number;
    }

    autocompleteIacucChanged( value ) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.protocolNo = value.obj.protocol_number;
        this.title = value.obj.title;
        this.status = value.obj.status;
        this.type = value.obj.protocol_type;
        this.piName = value.obj.person_name;
        this.leadUnit = value.obj.lead_unit_name;
        this.documentNo = value.obj.document_number;
    }

    autocompleteDisclosureChanged( value ) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.disclosureNo = value.obj.coi_disclosure_number;
        this.disFullName = value.obj.full_name;
        this.disposition = value.obj.disclosure_disposition;
        this.status = value.obj.disclosure_status;
        this.documentNo = value.obj.document_number;
    }

    foundItemsChanged( items ) { }

    closeResultTab() {
        if ( this.resultAward === true ) {
            this.resultAward = false;
        }
    }

    receiveResultCard( $event ) {
        this.resultAward = $event;
    }

    expandedView( summaryView ) {
        if ( summaryView == 'Submitted Proposal' ) {
            //localStorage.setItem( 'researchSummaryIndex', "PROPOSALSSUBMITTED" );
            this.expandedViewDataservice.setResearchSummaryIndex("PROPOSALSSUBMITTED");
            //localStorage.setItem( 'expandedViewHeading', summaryView );
            this.expandedViewDataservice.setExpandedViewHeading(summaryView);
            this.router.navigate( ['/expandedview'],{queryParams:{"summaryIndex" : "PROPOSALSSUBMITTED","summaryheading" : summaryView}} );
        }
        if ( summaryView == 'In Progress Proposal' ) {
           // localStorage.setItem( 'researchSummaryIndex', "PROPOSALSINPROGRESS" );
            this.expandedViewDataservice.setResearchSummaryIndex("PROPOSALSINPROGRESS");
            //localStorage.setItem( 'expandedViewHeading', summaryView );
            this.expandedViewDataservice.setExpandedViewHeading(summaryView);
            this.router.navigate( ['/expandedview'],{queryParams:{"summaryIndex" : "PROPOSALSINPROGRESS","summaryheading" : summaryView}} );
        }
        if ( summaryView == 'Active Award' ) {
            this.expandedViewDataservice.setResearchSummaryIndex("AWARDSACTIVE");
            this.expandedViewDataservice.setExpandedViewHeading(summaryView);
            this.router.navigate( ['/expandedview'],{queryParams:{"summaryIndex" : "AWARDSACTIVE","summaryheading" : summaryView}} );
        }
        
    }

    filterSchedule() {
        if ( this.filterStartDate > this.filterEndDate ) {
            this.isFilterDatePrevious = true;
            this.filterValidationMessage = "* Please ensure that the To : Date is greater than or equal to the From : Date.";
        } else {
            this.isFilterDatePrevious = false;
        }
        if ( this.filterStartDate == null || this.filterEndDate == null ) {
            this.isMandatoryFilterFilled = false;
            this.filterValidationMessage = "* Please enter the necessary dates to apply filter.";
        } else {
            this.isMandatoryFilterFilled = true;
        }
        if ( this.isMandatoryFilterFilled == true && this.isFilterDatePrevious == false ) {
            this.initialLoad( this.currentPage );
        }
    }

    resetFilterSchedule() {
        if ( this.isFilterDatePrevious == true || this.isMandatoryFilterFilled == false ) {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
            this.filterStartDate = null;
            this.filterEndDate = null;
        } else if ( this.filterStartDate == null || this.filterEndDate == null ) {
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
        } else {
            this.filterStartDate = null;
            this.filterEndDate = null;
            this.isFilterDatePrevious = false;
            this.isMandatoryFilterFilled = true;
            this.initialLoad( this.currentPage );
        }
    }

    loadSchedules(event: any, scheduleId){
        event.preventDefault();
        this.router.navigate(['committee/schedule'], { queryParams: {'scheduleId': scheduleId} });
    }

    loadGrants(event:any, mode){
        event.preventDefault();
        this.currentPosition = 'GRANT';
        this.router.navigate( ['/grant'], { queryParams: {'mode': mode} } );
    }

    viewGrantById(event:any,grantId) {
        event.preventDefault(); 
        this.currentPosition = 'GRANT';
        this.router.navigate( ['/grant'], { queryParams: {'grantId':grantId} });
    }
    
    viewProposalById(event:any,proposalId,grantCallId) {
        event.preventDefault(); 
        this.currentPosition = 'SMU_PROPOSAL';
        this.router.navigate( ['/proposal/createProposal'], { queryParams: {'proposalId':proposalId,'grantId' : grantCallId} });
    }
}
