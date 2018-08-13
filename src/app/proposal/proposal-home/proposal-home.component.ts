import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionManagementService } from "../../session/session-management.service";
import { Subject, Observable } from "rxjs";
import { ISubscription } from "rxjs/Subscription";
import { CompleterService, CompleterData } from "ng2-completer";
import { SlicePipe } from '@angular/common';
import { UploadFile, UploadEvent } from "ngx-file-drop";
import { CommitteeMemberEmployeeElasticService } from '../../elastic-search/committee-members-employees-elastic-search.service';
import { CommitteeMemberNonEmployeeElasticService } from '../../elastic-search/committee-members-nonEmployee-elastic-search.service';
import { FormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';
import * as _ from "lodash";

import { ProposalCreateEditService } from "../proposal-create-view.service";
import { GrantService } from "../../grant/grant.service";
import 'rxjs/Rx';

declare var $: any;

@Component({
  selector: 'proposal-home-component',
  templateUrl: './proposal-home.component.html',
  providers: [SessionManagementService, CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService],
  styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],

})
export class ProposalHomeComponent implements OnInit, AfterViewInit  {
    
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
    isFileSizeExceeded = false;
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
    validateArray: any =[];
    proposalDataValidityFlag: boolean = false;
    proposalObject: any;
    proposalVO: any = {};
    
    private proposal_subscription: ISubscription;
    private proposalFlag_subscription: ISubscription;
    
    public onDestroy$ = new Subject<void>();  
    
    constructor(public grantService: GrantService, public committeeMemberNonEmployeeElasticService: CommitteeMemberNonEmployeeElasticService, public committeeMemberEmployeeElasticService: CommitteeMemberEmployeeElasticService, public _ngZone: NgZone, public changeRef: ChangeDetectorRef, public route: ActivatedRoute, private router: Router, private sessionService: SessionManagementService, private proposalCreateService: ProposalCreateEditService, public completerService: CompleterService) {
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
        this.userName = localStorage.getItem('currentUser');
        this.keywordsList = [];
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.mode = this.route.snapshot.queryParamMap.get('mode');
        this.proposalId = this.route.snapshot.queryParamMap.get('proposalId');
        this.grantId = this.route.snapshot.queryParamMap.get('grantId');
        
        /*this.proposal_subscription = this.proposalCreateService.proposalVariable.subscribe( proposalVO => {*/
            this.proposalVO = this.proposalCreateService.getProposalVO();
            if(this.proposalVO.proposal == null) {
                if (this.proposalId == null) {
                    this.mode = 'create';
                    this.editClass = "committeeBox";
                    this.editAreaClass = "scheduleBoxes";
                    this.createProposalCall();
                  } else {
                      this.proposalCreateService.loadProposalById(this.proposalId, localStorage.getItem('personId'), localStorage.getItem('currentUser')).subscribe(success => {
                      this.result = success;
                      if ( this.result.proposal.proposalStatus.statusCode != 1 || this.result.proposal.proposalStatus.statusCode != 9 ){
                          this.mode = 'view';
                          this.proposalCreateService.setProposalVO(this.result);
                      }
                      this.proposalCreateService.setProposalData(this.result.proposal);
                      this.proposalCreateService.setBudgetData(this.result.costElements);
                      this.initialiseProposalFormElements();
                    });
                  }
            } else {
                this.result = this.proposalVO;
                this.initialiseProposalFormElements();
            }
        /*} );*/
        /*if(this.proposalObject.proposalId == null){*/
            
        /*} else {
            this.proposalId = this.proposalObject.proposalId;
            this.proposalCreateService.loadProposalById(this.proposalId, localStorage.getItem('personId'), localStorage.getItem('currentUser')).subscribe(success => {
                this.result = success;
                this.proposalCreateService.setResponseObject(this.result.proposal);
                this.initialiseProposalFormElements();
              });
        }*/
        
      }
        
    initialiseProposalFormElements() {
        if ( this.result.proposal.proposalStatus.statusCode == 1 || this.result.proposal.proposalStatus.statusCode == 9 ) {
            this.mode = 'edit';
            this.editClass = "committeeBox";
            this.editAreaClass = "scheduleBoxes";
            this.selectedAreaType = this.result.proposalResearchTypes[0].description;
            this.researchTypeSelected = this.result.proposalResearchTypes[0].description;
            this.selectedAttachmentType = this.select;
            //this.router.navigate( ['/proposal/editProposal'], { queryParams: { 'mode': this.mode, 'proposalId': this.result.proposal.proposalId } } );
        } else {
            this.mode = 'view';
            this.editClass = "committeeBoxNotEditable";
            this.editAreaClass = "scheduleBoxes";
            //this.router.navigate( ['/proposal/viewSubmittedProposal'], { queryParams: { 'mode': this.mode, 'proposalId': this.result.proposal.proposalId } } );
        }
        this.updateWorkflowStops();
        this.updateRouteLogHeader();

        // set default grantCallType to Others if no grant call is associated with the proposal
        if ( this.result.proposal.grantCallType == null ) {
            this.result.proposal.grantCallType = this.result.defaultGrantCallType;
            this.result.proposal.grantTypeCode = this.result.defaultGrantCallType.grantTypeCode;
        } else if (this.result.proposal.grantCall != null) {
            this.result.proposal.grantCallType = this.result.proposal.grantCall.grantCallType;
            this.result.proposal.grantTypeCode = this.result.proposal.grantCall.grantCallType.grantTypeCode;
        } else if ( this.result.proposal.grantCall == null ) {
            //do nothing
        }

        this.personRolesList = this.result.proposalPersonRoles;
        this.proposalTypeSelected = ( this.result.proposal.proposalType != null ) ? this.result.proposal.proposalType.description : this.select;
        this.proposalCategorySelected = ( this.result.proposal.activityType != null ) ? this.result.proposal.activityType.description : this.select;
        this.selectedICLLab = ( this.result.proposal.proposalInstituteCentreLab != null ) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
        this.personRoleSelected = this.select;
        this.budgetCategorySelected = this.select;
        this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
        this.grantCallList = this.completerService.local( this.result.grantCalls, 'grantCallName', 'grantCallName' );
        this.selectedSponsorType = this.select;
        this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
        this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
        this.areaList = this.completerService.local( this.result.proposalExcellenceAreas, 'description', 'description' );
        this.protocolsList = this.completerService.local( this.result.protocols, 'title', 'title' );
        this.homeUnits =  this.completerService.local( this.result.homeUnits, 'unitName', 'unitName' );

        this.selectedSponsorName = this.select;
        this.fundingStartDate = null;
        this.fundingEndDate = null;
        this.sponsorAmount = 0;

        this.budgetCost = 0;
        this.budgetDescription = "";
        this.costElementSelected = this.select;

        if ( this.result.proposal.isSmu == null ) {
            this.result.proposal.isSmu = false;
        }
    }

    updateWorkflowStops() {
        this.workflowStopOne = [];
        this.workflowStopTwo = [];
        if ( this.result.workflow != null && this.result.workflow.workflowDetails.length > 0 ) {
            this.result.workflow.workflowDetails.forEach(( value, index ) => {
                switch ( value.roleTypeCode ) {
                    case 1: this.workflowStopOne.push( value ); break;
                    case 2: this.workflowStopTwo.push( value ); break;
                }
            } );
            this.workflowStopOne.forEach(( value, index ) => {
                if ( value.workflowAttachments != null && value.workflowAttachments.length > 0 ) {
                    this.selectedAttachmentStopOne[index] = value.workflowAttachments[0].fileName;
                }
            } );
            this.workflowStopTwo.forEach(( value, index ) => {
                if ( value.workflowAttachments != null && value.workflowAttachments.length > 0 ) {
                    this.selectedAttachmentStopTwo[index] = value.workflowAttachments[0].fileName;
                }
                if ( value.workflowReviewerDetails != null && value.workflowReviewerDetails.length > 0 ) {
                    this.isRevExpanded[index] = true;
                    value.workflowReviewerDetails.forEach(( valueR, indexR ) => {
                        if ( valueR.workflowAttachments != null && valueR.workflowAttachments.length > 0 ) {
                            this.selectedAttachmentReviewer[indexR] = valueR.workflowAttachments[0].fileName;
                        }
                    } );
                }
            } );
        }
    }

