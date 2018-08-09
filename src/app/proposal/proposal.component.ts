import { Component, OnInit, AfterViewInit, ContentChild, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionManagementService } from "../session/session-management.service";
import { Subject, Observable } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import { CompleterService, CompleterData } from "ng2-completer";
import { SlicePipe } from '@angular/common';
import { UploadFile, UploadEvent } from "ngx-file-drop";
import { CommitteeMemberEmployeeElasticService } from '../elastic-search/committee-members-employees-elastic-search.service';
import { CommitteeMemberNonEmployeeElasticService } from '../elastic-search/committee-members-nonEmployee-elastic-search.service';
import { FormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';
import * as _ from "lodash";

import { ProposalHomeComponent } from './proposal-home/proposal-home.component';

import { ProposalCreateEditService } from "./proposal-create-view.service";
import { GrantService } from "../grant/grant.service";
import 'rxjs/Rx';

declare var $: any;

@Component( {
    selector: 'proposal',
    templateUrl: './proposal.component.html',
    providers: [ProposalCreateEditService, SessionManagementService, CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],

} )
export class ProposalComponent implements OnInit {

    selectedAttachmentStopOne: any = [];
    selectedAttachmentStopTwo: any = [];
    selectedAttachmentStopThree: any = [];
    selectedAttachmentStopFour: any = [];
    selectedAttachmentReviewer: any = [];
    mode: string = 'view';
    showGrantSearch: boolean = true;
    isAOREnabled: boolean = true;
    editClass: string = "committeeBox";
    editAreaClass: string = 'scheduleBoxes';
    sendObject: any = {};
    result: any = {};
    proposalTypeSelected: string;
    proposalCategorySelected: string;
    durInYears: number;
    durInMonths: number;
    durInDays: number;
    keywordsList: any = [];
    selectedKeyword: string;
    keywordObject: any = {};
    currentUser: string = localStorage.getItem( 'currentUser' );
    addedList: any[] = [];
    selectedICLLab: string;
    isDateWarningText: boolean = false;
    dateWarningText: string;
    selectedGrantCall: string;
    grantCallList: any = [];
    personRoleSelected: string;
    personRolesList: any = [];
    personWarningFlag: boolean = false;
    personWarningMsg: string = '';
    budgetCategorySelected: string;
    costElementSelected: string;
    budgetDescription: string;
    budgetCost: number;
    budgetWarningFlag: boolean = false;
    budgetWarningMsg: string;
    showDeleteBudget: boolean = false;
    isMandatory: boolean = false;
    mandatoryText: string = '';
    researchTypeSelected: string;
    showApproveDisapproveModal: boolean = false;
    approveDisapprovePlaceHolder: string;
    modalAproveHeading: string;
    approveComments: string;
    workflowStopOne: any = [];
    workflowStopTwo: any = [];
    proposalPIName: string;
    proposalLeadUnit: string;
    isRevExpanded: any = {};
    showReviewerModal: boolean = false;
    reviewerList: any = [];
    availableReviewers: any = [];
    selectedReviewer: string;
    tempLoggedWorkflowDetail: any = {};
    showConfirmModal: boolean = false;
    confirmHeading: string;
    confirmMessage: string;
    isForward: boolean = false;
    isEndorse: boolean = false;
    showSuccessMessage: boolean = false;
    successMessage: string;
  
    showAddAttachment: boolean = false;
    uploadedFile: any[] = [];
    attachmentDescription: string;
    index: number;
    public files: UploadFile[] = [];
    showDeleteAttachment: boolean;
    tempSaveAttachment: any = {};
    attachmentObject: any = {};
    file: FileList;
    ismandatoryFilled: boolean=true;
    selectedAttachmentType: string;
    areaList: any = [];
    selectedAreaType: string;
    selectedArea: string;
    tempAreaObject: any = {};
    showDeleteResearchArea: boolean = false;
    selectedProtocol: string;
    showDeleteIRB: boolean = false;
    tempSaveIRBObject: any = {};
    protocolsList: any = [];
    selectedSponsorType: string;
    selectedSponsorName: string;
    sponsorAmount: number = 0;
    tempSaveSponsorObject: any = {};
    showDeleteSponsor: boolean = false;
    isKeywordWarning: boolean = false;
    keywordWarningText: string;
    isAreaWarning: boolean = false;
    areaWarningText: string;
    isFundingWarning: boolean = false;
    fundingWarningText: string;
    isIRBWarning: boolean = false;
    irbWarningText: string;
    fundingStartDate: any;
    fundingEndDate: any;
    showAddedModal: boolean = false;
    showSubmittedModal: boolean = false;
    isRoutelogOpened: boolean = false;
    select: string = '--Select--';
    //for setting validation of start Date
    currentDate: Date = new Date();
    selectedMember: any;
    iconClass: any;
    memberTypes = [
        { name: 'Employee', value: 'Employee' },
        { name: 'Non-Employee', value: 'Non-Employee' }
    ];
    memberTypeSelected: string = 'Employee';
    tempSavePersonObject: any = {};
    tempBudgetObject: any = {};
    showDeleteMember: boolean = false;
    isProposalSaved: boolean = false;
    isProposalSubmitted: boolean = false;

    //for elastic search
    searchActive: boolean = false;
    searchTextModel: string;
    searchMember: string;
    message: string;
    searchText: FormControl = new FormControl( '' );
    nonEmployeeFlag: boolean = false;
    employeeFlag: boolean = true;
    elasticSearchresults: any[] = [];
    hits_source: any;
    prncpl_id: any;
    full_name: any;
    rolodexId: any;
    first_name: any;
    middle_name: any;
    last_name: any;
    _results: any;
    placeHolderText: string = 'Search an employee';
    proposalId: string;
    grantId: string = null;
    workflow: any = {};
    grantManager: string;
    provost: string;
    finalStatus: string = null;
    userName: string;
    homeUnits: any = [];
    selectedHomeUnit: string;
    showDeleteGrantCall: boolean = false;
    isGrantCallWdgtOpen: boolean = true;
    isareaWdgtOpen: boolean = true;
    isTeamWdgtOpen: boolean = true;
    isProjectDescWdgtOpen: boolean = true;
    isBudgetWdgtOpen: boolean = true;
    isDeclareWdgtOpen: boolean = true;
    isResDescReadMore: boolean = false;
    isGrantThemeReadMore: boolean = false;
    isAbsDescReadMore: boolean = false;
    isFundDescReadMore: boolean = false;
    isDeliverReadMore: boolean = false;
    budgetDescExpand: any = {};
    commentsExpand:any = {};
    commentsGrantAdminExpand:any = {};
    commentsGrantManagerExpand:any = {};
    reviewerAlreadyAddedMsg = false;
    noAttachmentSelectedMsg: boolean = false;
    duplicateAttachmentMsg: boolean = false;
    noReviewerAdded: boolean = false;
    showSaveProposalModal: boolean = false;
    showSubmitSuccessfullyModal: boolean = false;
    isAttachmentListOpen: boolean = true;
    showConfirmGoBack: boolean = false;
    proposalTabPosition: string = 'PROPOSAL_HOME';
    proposalValidityFlag: boolean;
    showProposalValidityModal: boolean = false;
    proposalObject: any;

    public onDestroy$ = new Subject<void>();
    
    private proposalTab_subscription: ISubscription;
    private proposalFlag_subscription: ISubscription;
    private proposal_subscription: ISubscription;

    constructor( public grantService: GrantService, public committeeMemberNonEmployeeElasticService: CommitteeMemberNonEmployeeElasticService, public committeeMemberEmployeeElasticService: CommitteeMemberEmployeeElasticService, public _ngZone: NgZone, public changeRef: ChangeDetectorRef, public route: ActivatedRoute, private router: Router, private sessionService: SessionManagementService, private proposalCreateService: ProposalCreateEditService, public completerService: CompleterService) {
    /*this.proposal_subscription = this.proposalCreateService.proposalObjectVariable.subscribe( proposalObject => {
        //this.proposalObject = proposalObject;
    } );
    if(this.proposal_subscription) {
        this.proposal_subscription.unsubscribe();
    } */
        //this.proposalCreateService.setResponseObject({});
        if ( !sessionService.canActivate() ) {
            localStorage.setItem('currentUrl', window.location.href);
            this.router.navigate( ['/loginpage'] );
        }
        this.grantManager = localStorage.getItem('grantManager');
        this.provost = localStorage.getItem('provost');
        this.sendObject = {};
        this.result.proposal = {};
    }

    ngOnInit() {
        this.proposal_subscription = this.proposalCreateService.proposalObjectVariable.subscribe( proposalObject => {
            this.proposalObject = proposalObject;
            if(this.proposalObject.proposalId != null) {
                this.result.proposal = this.proposalObject;
            }
        } );
      this.proposalCreateService.setProposalTab('PROPOSAL_HOME');
      this.proposalTab_subscription = this.proposalCreateService.proposalTabVariable.subscribe( proposalTab => {
        this.proposalTabPosition = proposalTab;
      } );
      this.proposalFlag_subscription = this.proposalCreateService.proposalValidityFlagVariable.subscribe( proposalValidityFlag => {
          this.proposalValidityFlag = proposalValidityFlag;
        } );
      this.userName = localStorage.getItem('currentUser');
      this.keywordsList = [];
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.mode = this.route.snapshot.queryParamMap.get('mode');
      if(this.mode == 'create'){
          this.proposalCreateService.setProposalValidityFlag(true);
      }
      this.grantId = this.route.snapshot.queryParamMap.get('grantId');

      this.proposalId = this.route.snapshot.queryParamMap.get('proposalId');
      if (this.proposalId == null) {
        this.mode = 'create';
        this.editClass = "committeeBox";
        this.editAreaClass = "scheduleBoxes";
        this.proposalCreateService.setProposalValidityFlag(true);
      } else {
          this.proposalCreateService.setProposalValidityFlag(false);
      }
    }
    
    showTab(currentTab) {
        if(currentTab == 'PROPOSAL_HOME') {
            this.proposalCreateService.setProposalTab('PROPOSAL_HOME');
            this.router.navigate(['/proposal/proposalHome'], { queryParams: {'proposalId': this.proposalId, 'grantId': this.grantId }, queryParamsHandling: 'preserve'});    
        } else if (currentTab == 'BUDGET') {
            if(this.proposalValidityFlag == true){
                this.showProposalValidityModal = true;
            }
            else if(this.proposalValidityFlag == false) {
                this.proposalCreateService.setProposalTab('BUDGET');
                this.router.navigate(['/proposal/proposalBudget'], { queryParams: { 'proposalId': this.proposalId, 'grantId': this.grantId }, queryParamsHandling: 'preserve'});
                /*if(this.mode == 'create'){
                    this.router.navigate(['/proposal/proposalBudget'], { queryParams: { 'proposalId': this.proposalId }, queryParamsHandling: 'preserve'});
                } else {
                    this.proposal_subscription = this.proposalCreateService.proposalObjectVariable.subscribe( proposalObject => {
                        var temp: any = {};
                        temp = proposalObject;
                        this.proposalObject = temp;
                    } );
                    this.router.navigate(['/proposal/proposalBudget'], { queryParams: { 'proposalId': this.proposalObject.proposalId }, queryParamsHandling: 'preserve'});
                }*/
                }
        }
    }

    
    openGoBackModal() {
        if( this.result.proposal.statusCode == 1) {
            this.showConfirmGoBack = true;
        } else {
            this.proposalCreateService.setProposalData({});
            this.router.navigate(['/dashboard'],{queryParams:{'currentTab':'SMU_PROPOSAL'}});
        }
    }
    
    backToList(e){
        e.preventDefault();
        this.proposalCreateService.setProposalData({});
        this.router.navigate(['/dashboard'], { queryParams: { 'currentTab': 'SMU_PROPOSAL' } } );
    }

    ngOnDestroy() {
        /*if(this.proposalTab_subscription) {
            this.proposalTab_subscription.unsubscribe();
        }
        if(this.proposalFlag_subscription) {
            this.proposalFlag_subscription.unsubscribe();
        }
        if(this.proposal_subscription) {
            this.proposal_subscription.unsubscribe();
        }*/
        /*this.proposalCreateService.setProposalVO({});
        this.proposalCreateService.setProposalData({});
        this.proposalCreateService.proposalVariable.subscribe( proposal => {
           var temp: any = {};
           temp = proposal;
           console.log(temp);
        });*/
    }
    
}
