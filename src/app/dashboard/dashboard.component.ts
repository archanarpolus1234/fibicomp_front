import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from './dashboard.component.service';
import { SlicePipe } from '@angular/common';
import { Router } from '@angular/router';

import { SessionManagementService } from '../session/session-management.service';
import { ElasticSearchComponent } from '../elasticSearch/elastic-search.component';
import { SessionTimeoutComponent } from '../session/session-timeout.component';
import { Constants } from '../constants/constants.service';
import { DataService } from '../research_summary/dataservice';
import { DashboardData } from '../dashboard/dashboard-data';
import { ExpandedviewService } from '../research_summary/expandedview.service';


@Component( {
    selector: 'dashboard-tpl',
    templateUrl: 'dashboard.component.html',
    providers: [SessionManagementService, Constants, DashboardData],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css']
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
    outputPath: string;
    docId: string;
    polusWebsite: string = 'http://polussolutions.com/';
    userName: string;
    firstName: string;
    lastName: string;
    displayToggle: boolean = false;
    currentRows: number;
    logo: string;
    footerLogo: string;
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
    private resultPie : any ={};
    private awardList : any[];
    private proposalList : any[];
    private awardStateList : any[]=[];
    private awardLength : number;
    private proposalStateList : any[]=[];
    private proposalLength : number;
    private statuscode: any[] = [];
    private proposalstatuscode: any[] = [];
    private sponsorType: string;
    private proposalType: string;

    @ViewChild('notificationBar') notificationBar: ElementRef;
    constructor(private dashboardService: DashboardService, private router: Router, private sessionService: SessionManagementService, private constant: Constants, public dataservice: DataService, private dashboardData: DashboardData) {
        this.outputPath = this.constant.outputPath;
        this.logo = './assets/images/logo.png';
        this.footerLogo = './assets/images/footerLogo.png';
        if (!sessionService.canActivate()) {
            this.router.navigate( ['/loginpage'] );
        } else {
            this.router.navigate( ['/dashboard'] );
        }
        document.addEventListener( 'mouseup', this.offClickHandler.bind(this) );
        localStorage.setItem('researchSummaryIndex', null);
        this.getResearchSummaryData();
    }

    offClickHandler(event: any) {
        if (!this.notificationBar.nativeElement.contains(event.target) ) {
            this.toggleBox = false;
        }
    }

    ngOnInit() {
        this.adminStatus = localStorage.getItem('isAdmin');
        this.userName = localStorage.getItem('currentUser');
        this.fullName = localStorage.getItem('userFullname');
        if (this.adminStatus == 'true') {
            this.isAdmin = true;
        }
    }

    initialLoad(currentPage) {
        this.constval = this.constant.index_url;
        this.dashboardService.loadDashBoard(this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage)
            .subscribe(
            data => {
                this.result = data || [];
                this.totalPage = this.result.totalServiceRequest;
                if (this.currentPosition == "AWARD") {
                    this.serviceRequestList = this.result.awardViews;
                }
                if (this.currentPosition == "PROPOSAL") {
                    this.serviceRequestList = this.result.proposalViews;
                }
                if (this.currentPosition == "IRB") {
                    this.serviceRequestList = this.result.protocolViews;
                }
                if (this.currentPosition == "IACUC") {
                    this.serviceRequestList = this.result.iacucViews;
                }
                if (this.currentPosition == "DISCLOSURE") {
                    this.serviceRequestList = this.result.disclosureViews;
                }
                this.userName = localStorage.getItem('currentUser');
                this.fullName = localStorage.getItem('userFullname');
                this.firstName = localStorage.getItem('firstName');
                this.lastName = localStorage.getItem('lastName');
            } );
    }

    showTab(currentTabPosition) {
        this.personId = localStorage.getItem('personId');
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
        this.sortBy = 'updateTimeStamp';
        this.adminStatus = localStorage.getItem('isAdmin');
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
        if (currentTabPosition === 'SUMMARY') {
            this.getResearchSummaryData();
        } else if (this.adminStatus != 'true') {
            this.initialLoad(this.currentPage);
            this.adminClear = false;
        }
    }

    sortResult(sortFieldBy, current_Position) {
        this.reverse = ( this.sortBy === sortFieldBy ) ? !this.reverse : false;
        if (this.reverse ) {
            this.sortOrder = "DESC";
        } else {
            this.sortOrder = "ASC";
        }
        this.sortBy = sortFieldBy;
        this.initialLoad(this.currentPage);
    }

    getResearchSummaryData() {
        this.dashboardService.getResearchSummaryData()
            .subscribe(data => { 
                this.result = data || [];
                if(this.result != null){
                    this.dashboardData.setdashboardAreaChartData(this.result.expenditureVolumes); 
                    this.dashboardData.setDashboardPieChartData(this.result); 
                    this.summaryViews = this.result.summaryViews;
                }
            } );
    }

    searchUsingAdvanceOptions(currentPage) {
        this.adminClear = false;
        if (this.resultAward === true ) {
            this.resultAward = false;
        }
        if (localStorage.getItem('isAdmin') ) {
            this.adminAdvanceSearch = true;
        }
        this.dashboardService.loadDashBoard(this.advanceSearchCriteria.property1, this.advanceSearchCriteria.property2, this.advanceSearchCriteria.property3, this.advanceSearchCriteria.property4, this.pageNumber, this.sortBy, this.sortOrder, this.currentPosition, currentPage)
            .subscribe(data => {
                this.result = data || [];
                if(this.result != null){
                    this.totalPage = this.result.totalServiceRequest;
                    if (this.currentPosition == "AWARD") {
                        this.serviceRequestList = this.result.awardViews;
                    }
                    if (this.currentPosition == "PROPOSAL") {
                        this.serviceRequestList = this.result.proposalViews;
                    }
                    if (this.currentPosition == "IRB") {
                        this.serviceRequestList = this.result.protocolViews;
                    }
                    if (this.currentPosition == "IACUC") {
                        this.serviceRequestList = this.result.iacucViews;
                    }
                    if (this.currentPosition == "DISCLOSURE") {
                        this.serviceRequestList = this.result.disclosureViews;
                    }
                }
            } );
    }

    clear() {
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        this.adminClear = true;
        if (localStorage.getItem('isAdmin')) {
            this.adminAdvanceSearch = true;
        }
        if (this.adminStatus != 'true') {
            this.adminClear = false;
            this.initialLoad( this.currentPage );
        }
    }

    logout() {
        this.dashboardService.logout().subscribe(
            data => {
                if(data != null){
                    if (data == 'SUCCESS') {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('personId');
                        localStorage.removeItem('userFullname');
                        localStorage.removeItem('isAdmin');
                        this.router.navigate( ['/loginpage'] );
                    }
                }
            } );
    }

    userNotification(event: any) {
        event.preventDefault();
        this.toggleBox = !this.toggleBox;
        this.showmoreClicked = false;
        this.showmoreNeeded = true;
        this.first3notificationList = [];
        this.personId = localStorage.getItem('personId');
        if (this.toggleBox == true) {
            this.dashboardService.userNotification(this.personId)
                .subscribe( data => {
                    this.result = data || [];
                    if(this.result != null){
                        this.notificationList = this.result;
                        this.docId = this.result.documentId;
                        if (this.notificationList.length > 3) {
                            this.morethanThreeNotification = true;
                            for (let i = 0; i < 3; i++) {
                                this.first3notificationList.push(this.notificationList[i]);
                            }
                        }
                    }
                } );
        }
    }

    advanceSearch(event: any) {
        event.preventDefault();
        this.displayToggle = !this.displayToggle;
        this.advanceSearchCriteria.property1 = '';
        this.advanceSearchCriteria.property2 = '';
        this.advanceSearchCriteria.property3 = '';
        this.advanceSearchCriteria.property4 = '';
        if (this.currentPosition === 'AWARD') {
            this.placeholder1 = 'Account';
            this.placeholder2 = 'Lead Unit';
            this.placeholder3 = 'Sponsor';
            this.placeholder4 = 'PI';
        }
        if (this.currentPosition === 'PROPOSAL') {
            this.placeholder1 = 'Proposal Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Sponsor';
        }
        if (this.currentPosition === 'IRB') {
            this.placeholder1 = 'Protocol Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Protocol type';
        }
        if (this.currentPosition === 'DISCLOSURE') {
            this.placeholder1 = 'Disclosure Number';
            this.placeholder2 = 'Name';
            this.placeholder3 = 'Disclosure Disposition';
            this.placeholder4 = 'Module item key';
        }
        if (this.currentPosition === 'IACUC') {
            this.placeholder1 = 'Protocol Number';
            this.placeholder2 = 'Title';
            this.placeholder3 = 'Lead Unit';
            this.placeholder4 = 'Protocol type';
        }
    }

    showMore(event: any) {
        this.showmoreClicked = true;
        event.preventDefault();
        this.showmoreNeeded = false;
    }

    pageChange(currentPage) {
        this.initialLoad(currentPage);
    }

    autocompleteAwardChanged(value) {
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

    autocompleteProposalChanged(value) {
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

    autocompleteIrbChanged(value) {
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

    autocompleteIacucChanged(value) {
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

    autocompleteDisclosureChanged(value) {
        this.resultAward = true;
        this.resultObject = value.obj;
        this.disclosureNo = value.obj.coi_disclosure_number;
        this.disFullName = value.obj.full_name;
        this.disposition = value.obj.disclosure_disposition;
        this.status = value.obj.disclosure_status;
        this.documentNo = value.obj.document_number;
    }

    foundItemsChanged(items) { }

    closeResultTab() {
        if (this.resultAward === true) {
            this.resultAward = false;
        }
    }

    receiveResultCard($event) {
        this.resultAward = $event;
    }

    myDashboard(event: any) {
        event.preventDefault();
        this.router.navigate( ['/dashboard'] );
    }

    expandedView(summaryView) {
        if (summaryView == 'Submitted Proposal') {
            localStorage.setItem('researchSummaryIndex' , "PROPOSALSSUBMITTED");
            localStorage.setItem('expandedViewHeading' , summaryView);
        }
        if (summaryView == 'Inprogress Proposal') {
            localStorage.setItem('researchSummaryIndex' , "PROPOSALSINPROGRESS");
           // this.dataservice.researchSummaryIndex = "PROPOSALSINPROGRESS";
            localStorage.setItem('expandedViewHeading' , summaryView);
           // this.dataservice.expandedViewHeading = summaryView;
        }
        if (summaryView == 'Active Award') {
           // this.dataservice.researchSummaryIndex = "AWARDSACTIVE";
            localStorage.setItem('researchSummaryIndex' , "AWARDSACTIVE");
            this.dataservice.expandedViewHeading = summaryView;
            localStorage.setItem('expandedViewHeading' ,summaryView);
        }
        //this.dataservice.personId = localStorage.getItem( 'personId' );
        this.router.navigate( ['/expandedview'] );
    }
}