    updateRouteLogHeader() {
        if ( this.result.proposal != null && this.result.proposal.proposalPersons.length > 0 ) {
            this.result.proposal.proposalPersons.forEach(( value, index ) => {
                if ( value.proposalPersonRole.code == "PI" ) {
                    this.proposalPIName = value.fullName;
                    this.proposalLeadUnit = value.leadUnitName;
                }
            } );
            if(this.result.proposal.proposalStatus.statusCode == 4) {
                this.finalStatus = 'The proposal is submitted to Grant Manager and will be forwarded to Vice Provost or endorsement';
            } else if(this.result.proposal.proposalStatus.statusCode == 10) {
              this.finalStatus = 'The proposal is waiting for endorsement by provost';
            } else if(this.result.proposal.proposalStatus.statusCode == 11) {
              this.finalStatus = 'The proposal is endorsed and now awarded';
            } else {
              this.finalStatus = null;
            }
        }
    }
    
    updateFlags( response: any ) {
        this.result.isApproved = response.isApproved;
        this.result.isApprover = response.isApprover;
        this.result.isGrantAdmin = response.isGrantAdmin;
        this.result.isGrantManager = response.isGrantManager;
        this.result.isProvost = response.isProvost;
        this.result.isReviewed = response.isReviewed;
        this.result.isReviewer = response.isReviewer;
    }

    createProposalCall() {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        if ( this.grantId != null ) {
            this.sendObject.grantCallId = this.grantId;

        } else {
            this.sendObject.grantCallId = null;
        }
        this.proposalCreateService.loadCreateProposalData( this.sendObject ).takeUntil( this.onDestroy$ ).subscribe( data => {
            this.result = data;
            this.proposalCreateService.setProposalVO(this.result);
            this.personRolesList = this.result.proposalPersonRoles;
            this.proposalTypeSelected = ( this.result.proposal.proposalType != null ) ? this.result.proposal.proposalType.description : this.select;
            this.proposalCategorySelected = ( this.result.proposal.activityType != null ) ? this.result.proposal.activityType.description : this.select;
            this.selectedICLLab = ( this.result.proposal.proposalInstituteCentreLab != null ) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
            /*To set start date today, end date tomorrow, submission date today for default
            if ( this.result.proposal.startDate == null ) {
                this.result.proposal.startDate = today;
            }
            if ( this.result.proposal.submissionDate == null ) {
                this.result.proposal.submissionDate = today;
            }
            if ( this.result.proposal.endDate == null ) {
                this.result.proposal.endDate = tomorrow;
            }*/
            this.personRoleSelected = this.select;
            this.budgetCategorySelected = this.select;
            this.selectedAreaType = this.result.proposalResearchTypes[0].description;
            this.researchTypeSelected = this.result.proposalResearchTypes[0].description;
            this.selectedAttachmentType = this.select;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' );
            this.grantCallList = this.completerService.local( this.result.grantCalls, 'grantCallName', 'grantCallName' );
            this.homeUnits =  this.completerService.local( this.result.homeUnits, 'unitName', 'unitName' )
            this.selectedSponsorType = this.select;

            // set default grantCallType to Others if no grant call is associated with the proposal
            if ( this.result.proposal.grantCall == null ) {
                this.result.proposal.grantCallType = this.result.defaultGrantCallType;
                this.result.proposal.grantTypeCode = this.result.defaultGrantCallType.grantTypeCode;
            } else {
                this.result.proposal.grantCallType = this.result.proposal.grantCall.grantCallType;
                this.result.proposal.grantTypeCode = this.result.proposal.grantCall.grantCallType.grantTypeCode;
            }

            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
            this.areaList = this.completerService.local( this.result.proposalExcellenceAreas, 'description', 'description' );
            this.protocolsList = this.completerService.local( this.result.protocols, 'title', 'title' );

            this.selectedSponsorName = this.select;
            this.fundingStartDate = null;
            this.fundingEndDate = null;
            this.sponsorAmount = 0;

            this.budgetCost = 0;
            this.budgetDescription = "";
            this.costElementSelected = this.select;
        } );
    }

    ngAfterViewInit() {
        this.searchText
            .valueChanges
            .map(( text: any ) => text ? text.trim() : '' )
            .do( searchString => searchString ? this.message = 'searching...' : this.message = '' )
            .debounceTime( 500 )
            .distinctUntilChanged()
            .switchMap( searchString => {
                return new Promise<Array<String>>(( resolve, reject ) => {
                    if ( this.nonEmployeeFlag == false ) {

                        this._ngZone.runOutsideAngular(() => {
                            this.committeeMemberEmployeeElasticService.search( searchString )
                                .then(( searchResult ) => {
                                    this.elasticSearchresults = [];
                                    this._ngZone.run(() => {
                                        this.hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );

                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.prncpl_id = this.hits_source[j].prncpl_id;
                                            this.full_name = this.hits_source[j].full_name;
                                            this.elasticSearchresults.push( {
                                                label: this.full_name,
                                                id: this.prncpl_id,
                                                data: this.hits_source[j]
                                            } );
                                        } );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                            this.message = '';
                                        } else if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                            this.message = '';
                                        }
                                        resolve( this.elasticSearchresults );
                                    } );

                                } )
                                .catch(( error ) => {
                                } );
                        } );
                    }
                    if ( this.nonEmployeeFlag == true ) {
                        this._ngZone.runOutsideAngular(() => {
                            this.committeeMemberNonEmployeeElasticService.search( searchString )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {
                                        this.hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.rolodexId = this.hits_source[j].rolodex_id;
                                            this.first_name = (this.hits_source[j].first_name == null)? '':this.hits_source[j].first_name;
                                            this.middle_name = (this.hits_source[j].middle_name == null)?'': this.hits_source[j].middle_name;
                                            this.last_name = (this.hits_source[j].last_name == null)?'':this.hits_source[j].last_name;
                                            if(this.hits_source[j].first_name == null && this.hits_source[j].middle_name == null && this.hits_source[j].last_name == null) {
                                               
                                            } else {
                                                this.elasticSearchresults.push( {
                                                    label: this.first_name + '  ' + this.middle_name
                                                    + '  ' + this.last_name,
                                                    id: this.rolodexId,
                                                    data: this.hits_source[j]
                                                } );
                                            }
                                        } );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                            this.message = '';
                                        } else if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                            this.message = '';
                                        }
                                        resolve( this.elasticSearchresults );
                                    } );

                                } )
                                .catch(( error ) => {
                                } );
                        } );
                    }
                } );
            } )
            .catch( this.handleError )
            .takeUntil( this.onDestroy$ ).subscribe( this._results );
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

    selected( value ) {
        this.searchTextModel = value.label;
        this.selectedMember = value.data;
        this.message = '';
    }

    //elastic search value change
    onSearchValueChange() {
        this.iconClass = this.searchTextModel ? 'fa fa-times fa-med' : 'fa fa-search fa-med';
        this.elasticSearchresults = [];
    }

    clearSearchBox( e ) {
        e.preventDefault();
        this.searchTextModel = '';
        this.selectedMember = null;
    }

    memberTypeChanged() {
        if ( this.memberTypeSelected == 'Employee' ) {
            this.nonEmployeeFlag = false;
            this.searchTextModel = '';
            this.placeHolderText = 'Search an employee';
        } else {
            this.nonEmployeeFlag = true;
            this.searchTextModel = '';
            this.placeHolderText = 'Search a non-employee';
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    toggleICL( flag ) {
        this.result.proposal.isSmu = flag;
        if ( flag == false ) {
            this.selectedICLLab = this.select;
            this.result.proposal.proposalInstituteCentreLab = null;
        } else {
            this.selectedICLLab = ( this.result.proposal.proposalInstituteCentreLab != null ) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
        }
    }

    changeArea( areaType ) {
        this.selectedArea = "";
        this.selectedAreaType = areaType;
        if ( this.selectedAreaType == 'Area of Excellence' ) {
            this.areaList = this.completerService.local( this.result.proposalExcellenceAreas, 'description', 'description' );
        } else {
            this.areaList = this.completerService.local( this.result.researchAreas, 'description', 'description' );
        }
    }

    differenceBetweenDates( startDate, endDate ) {
        var diffInMs = Math.round( Date.parse( endDate ) - Date.parse( startDate ) );
        // diffInMs = Math.round(1523507183000); static data for testing
        var difference = Math.floor( diffInMs / 1000 / 60 / 60 / 24 | 0 );
        this.durInYears = Math.floor( difference / 365 | 0 );
        difference = Math.floor( difference % 365 | 0 )
        this.durInMonths = Math.floor( difference / 31 | 0 );
        this.durInDays = Math.floor( difference % 31 | 0 );
    }

    dateValidation() {
        if(this.result.proposal.submissionDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = '* Please select a submission date';
        } else if ( this.result.proposal.submissionDate < this.currentDate ) {
            this.isDateWarningText = true;
            this.dateWarningText = '* Please select a submission date from today';
        } else if ( this.result.proposal.startDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = '* Please select a start date';
        } 
        // else if ( this.result.proposal.startDate < this.currentDate ) {
        //     this.isDateWarningText = true;
        //     this.dateWarningText = '* Please select a start date from today';
        // } 
        else if ( this.result.proposal.startDate != null && this.result.proposal.endDate != null && this.result.proposal.startDate <= this.result.proposal.endDate ) {
            this.isDateWarningText = false;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            /*if ( this.result.proposal.submissionDate != null && ( this.result.proposal.startDate > this.result.proposal.submissionDate || this.result.proposal.submissionDate > this.result.proposal.endDate ) ) {
                this.isDateWarningText = true;
                this.dateWarningText = '* Please choose a submission date between proposal start date and proposal end date';
            }*/
        } else if ( this.result.proposal.endDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = '* Please select an end date';
        } else if ( this.result.proposal.startDate > this.result.proposal.endDate ) {
            this.isDateWarningText = true;
            this.dateWarningText = '* Please select an end date after start date';
        } else if ( this.result.proposal.startDate != null && this.result.proposal.endDate != null && this.result.proposal.startDate <= this.result.proposal.endDate ) {
            this.isDateWarningText = false;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            /*if ( this.result.proposal.submissionDate != null && ( this.result.proposal.startDate > this.result.proposal.submissionDate || this.result.proposal.submissionDate > this.result.proposal.endDate ) ) {
                this.isDateWarningText = true;
                this.dateWarningText = '* Please choose a submission date between proposal start date and proposal end date';
            }*/
        } else {
            this.isDateWarningText = false;
        }
    }

    deleteKeyword( keyword, k ) {
        this.isKeywordWarning = false;
        var length = this.result.proposal.proposalKeywords.length;
        for ( let i = 0; i < length; ++i ) {
            if ( this.result.proposal.proposalKeywords[i].scienceKeywordCode == keyword.scienceKeywordCode ) {
                if ( this.result.proposal.proposalKeywords[i].keywordId != null ) {
                    this.proposalCreateService.deleteProposalKeyword( this.result.proposal.proposalId, keyword.keywordId ).subscribe( success => {
                        var temp: any = {};
                        temp = success;
                        this.result.proposal.proposalKeywords.splice( k, 1 );
                    } );
                } else {
                    this.result.proposal.proposalKeywords.splice( k, 1 );
                }
            }
        }
        this.selectedKeyword = '';
    }

    keywordChangeFunction() {
        var d = new Date();
        var timeStamp = d.getTime();
        var keywordFlag = false;
        this.keywordObject = {};
        if ( this.result.proposal.proposalKeywords.length != 0 ) {
            for ( let word of this.result.proposal.proposalKeywords ) {
                if ( word.scienceKeyword.description == this.selectedKeyword ) {
                    keywordFlag = true;
                    this.isKeywordWarning = true;
                    this.keywordWarningText = "* Keyword already added";
                    break;
                }
            }
        }
        if ( keywordFlag == false ) {
            for ( let keyword of this.result.scienceKeywords ) {
                if ( keyword.description == this.selectedKeyword ) {
                    this.keywordObject.scienceKeyword = keyword;
                    this.keywordObject.scienceKeywordCode = keyword.code;
                    this.keywordObject.updateTimeStamp = timeStamp;
                    this.keywordObject.updateUser = this.currentUser;
                    this.result.proposal.proposalKeywords.push( this.keywordObject );
                    this.isKeywordWarning = false;
                    this.keywordWarningText = null;
                    break;
                }
            }
        } else {
            this.isKeywordWarning = true;
            this.keywordWarningText = "* Keyword already added";
        }
        this.selectedKeyword = null;
    }

    grantCallChangeFunction() {
        var d = new Date();
        var timeStamp = d.getTime();
        for ( let grant of this.result.grantCalls ) {
            if ( grant.grantCallName == this.selectedGrantCall ) {
                this.result.proposal.grantCall = grant;
                this.result.proposal.grantCallId = grant.grantCallId;
                this.result.proposal.grantCallType = grant.grantCallType;
                this.result.proposal.grantCall.updateTimeStamp = timeStamp;
                this.result.proposal.grantCall.updateUser = this.currentUser;
            }
        }
        this.changeRef.detectChanges();
        this.selectedGrantCall = null;
    }

    removeSelectedGrant( e ) {
        e.preventDefault();
        this.result.proposal.grantCall = null;
        this.result.proposal.grantCallType = this.result.defaultGrantCallType;
        this.selectedGrantCall = null;
    }

    addProposalTeamMember() {
        var personFlag = false;
        if ( this.selectedMember != null && this.personRoleSelected != this.select ) {
            var tempObj: any = {};
            if ( !this.nonEmployeeFlag ) {
                tempObj.personId = this.selectedMember.prncpl_id;
                tempObj.fullName = this.selectedMember.full_name;
                tempObj.leadUnitNumber = this.selectedMember.unit_number;
                tempObj.leadUnitName = this.selectedMember.unit_name;
            } else {
                this.selectedMember.first_name = (this.selectedMember.first_name == null)? '':this.selectedMember.first_name;
                this.selectedMember.middle_name = (this.selectedMember.middle_name == null)?'': this.selectedMember.middle_name;
                this.selectedMember.last_name = (this.selectedMember.last_name == null)?'':this.selectedMember.last_name;
                tempObj.rolodexId = this.selectedMember.rolodex_id;
                tempObj.fullName = this.selectedMember.last_name + ' , ' + this.selectedMember.middle_name + ' ' + this.selectedMember.first_name;
                tempObj.leadUnitNumber = null;
                tempObj.leadUnitName = this.selectedMember.organization;
            }
            tempObj.department = this.selectedHomeUnit;

            this.personRolesList.forEach(( value, index ) => {
                if ( value.description == this.personRoleSelected ) {
                    tempObj.proposalPersonRole = value;
                    tempObj.personRoleId = value.id;
                }
            } );

            if ( this.result.proposal.proposalPersons.length != 0 ) {
                for ( let person of this.result.proposal.proposalPersons ) {
                    if(person.proposalPersonRole.description == "Principal Investigator" && tempObj.proposalPersonRole.description == "Principal Investigator") {
                        personFlag = true;
                        this.personWarningFlag = true;
                        this.personWarningMsg = 'You have already added a Principal Investigator';
                        this.selectedMember = null;
                        this.searchTextModel = "";
                        break;
                    }
                    if ( person.fullName == tempObj.fullName ) {
                        personFlag = true;
                        this.personWarningFlag = true;
                        this.personWarningMsg = 'You have already added ' + tempObj.fullName;
                        this.selectedMember = null;
                        this.searchTextModel = "";
                        break;
                    } 
                }
            }

            if ( personFlag == false ) {
                tempObj.updateTimeStamp = ( new Date() ).getTime();
                tempObj.updateUser = this.currentUser;
                if ( this.result.proposal.proposalPersons == null ) {
                    this.result.proposal.proposalPersons = [];
                }
                this.result.proposal.proposalPersons.push( tempObj );

                this.selectedMember = null;
                this.memberTypeSelected = 'Employee';
                this.memberTypeChanged();
                this.personRoleSelected = this.select;
                this.selectedHomeUnit = null;

                this.personWarningFlag = false;
                this.personWarningMsg = null;
            } else {
                // this.personWarningFlag = true;
                // this.personWarningMsg = 'You have already added ' + tempObj.fullName;
                // this.selectedMember = null;
            }

        } else if ( this.personRoleSelected == this.select ) {
            this.personWarningFlag = true;
            this.personWarningMsg = '* Please choose a role';
        } else {
            this.personWarningFlag = true;
            this.personWarningMsg = 'Please choose name of a member';
        }
    }

    tempSavePerson( $event, person, i ) {
        $event.preventDefault();
        this.showDeleteMember = true;
        this.tempSavePersonObject = person;
        this.index = i;
    }

    deletePerson() {
        this.showDeleteMember = false;
        if ( this.tempSavePersonObject.proposalPersonId == null ) {
            this.result.proposal.proposalPersons.splice( this.index, 1 );
            if(this.result.proposal.proposalPersons.length == 0){
                this.proposalCreateService.setProposalValidityFlag(true);
            }
        } else {
            this.proposalCreateService.deleteProposalPerson( this.result.proposal.proposalId, this.tempSavePersonObject.proposalPersonId ).subscribe( success => {
                var temp = success;
                this.result.proposal.proposalPersons.splice( this.index, 1 );
                if(this.result.proposal.proposalPersons.length == 0){
                    this.proposalCreateService.setProposalValidityFlag(true);
                }
                this.changeRef.detectChanges();
            } );
        }
        this.memberTypeSelected = 'Employee';
        this.memberTypeChanged();
    }

    budgetCategoryChanged() {
        var budgetCategoryCode = '';
        this.result.proposalBudgetCategories.forEach(( value, index ) => {
            if ( value.description == this.budgetCategorySelected ) {
                budgetCategoryCode = value.budgetCategoryCode;
            }
        } );
        this.proposalCreateService.fetchCostElementData( budgetCategoryCode ).subscribe( success => {
            var temp: any = {};
            temp = success;
            this.result.proposalCostElements = temp.proposalCostElements;
            this.costElementSelected = this.select;
            this.changeRef.detectChanges();
        } );
    }

    addBudget() {
        if ( this.budgetCost != null && this.budgetCategorySelected != this.select && this.costElementSelected != this.select ) {
            this.budgetWarningFlag = false;
            var tempObj: any = {};
            this.result.proposalBudgetCategories.forEach(( value, index ) => {
                if ( value.description == this.budgetCategorySelected ) {
                    tempObj.budgetCategoryCode = value.budgetCategoryCode;
                    tempObj.budgetCategory = value;
                }
            } );
            this.result.proposalCostElements.forEach(( value, index ) => {
                if ( value.description == this.costElementSelected ) {
                    tempObj.costElement = value.costElement;
                    tempObj.proposalCostElement = value;
                }
            } );
            tempObj.cost = this.budgetCost;
            tempObj.description = this.budgetDescription;
            tempObj.updateTimeStamp = ( new Date() ).getTime();
            tempObj.updateUser = this.currentUser;
            this.result.proposal.proposalBudgets.push( tempObj );

            this.budgetDescription = "";
            this.budgetCost = null;
            this.costElementSelected = this.select;
            this.budgetCategorySelected = this.select;
        } else if ( this.budgetCategorySelected == this.select ) {
            this.budgetWarningFlag = true;
            this.budgetWarningMsg = '* Please choose budget category';
        } else if ( this.costElementSelected == this.select ) {
            this.budgetWarningFlag = true;
            this.budgetWarningMsg = '* Please choose a cost element';
        } else {
            this.budgetWarningFlag = true;
            this.budgetWarningMsg = 'Please enter budget cost';
        }
    }

    deleteBudgetConfirmation( e, budget, i ) {
        e.preventDefault();
        this.index = i;
        this.tempBudgetObject = budget;
        this.showDeleteBudget = true;
    }

    deleteBudget() {
        this.showDeleteBudget = false;
        if ( this.tempBudgetObject.budgetId == null ) {
            this.result.proposal.proposalBudgets.splice( this.index, 1 );
        } else {
            this.proposalCreateService.deleteBudget( this.result.proposal.proposalId, this.tempBudgetObject.budgetId ).subscribe( success => {
                var temp = success;
                this.result.proposal.proposalBudgets.splice( this.index, 1 );
                this.changeRef.detectChanges();
            } );
        }
    }


    addAttachments() {
		this.isFileSizeExceeded = false;								
        this.ismandatoryFilled = true;
        this.duplicateAttachmentMsg = false;
        this.noAttachmentSelectedMsg = false;
        var d = new Date();
        var timestamp = d.getTime();
        if(this.selectedAttachmentType == this.select) {
           this.ismandatoryFilled = false;
        } else if(this.uploadedFile.length == 0){
            this.noAttachmentSelectedMsg = true;
        }
        
        if(this.ismandatoryFilled == true && this.noAttachmentSelectedMsg == false){
            for ( let attachmentType of this.result.proposalAttachmentTypes ) {
                if ( attachmentType.description == this.selectedAttachmentType ) {
                    this.attachmentObject = attachmentType;
                }
            }
            var tempObjectForAdd: any = {};
            tempObjectForAdd.attachmentType = this.attachmentObject;
            tempObjectForAdd.attachmentTypeCode = this.attachmentObject.attachmentTypeCode;
            tempObjectForAdd.description = this.attachmentDescription;
            tempObjectForAdd.updateTimeStamp = timestamp;
            tempObjectForAdd.updateUser = this.currentUser;
            this.result.newAttachment = tempObjectForAdd;
            label: for(let attachment of this.result.proposal.proposalAttachments) {
                for(let file of this.uploadedFile) {
                    if(attachment.fileName == file.name) {
                    this.duplicateAttachmentMsg = true; break label;
                    }
                }
              
            }
             if(this.duplicateAttachmentMsg == false) {
                this.checkAttachmentSize();
                if( !this.isFileSizeExceeded) {
                    this.proposalCreateService.addProposalAttachment( this.result.proposal, this.result.newAttachment, this.uploadedFile ).subscribe( success => {
                    var temporaryObject: any = {};
                    temporaryObject = success;
                    this.result.proposal = temporaryObject.proposal;
                }, error => { console.log( error ) }, () => {
                    this.closeAttachments();
                } );
                }
            } else {
                this.duplicateAttachmentMsg = true;
            }
         
        }
    }

	checkAttachmentSize() {
        for ( var i = 0; i < this.uploadedFile.length; i++ ) {
            if (this.uploadedFile[i].size > 19591292) {
                this.isFileSizeExceeded = true;
            }
       }
    }										 
    showAddAttachmentPopUp( e ) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.uploadedFile = [];
        this.attachmentDescription = '';
        this.selectedAttachmentType = this.select;
        this.noAttachmentSelectedMsg = false;
        this.ismandatoryFilled = true;
		this.isFileSizeExceeded = false;								
        this.duplicateAttachmentMsg = false;
    }

    tempSaveAttachments( e, attachments, i ) {
        this.tempSaveAttachment = attachments;
        this.index = i;
        this.showDeleteAttachment = true;
    }

    onChange( files: FileList ) {
        this.file = files;
        this.ismandatoryFilled = true;
		this.isFileSizeExceeded = false;								
        for ( var i = 0; i < this.file.length; i++ ) {
            this.uploadedFile.push( this.file[i] );
        }
    }

    public dropped( event: UploadEvent ) {
        this.files = event.files;
        this.ismandatoryFilled = true;
		this.isFileSizeExceeded = false;								
        for ( const file of event.files ) {
            file.fileEntry.file( info => {
                this.uploadedFile.push( info );
                this.changeRef.detectChanges();
            } );
        }
    }

    //delete file function
    deleteFromUploadedFileList( item ) {
		this.isFileSizeExceeded = false;								
        for ( var i = 0; i < this.uploadedFile.length; i++ ) {
            if ( this.uploadedFile[i].name == item.name ) {
                this.uploadedFile.splice( i, 1 );
                this.changeRef.detectChanges();
            }
        }
		this.checkAttachmentSize();						   
    }

    closeAttachments() {
        this.showAddAttachment = false;
        this.approveComments = "";
        this.uploadedFile = [];
    }
    ////// Methods by Ashik Varma ends for Attachments

    deleteAttachments( e ) {
        e.preventDefault();
        this.showDeleteAttachment = false;
        if ( this.tempSaveAttachment.attachmentId == null ) {
            this.result.proposal.proposalAttachments.splice( this.index, 1 );
        } else {

            this.proposalCreateService.deleteProposalAttachment( this.result.proposal.proposalId, this.tempSaveAttachment.attachmentId ).subscribe( success => {
                var temp: any = {};
                temp = success;
                this.result.proposal.proposalAttachments.splice( this.index, 1 );
                this.changeRef.detectChanges();
            } );
        }
    }

    downloadAttachments( event, attachment ) {
        event.preventDefault();
        if ( attachment.attachmentId != null ) {
            this.proposalCreateService.downloadProposalAttachment( attachment.attachmentId ).takeUntil( this.onDestroy$ ).subscribe(
                data => {
                    var a = document.createElement( "a" );
                    a.href = URL.createObjectURL( data );
                    a.download = attachment.fileName;
                    a.click();
                } );
        } else {
            var url = "data:" + attachment.mimeType + ";base64," + attachment.attachment;
            var a = document.createElement( "a" );
            a.href = url;
            a.download = attachment.fileName;
            a.click();
        }
    }

    addArea() {
        var d = new Date();
        var timeStamp = d.getTime();
        var list: any[] = [];
        var areaFlag = false;

        if ( this.selectedArea == null || this.selectedArea == "" ) {
            this.isAreaWarning = true;
            //this.areaWarningText = '* Select an area of research/excellence';
            this.proposalCreateService.setProposalValidityFlag(true);
        } else {
            this.areaWarningText = null;
            this.isAreaWarning = false;
            if ( this.result.proposal.proposalResearchAreas.length != 0 && this.selectedAreaType == 'Area of Excellence' ) {
                for ( let area of this.result.proposal.proposalResearchAreas ) {
                    if ( area.proposalExcellenceArea != undefined && area.proposalExcellenceArea.description == this.selectedArea ) {
                        areaFlag = true;
                        this.isAreaWarning = true;
                        this.areaWarningText = 'Area already added';
                        break;
                    }
                }
            } else if ( this.result.proposal.proposalResearchAreas.length != 0 && this.selectedAreaType == 'Area of Research' ) {
                for ( let area of this.result.proposal.proposalResearchAreas ) {
                    if ( area.researchArea != undefined && area.researchArea.description == this.selectedArea ) {
                        areaFlag = true;
                        this.isAreaWarning = true;
                        this.areaWarningText = 'Area already added';
                        break;
                    }
                }
            }
            if ( areaFlag == false ) {
                if ( this.selectedAreaType == 'Area of Excellence' ) {
                    for ( let excellence of this.result.proposalExcellenceAreas ) {
                        if ( excellence.description == this.selectedArea ) {
                            var tempObj: any = {};
                            tempObj.researchTypeCode = this.result.proposalResearchTypes[0].researchTypeCode;
                            tempObj.proposalResearchType = this.result.proposalResearchTypes[0];

                            tempObj.excellenceAreaCode = excellence.excellenceAreaCode;
                            tempObj.proposalExcellenceArea = excellence;
                            tempObj.updateTimeStamp = timeStamp;
                            tempObj.updateUser = this.currentUser;
                            this.result.proposal.proposalResearchAreas.push( tempObj );
                            this.isAreaWarning = false;
                            this.areaWarningText = null;
                        }
                    }
                } else {
                    for ( let researchArea of this.result.researchAreas ) {
                        if ( researchArea.description == this.selectedArea ) {
                            var tempObj: any = {};
                            tempObj.researchTypeCode = this.result.proposalResearchTypes[1].researchTypeCode;
                            tempObj.proposalResearchType = this.result.proposalResearchTypes[1];

                            tempObj.researchAreaCode = researchArea.researchAreaCode;
                            tempObj.researchArea = researchArea;
                            tempObj.updateTimeStamp = timeStamp;
                            tempObj.updateUser = this.currentUser;
                            this.result.proposal.proposalResearchAreas.push( tempObj );
                            
                            this.isAreaWarning = false;
                            this.areaWarningText = null;
                        }
                    }
                }
            } else {
                this.isAreaWarning = true;
                this.areaWarningText = 'Area already added';
            }
        }
        this.selectedArea = "";
    }

    saveProposal(saveType) {
        var type = ( this.result.proposal.proposalId != null ) ? "UPDATE" : "SAVE";
        if(this.result.proposal.proposalId == null && saveType=='partialSave'){
            this.showSaveProposalModal = true;
            this.isMandatory = true;
        }
        // proposal details validation
        if ( this.result.proposal.title == "" || this.result.proposal.title == null ) {
            this.isMandatory = true;
            //this.mandatoryText = '* Please enter a title';
        } else if ( this.proposalCategorySelected == this.select ) {
            this.isMandatory = true;
            //this.mandatoryText = '* Please choose a category';
        } else if ( this.proposalTypeSelected == this.select ) {
            this.isMandatory = true;
            //this.mandatoryText = '* Please choose proposal type';
        } else if ( this.result.proposal.isSmu == true && this.selectedICLLab == this.select ) {
            this.isMandatory = true;
            //this.mandatoryText = '* Please specify the ICL Lab';
		} else if ( this.result.proposal.homeUnitName == "" || this.result.proposal.homeUnitName == null) {
		    this.isMandatory = true;
        } else {						   
            this.isMandatory = false;
            this.dateValidation();
        }
        // AOR validation
        if ( this.result.proposal.proposalResearchAreas.length > 0 ) {
            this.areaWarningText = null;
            this.isAreaWarning = false;
        } else {
            this.isAreaWarning = true;
            //this.areaWarningText = '* Select an area of research/excellence'
        }
        var flag = false;
        if ( this.result.proposal.proposalPersons.length > 0 ) {
            this.result.proposal.proposalPersons.forEach(( value, index ) => {
                if ( value.proposalPersonRole.description == 'Principal Investigator' ) {
                    flag = true;
                }
            } );
            if ( flag == false ) {
                this.personWarningMsg = '* Select a member as PI';
                this.personWarningFlag = true;
            } else {
                this.personWarningMsg = null;
                this.personWarningFlag = false;
            }
        } else {
            this.personWarningFlag = true;
            this.personWarningMsg = '* Select atleast one team member';
        }
        //this.showAddedModal = true;
        if ( !this.isMandatory && !this.isDateWarningText && !this.isAreaWarning && !this.personWarningFlag && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0 ) {
          //if(this.showSaveProposalModal == true && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0 ){
            this.result.proposal.createUser = this.currentUser;
            this.result.proposal.createTimeStamp = new Date().getTime();
            this.result.proposal.updateUser = this.currentUser;
            this.result.proposal.updateTimeStamp = new Date().getTime();
            this.showSaveProposalModal = true;
            this.isMandatory = false;
            this.proposalCreateService.saveProposal( this.result.proposal, type ).subscribe( data => {
                var temp: any = data;
                this.result.proposal = temp.proposal;
                this.proposalCreateService.setProposalData(this.result.proposal);
                this.proposalCreateService.setProposalValidityFlag(false);
                this.proposalCreateService.setProposalVO(this.result);
            }, 
            err  => {},
            () => {

                if(saveType == 'partialSave'){
                    this.router.navigate(['/proposal/proposalBudget'],
                            { queryParams: { 'proposalId': this.result.proposal.proposalId }});  
                } else {     
                    this.routeToBudget();
                }
            } );
        } else {
            this.showSaveProposalModal = true;
            this.isMandatory = true;
        }
    }

    closeSaveModal() {
        this.showSaveProposalModal = false;
        this.isMandatory = false;
    }

    routeToBudget() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              proposalId: this.result.proposal.proposalId
            },
            queryParamsHandling: 'merge', 
            skipLocationChange: true
          });
    }

    submitProposal() {
        this.showSubmitSuccessfullyModal = false;
        this.showSubmittedModal = false;
        if ( this.result.proposal.title == "" || this.result.proposal.title == null ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please enter a title';
        } else if ( this.proposalCategorySelected == this.select ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose a category';
        } else if ( this.proposalTypeSelected == this.select ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose proposal type';
        } else if ( this.result.proposal.isSmu == true && this.selectedICLLab == this.select ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please specify the ICL Lab';
        }  else {
            this.isMandatory = false;
            this.dateValidation();
        }
        // AOR validation
        if ( this.result.proposal.proposalResearchAreas.length > 0 ) {
            this.areaWarningText = null;
            this.isAreaWarning = false;
        } else {
            this.isAreaWarning = true;
            this.areaWarningText = '* Select an area of research/excellence'
        }
        // Project members validation
        var flag = false;
        if ( this.result.proposal.proposalPersons.length > 0 ) {
            this.result.proposal.proposalPersons.forEach(( value, index ) => {
                if ( value.proposalPersonRole.description == 'Principal Investigator' ) {
                    flag = true;
                }
            } );
            if ( flag == false ) {
                this.personWarningMsg = '* Select a member as PI';
                this.personWarningFlag = true;
            } else {
                this.personWarningMsg = null;
                this.personWarningFlag = false;
            }
        } else {
            this.personWarningFlag = true;
            this.personWarningMsg = '* Select atleast one team member';
        } //commented for removing individual validation
        //this.showSubmittedModal = true;
        if ( !this.isMandatory && !this.isDateWarningText && !this.isAreaWarning && !this.personWarningFlag && !this.isFundingWarning && !this.isIRBWarning && !this.budgetWarningFlag && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0 ) {
            this.mode = 'view';
            if ( this.result.proposal.statusCode == 9 ) {
                this.result.proposalStatusCode = 9;
            } else {
                this.result.proposalStatusCode = 2; // proposal status is set to Approval In Progress
            }
            this.result.proposal.updateTimeStamp = new Date().getTime();
            this.result.proposal.updateUser = this.currentUser;
            //this.showAddedModal = false;
            this.showSubmitSuccessfullyModal = true;
            this.proposalCreateService.submitProposal( this.result.proposal, localStorage.getItem( 'currentUser' ), this.result.proposalStatusCode ).subscribe( data => {
                var temp: any = data;
                this.result.proposal = temp.proposal;
                this.result.workflow = temp.workflow;
                this.updateWorkflowStops();
                this.updateRouteLogHeader();
                this.proposalCreateService.setProposalData(this.result.proposal);
                this.proposalCreateService.setProposalVO(this.result);
                this.showSuccessMessage = true;
                /*this.successMessage = 'Proposal submitted successfully';
                setTimeout(() => {
                    this.showSuccessMessage = false;
                }, 8000);
                window.scrollTo( 0, 0 );*/
                //this.isProposalSubmitted = true;
                var url = window.location.href;
                if(url.indexOf('viewSubmittedProposal') !== -1) {
                    this.ngOnInit();
                } else {
                    this.proposalCreateService.loadProposalById( this.result.proposal.proposalId, localStorage.getItem( 'personId' ), localStorage.getItem( 'currentUser' ) ).subscribe( success => {
                        var temp: any = {};
                        temp = success;
                        this.result.proposal = temp.proposal;
                        this.updateFlags(temp);
                        this.proposalCreateService.setProposalVO( this.result );
                        this.proposalCreateService.setProposalData( this.result.proposal );
                        this.proposalCreateService.setBudgetData( this.result.costElements );
                        this.initialiseProposalFormElements();
                    } );
                    this.router.navigate( ['/proposal/viewSubmittedProposal'], { queryParams: { 'mode': this.mode, 'proposalId': this.result.proposal.proposalId } } );
                }
            } );
        } else {
                this.showSuccessMessage = true;
                /*  this.successMessage = 'Error in saving proposal, please review whether mandatory fields are filled';
                setTimeout(() => {
                    this.showSuccessMessage = false;
                }, 8000);
                window.scrollTo( 0, 0 );*/
            //this.isProposalSubmitted = false;
        }
    }

    deleteArea() {
        if ( this.tempAreaObject.researchAreaId != null ) {
            //serviceCall
            this.proposalCreateService.deleteProposalResearchArea( this.result.proposal.proposalId, this.tempAreaObject.researchAreaId ).subscribe();
        }
        this.result.proposal.proposalResearchAreas.splice( this.index, 1 );
        if(this.result.proposal.proposalResearchAreas.length == 0) {
            this.result.proposal.researchDescription = "";
            this.proposalCreateService.setProposalValidityFlag(true);
        }
    }

    tempSaveArea( e, area, i ) {
        this.showDeleteResearchArea = true;
        e.preventDefault();
        this.tempAreaObject = area;
        this.index = i;
    }

    addIRB() {
        var tempObj: any = {};
        var irbFlag = false;
        if ( this.selectedProtocol == null || this.selectedProtocol == '' ) {
            this.isIRBWarning = true;
            this.irbWarningText = "Please choose a protocol";
        } else {
            if ( this.result.proposal.proposalIrbProtocols.length != 0 ) {
                for ( let protocol of this.result.proposal.proposalIrbProtocols ) {
                    if ( protocol.protocol.title == this.selectedProtocol ) {
                        irbFlag = true;
                        this.isIRBWarning = true;
                        this.irbWarningText = "Protocol already added";
                        break;
                    }
                }
            }
            if ( irbFlag == false ) {
                for ( let protocol of this.result.protocols ) {
                    if ( protocol.title == this.selectedProtocol ) {
                        tempObj.protocolId = protocol.protocolId;
                        tempObj.protocol = protocol;
                        tempObj.updateTimeStamp = ( new Date() ).getTime();
                        tempObj.updateUser = localStorage.getItem( 'currentUser' );
                        this.result.proposal.proposalIrbProtocols.push( tempObj );
                        break;
                    }
                }
                this.isIRBWarning = false;
                this.irbWarningText = null;
            } else {
                this.isIRBWarning = true;
                this.irbWarningText = "Protocol already added";
            }
            this.selectedProtocol = null;
        }
    }

    tempSaveIRB( e, irb ) {
        e.preventDefault();
        this.showDeleteIRB = true;
        this.tempSaveIRBObject = irb;
    }

    deleteIRB() {
        if ( this.tempSaveIRBObject.irbProtocolId != null ) {
            this.proposalCreateService.deleteIrbProtocol( this.result.proposal.proposalId, this.tempSaveIRBObject.irbProtocolId ).subscribe( data => { } );
            this.result.proposal.proposalIrbProtocols.splice( this.index, 1 );
        } else {
            this.result.proposal.proposalIrbProtocols.splice( this.index, 1 );
        }
    }

    sponsorTypeChange() {
        if ( this.selectedSponsorType != this.select ) {
            for ( let type of this.result.sponsorTypes ) {
                if ( type.description == this.selectedSponsorType ) {
                    this.grantService.fetchSponsorsBySponsorType( type.code ).subscribe( data => {
                        var temp: any = {};
                        temp = data;
                        this.result.sponsors = temp.sponsors;
                        this.selectedSponsorName = this.select;
                    } );
                    break;
                }
            }
        }
    }

    sponsorDateValidation() {
        if ( this.fundingStartDate == null ) {
            this.isFundingWarning = true;
            this.fundingWarningText = '* Please select start date';
        } else if ( this.fundingEndDate == null ) {
            this.isFundingWarning = true;
            this.fundingWarningText = '* Please select end date';
        } else if ( this.fundingStartDate > this.fundingEndDate ) {
            this.isFundingWarning = true;
            this.fundingWarningText = '* Please select an end date after start date';
        } else {
            this.isFundingWarning = false;
            this.fundingWarningText = null;
        }
    }

    addSponsor() {
        this.sponsorDateValidation();
        var tempSponsorObject: any = {};
        if ( this.fundingStartDate != null && this.fundingEndDate != null && this.fundingStartDate <= this.fundingEndDate ) {
            if ( this.selectedSponsorName != this.select && this.selectedSponsorType != this.select ) {
                for ( let sponsor of this.result.sponsors ) {
                    if ( sponsor.sponsorName == this.selectedSponsorName ) {
                        tempSponsorObject.sponsor = sponsor;
                        tempSponsorObject.sponsorCode = sponsor.sponsorCode;
                        tempSponsorObject.updateTimeStamp = ( new Date() ).getTime();
                        tempSponsorObject.updateUser = localStorage.getItem( 'currentUser' );
                    }
                }
                tempSponsorObject.startDate = this.fundingStartDate;
                tempSponsorObject.endDate = this.fundingEndDate;
                tempSponsorObject.amount = this.sponsorAmount;
                this.isFundingWarning = false;
                this.fundingWarningText = null;
                this.result.proposal.proposalSponsors.push( tempSponsorObject );
                this.selectedSponsorType = this.select;
                this.selectedSponsorName = this.select;
                this.fundingStartDate = null;
                this.fundingEndDate = null;
                this.sponsorAmount = 0;
            } else if ( this.selectedSponsorType == this.select ) {
                this.isFundingWarning = true;
                this.fundingWarningText = '* Please select funding agency type';
            } else {
                this.isFundingWarning = true;
                this.fundingWarningText = '* Please select funding agency name';
            }
        }
    }

    tempSaveSponsor( sponsor, i ) {
        this.tempSaveSponsorObject = sponsor;
        this.showDeleteSponsor = true;
        this.index = i;
    }

    deleteSponsor() {
        if ( this.tempSaveSponsorObject.sponsorId != null ) {
            this.proposalCreateService.deleteProposalSponsor( this.result.proposal.proposalId, this.tempSaveSponsorObject.sponsorId ).subscribe( data => { } );
            this.result.proposal.proposalSponsors.splice( this.index, 1 );
        } else {
            this.result.proposal.proposalSponsors.splice( this.index, 1 );
        }
    }

    proposalCategoryChange() {
        if ( this.proposalCategorySelected != this.select ) {
            for ( let category of this.result.activityTypes ) {
                if ( category.description == this.proposalCategorySelected ) {
                    this.result.proposal.activityTypeCode = category.code;
                    this.result.proposal.activityType = category;
                    this.proposalCategorySelected = category.description;
                }
            }
        }
    }

    proposalTypeChange() {
        if ( this.proposalTypeSelected != this.select ) {
            for ( let proposalType of this.result.proposalTypes ) {
                if ( proposalType.description == this.proposalTypeSelected ) {
                    this.result.proposal.proposalType = proposalType;
                    this.result.proposal.typeCode = proposalType.typeCode;
                    this.proposalTypeSelected = proposalType.description;
                }
            }
        }
    }

    labICLChange() {
        if ( this.selectedICLLab != this.select ) {
            for ( let icl of this.result.proposalInstituteCentreLabs ) {
                if ( icl.description == this.selectedICLLab ) {
                    this.result.proposal.iclCode = icl.iclCode;
                    this.result.proposal.proposalInstituteCentreLab = icl;
                    this.selectedICLLab = icl.description;
                }
            }
        }
    }

    openRouteLog() {
        this.isRoutelogOpened = true;
    }

    disapproveProposal() {
        this.sendObject = {};
        this.approveDisapprovePlaceHolder = 'Comments on disapproving the proposal';
        this.modalAproveHeading = 'Disapprove';
        this.sendObject.actionType = 'R';
        this.showApproveDisapproveModal = true;
    }

    approveProposal() {
        this.sendObject = {};
        this.approveDisapprovePlaceHolder = 'Comments on approving the proposal';
        this.modalAproveHeading = 'Approve';
        this.sendObject.actionType = 'A';
        this.showApproveDisapproveModal = true;
    }

    approveDisapproveProposal() {
        this.sendObject.personId = localStorage.getItem( 'personId' );
        this.sendObject.proposalId = this.result.proposal.proposalId;
        this.sendObject.approverStopNumber = this.result.approverStopNumber;
        this.sendObject.approveComment = this.approveComments;
        this.proposalCreateService.approveDisapproveProposal( this.sendObject, this.uploadedFile ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.result = temp;
            this.proposalCreateService.setProposalVO(this.result);
            this.approveComments = "";
            this.initialiseProposalFormElements();
            this.changeRef.detectChanges();
        } );
        this.showApproveDisapproveModal = false;
    }

    
    getAllReviewer() {
        this.showReviewerModal = true;
        this.selectedReviewer = null;
        this.reviewerAlreadyAddedMsg = false;
        this.noReviewerAdded = false;
        this.proposalCreateService.fetchAvailableReviewers( this.result.proposal, this.result.personId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.availableReviewers = temp.availableReviewers;
            this.tempLoggedWorkflowDetail = temp.loggedInWorkflowDetail;
            this.result.loggedInWorkflowDetail = _.cloneDeep(temp.loggedInWorkflowDetail);
            this.proposalCreateService.setProposalVO(this.result);
            this.reviewerList = this.completerService.local( this.availableReviewers, 'approverPersonName', 'approverPersonName' );
            this.changeRef.detectChanges();
        } ,error=>{},()=>{});
    }

    removeSelectedReviewer( $event, reviewer, i ) {
        $event.preventDefault();
        if ( this.result.loggedInWorkflowDetail.workflowReviewerDetails.length > 0 ) {
            if ( reviewer.reviewerDetailId != null ) {
                this.proposalCreateService.deleteAssignedReviewer( this.result.proposal.proposalId, reviewer.reviewerPersonId ).subscribe( data => {
                    var temp: any;
                    temp = data;
                    this.updateFlags(temp);
                    this.result.workflow = temp.workflow;
                    this.updateWorkflowStops();
                } );
            }
            this.result.loggedInWorkflowDetail.workflowReviewerDetails.splice( i, 1 );
            this.proposalCreateService.setProposalVO(this.result);
            this.reviewerAlreadyAddedMsg = false;
        }
    }
    
    reviewerChangeFunction() {
        this.reviewerAlreadyAddedMsg = false;
        var d = new Date();
        var timeStamp = d.getTime();
        if ( this.result.loggedInWorkflowDetail == null ) {
            this.result.loggedInWorkflowDetail = {};
        }
        if ( this.result.loggedInWorkflowDetail.workflowReviewerDetails == null ) {
            this.result.loggedInWorkflowDetail.workflowReviewerDetails = [];
        }
        for ( let reviewer of this.availableReviewers ) {
            if ( reviewer.approverPersonName == this.selectedReviewer ) {
                if(this.result.loggedInWorkflowDetail.workflowReviewerDetails.length != 0) {
                    for(let review of this.result.loggedInWorkflowDetail.workflowReviewerDetails) {
                        if(review.reviewerPersonId == reviewer.approverPersonId) {
                                this.reviewerAlreadyAddedMsg = true;
                                break;
                        }
                    }
                }
                if( this.reviewerAlreadyAddedMsg == false) {
                    var assignedReviewer: any = {};
                    assignedReviewer.reviewerPersonId = reviewer.approverPersonId;
                    assignedReviewer.emailAddress = reviewer.emailAddress;
                    assignedReviewer.reviewerPersonName = reviewer.approverPersonName;
                    assignedReviewer.approvalStatusCode = "W";
                    assignedReviewer.workflowDetail = _.cloneDeep(this.tempLoggedWorkflowDetail);
                    assignedReviewer.workflowStatus = this.tempLoggedWorkflowDetail.workflowStatus;
                    assignedReviewer.updateTimeStamp = ( new Date() ).getTime();
                    assignedReviewer.updateUser = localStorage.getItem( 'currentUser' );
                    this.result.loggedInWorkflowDetail.workflowReviewerDetails.push( assignedReviewer );
                }
            }
        }
        this.changeRef.detectChanges();
        this.selectedReviewer = null; 
        this.proposalCreateService.setProposalVO(this.result);
    }
    
    addReviewer() {
        this.noReviewerAdded = false;
        if( this.result.loggedInWorkflowDetail.workflowReviewerDetails.length!=0) {
            this.result.proposal.updateTimeStamp = new Date().getTime();
            this.result.proposal.updateUser = this.currentUser;
            this.proposalCreateService.assignReviewer( this.result.proposal, this.result.loggedInWorkflowDetail, this.result.proposal.proposalId ).subscribe( data => {
                var temp: any = {};
                temp = data;
                this.result.proposal = temp.proposal;
                this.result.workflow = temp.workflow;
                this.result.loggedInWorkflowDetail = temp.loggedInWorkflowDetail;
                this.proposalCreateService.setProposalVO(this.result);
                this.updateFlags(temp);
                this.updateWorkflowStops();
                this.updateRouteLogHeader();
                this.changeRef.detectChanges();
            } );
            this.noReviewerAdded = false;
            this.showReviewerModal = false;
        } else {
            this.noReviewerAdded = true;
            this.showReviewerModal = true;
        }
       
    }

    completeReview() {
        //this.sendObject.proposal = this.result.proposal;
        this.sendObject.proposalId = this.result.proposal.proposalId;
        this.sendObject.userName = this.currentUser;
        this.sendObject.approveComment = this.approveComments;
        this.sendObject.personId = this.result.personId;
        this.proposalCreateService.completeReviewAction( this.sendObject, this.uploadedFile ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.result.workflow = temp.workflow;
            this.updateFlags(temp);
            this.updateWorkflowStops();
            this.updateRouteLogHeader();
            this.proposalCreateService.setProposalVO(this.result);
            this.changeRef.detectChanges();
        } );
        this.showApproveDisapproveModal = false;
    }

    downloadRouteAttachment( event, selectedFileName, selectedAttachArray: any[] ) {
        event.preventDefault();
        for ( let attachment of selectedAttachArray ) {
            if ( attachment.fileName == selectedFileName ) {
                if ( attachment.attachmentId != null ) {
                    this.proposalCreateService.downloadRoutelogAttachment( attachment.attachmentId ).takeUntil( this.onDestroy$ ).subscribe(
                        data => {
                            var a = document.createElement( "a" );
                            a.href = URL.createObjectURL( data );
                            a.download = attachment.fileName;
                            a.click();
                        } );
                } else {
                    var url = "data:" + attachment.mimeType + ";base64," + attachment.attachment;
                    var a = document.createElement( "a" );
                    a.href = url;
                    a.download = attachment.fileName;
                    a.click();
                }
            }
        }

    }

    toggleReviewers($event, i) {
        $event.preventDefault();
        this.isRevExpanded[i] = !this.isRevExpanded[i];
    }

    openConfirm(actionType: string) {
      this.showConfirmModal = true;
      if (actionType == 'submit') {
        this.isForward = true;
        this.confirmHeading = "Submit to Provost";
        this.confirmMessage = 'Are you sure you want to forward this proposal for endorsement ?';
      } else {
        this.isEndorse = true;
        this.confirmHeading = "Endorse";
        this.confirmMessage = 'Are you sure you want to endorse this proposal ?';
      }
    }

    submitToProvost() {
      this.result.proposal.updateTimeStamp = new Date().getTime();
      this.result.proposal.updateUser = this.currentUser;
      this.proposalCreateService.submitForEndorsement(this.result.proposal.proposalId, this.result.proposal).subscribe((data)=> {
        var temp: any = {};
        temp = data;
        this.result.proposal = temp.proposal;
        this.updateRouteLogHeader();
        this.proposalCreateService.setProposalVO(this.result);
        /*this.showSuccessMessage = true;
        this.successMessage = 'Proposal forwarded successfully for endorsement';
        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 8000);
        window.scrollTo( 0, 0 );*/
      });
      this.showConfirmModal = false;
    }

    approveEndorse() {
      this.result.proposal.updateTimeStamp = new Date().getTime();
      this.result.proposal.updateUser = this.currentUser;
      this.proposalCreateService.approveByProvost(this.result.proposal.proposalId, this.result.proposal, this.userName).subscribe((data) => {
        var temp: any = {};
        temp = data;
        this.result.proposal = temp.proposal;
        this.updateRouteLogHeader();
        this.proposalCreateService.setProposalData(this.result.proposal);
        this.proposalCreateService.setProposalVO(this.result);
        /*this.showSuccessMessage = true;
        this.successMessage = 'Proposal awarded successfully. Institute Proposal #' + this.result.proposal.ipNumber;
        setTimeout(() => {
            this.showSuccessMessage = false;
        }, 8000);
        window.scrollTo( 0, 0 );*/
      });
      this.showConfirmModal = false;
    }
    
    triggerAdd() {
        $('#addAttach').trigger('click');
    }

    backToList(e){
        e.preventDefault();
        this.router.navigate(['/dashboard'], { queryParams: { 'currentTab': 'SMU_PROPOSAL' } } )
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\/\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
    }

    openGoBackModal() {
        if( this.result.proposal.statusCode == 1) {
            this.showConfirmGoBack = true;
        } else {
            this.router.navigate(['/dashboard'],{queryParams:{'currentTab':'SMU_PROPOSAL'}});
        }
    }
    
    /*Budget Related Functions*/
    gotoBudget() {
        this.proposalFlag_subscription = this.proposalCreateService.proposalValidityFlagVariable.subscribe( proposalValidityFlag => {
            if(proposalValidityFlag == false){
                this.proposalCreateService.setProposalTab('BUDGET');
            }
          } );
        if(this.result.proposal.proposalId != null) {
            this.router.navigate(['/proposal/proposalBudget'], { queryParams: { 'proposalId': this.result.proposal.proposalId }});
        } else {
            this.saveProposal('partialSave'); 
        }
    }

    checkProposalDataValidity(data, criteria) {
       if(criteria == 'title' ||criteria == 'submissionDate' || criteria == 'proposedStartDate'|| criteria == 'proposedEndDate'){
           if(data == null || data == undefined || data == '') {
               this.proposalDataValidityFlag = true;
               this.proposalCreateService.setProposalValidityFlag(this.proposalDataValidityFlag);
           }
           else{
               this.proposalDataValidityFlag = false;
           }
       }
       else if(criteria == 'category' ||criteria == 'type'||criteria == 'ICL' ) {
           if(data == this.select  || data == this.select) {
               this.proposalDataValidityFlag = true;
               this.proposalCreateService.setProposalValidityFlag(this.proposalDataValidityFlag);
           }
           else{
               this.proposalDataValidityFlag = false;
           }
       } 
    }

    leadUnitChangeFunction() {
        for(let homeUnit of this.result.homeUnits){
             if ( homeUnit.unitName == this.result.proposal.homeUnitName ) {
                 this.result.proposal.homeUnitNumber = homeUnit.unitNumber;
                 this.result.proposal.homeUnitName = this.result.proposal.homeUnitName;									 
             }
         }
     }
    
    printProposal() {
    let data1: any;
    this.proposalCreateService.printProposal(this.result.proposal.proposalId).takeUntil( this.onDestroy$ ).subscribe(
        data => {
            data1 = data;
            var a = document.createElement( "a" );
            a.href = URL.createObjectURL( data );
            a.download = this.result.proposal.title;
            a.click();
        });
    }
}
