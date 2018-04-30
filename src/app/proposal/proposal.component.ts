import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionManagementService } from "../session/session-management.service";
import { Subject, Observable } from "rxjs";
import { CompleterService, CompleterData } from "ng2-completer";
import { UploadFile, UploadEvent } from "ngx-file-drop";
import { CommitteeMemberEmployeeElasticService } from '../elastic-search/committee-members-employees-elastic-search.service';
import { CommitteeMemberNonEmployeeElasticService } from '../elastic-search/committee-members-nonEmployee-elastic-search.service';
import { FormsModule, FormGroup, FormControl, FormControlName } from '@angular/forms';

import { ProposalCreateEditService } from "./proposal-create-view.service";
import { GrantService } from "../grant/grant.service";
import 'rxjs/Rx';

@Component( {
    selector: 'proposal',
    templateUrl: './proposal.component.html',
    providers: [SessionManagementService, ProposalCreateEditService, CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService],
    styleUrls: ['../../assets/css/bootstrap.min.css', '../../assets/css/font-awesome.min.css', '../../assets/css/style.css', '../../assets/css/search.css'],

} )
export class ProposalComponent implements OnInit, AfterViewInit {

    mode: string = "view";
    showGrantSearch: boolean = true;
    isAOREnabled: boolean = true;
    editScheduleattachment: boolean = true;
    editClass: string = "committeeBox";
    editAreaClass: string = 'scheduleBoxes';
    sendObject: any = {};
    result: any = {};
    proposalTypeSelected: string;
    grantCallType: any = [];
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

    showAddAttachment: boolean = false;
    uploadedFile: any[] = [];
    attachmentDescription: string;
    index: number;
    public files: UploadFile[] = [];
    showDeleteAttachment: boolean;
    tempSaveAttachment: any = {};
    attachmentObject: any = {};
    file: FileList;
    ismandatoryFilled: boolean;
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

    public onDestroy$ = new Subject<void>();

    constructor( public grantService: GrantService, public committeeMemberNonEmployeeElasticService: CommitteeMemberNonEmployeeElasticService, public committeeMemberEmployeeElasticService: CommitteeMemberEmployeeElasticService, public _ngZone: NgZone, public changeRef: ChangeDetectorRef, public route: ActivatedRoute, private router: Router, private sessionService: SessionManagementService, private proposalCreateService: ProposalCreateEditService, public completerService: CompleterService ) {
        if ( !sessionService.canActivate() ) {
            this.router.navigate( ['/loginpage'] );
        }
        this.sendObject = {};
        this.result.proposal = {};
    }

    ngOnInit() {
        this.keywordsList = [];
        this.currentDate.setDate( this.currentDate.getDate() - 1 );
        this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
        this.grantId = this.route.snapshot.queryParamMap.get( 'grantId' );

        this.proposalId = this.route.snapshot.queryParamMap.get( 'proposalId' );
        if ( this.proposalId == null ) {
            this.mode = 'create';
            this.editClass = "committeeBox";
            this.editAreaClass = "scheduleBoxes";
            this.createProposalCall();
        } else {
            this.proposalCreateService.loadProposalById( this.proposalId ).subscribe( success => {
                this.result = success;
                if ( this.result.proposal.proposalStatus.description == 'In Progress' ) {
                    this.mode == 'edit';
                    this.editClass = "committeeBox";
                    this.editAreaClass = "scheduleBoxes";
                } else {
                    this.mode == 'view';
                    this.editClass = "committeeBoxNotEditable";
                    this.editAreaClass = "scheduleBoxes";

                }
                this.grantCallType = this.result.grantCallTypes;
                this.personRolesList = this.result.proposalPersonRoles;
                this.proposalTypeSelected = ( this.result.proposal.proposalType != null ) ? this.result.proposal.proposalType.description : this.select;
                this.proposalCategorySelected = ( this.result.proposal.proposalCategory != null ) ? this.result.proposal.proposalCategory.description : this.select;
                this.grantCallType = this.result.grantCallTypes;
                this.selectedAreaType = this.result.proposalResearchTypes[0].description;
                this.selectedICLLab = ( this.result.proposal.proposalInstituteCentreLab != null ) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
                this.personRoleSelected = this.select;
                this.budgetCategorySelected = this.select;
                this.researchTypeSelected = this.result.proposalResearchTypes[0].description;
                this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
                this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' );
                this.grantCallList = this.completerService.local( this.result.grantCalls, 'grantCallName', 'grantCallName' );
                this.selectedSponsorType = this.select;
                this.budgetCategoryChanged();
                this.grantService.fetchSponsorsBySponsorType( this.result.sponsorTypes[0].code ).subscribe( data => {
                    var temp: any = {};
                    temp = data;
                    this.result.sponsors = temp.sponsors;
                    this.selectedSponsorName = this.select;
                    this.fundingStartDate = null;
                    this.fundingEndDate = null;
                    this.sponsorAmount = 0;
                } );
                this.selectedAttachmentType = this.result.proposalAttachmentTypes[0].description;
                this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
                this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
                this.areaList = this.completerService.local( this.result.proposalExcellenceAreas, 'description', 'description' );
                this.protocolsList = this.completerService.local( this.result.protocols, 'title', 'title' );

            } );
        }
    }

    createProposalCall() {
        if ( this.grantId != null ) {
            this.sendObject.grantCallId = this.grantId;

        } else {
            this.sendObject.grantCallId = null;
        }
        this.proposalCreateService.loadCreateProposalData( this.sendObject ).takeUntil( this.onDestroy$ ).subscribe( data => {
            this.result = data || [];
            this.grantCallType = this.result.grantCallTypes;
            this.personRolesList = this.result.proposalPersonRoles;
            this.proposalTypeSelected = ( this.result.proposal.proposalType != null ) ? this.result.proposal.proposalType.description : this.select;
            this.proposalCategorySelected = ( this.result.proposal.proposalCategory != null ) ? this.result.proposal.proposalCategory.description : this.select;
            this.grantCallType = this.result.grantCallTypes;
            this.selectedAreaType = this.result.proposalResearchTypes[0].description;
            this.selectedICLLab = ( this.result.proposal.proposalInstituteCentreLab != null ) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
            this.personRoleSelected = this.select;
            this.budgetCategorySelected = this.select;
            this.researchTypeSelected = this.result.proposalResearchTypes[0].description;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' );
            this.grantCallList = this.completerService.local( this.result.grantCalls, 'grantCallName', 'grantCallName' );
            this.selectedSponsorType = this.select;
            this.budgetCategoryChanged();

            this.grantService.fetchSponsorsBySponsorType( this.result.sponsorTypes[0].code ).subscribe( data => {
                var temp: any = {};
                temp = data;
                this.result.sponsors = temp.sponsors;
                this.selectedSponsorName = this.select;
                this.fundingStartDate = null;
                this.fundingEndDate = null;
                this.sponsorAmount = 0;
            } );
            this.selectedAttachmentType = this.result.proposalAttachmentTypes[0].description;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            this.keywordsList = this.completerService.local( this.result.scienceKeywords, 'description', 'description' )
            this.areaList = this.completerService.local( this.result.proposalExcellenceAreas, 'description', 'description' );
            this.protocolsList = this.completerService.local( this.result.protocols, 'title', 'title' );

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
                                    alert( "catch error" );
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
                                            this.first_name = this.hits_source[j].first_name;
                                            this.middle_name = this.hits_source[j].middle_name;
                                            this.last_name = this.hits_source[j].last_name;
                                            this.elasticSearchresults.push( {
                                                label: this.first_name + '  ' + this.middle_name
                                                + '  ' + this.last_name,
                                                id: this.rolodexId,
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
                                    console.log( "catch error", error );
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
        this.iconClass = this.searchTextModel ? 'fa fa-times fa-med' : '';
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
        this.selectedICLLab = ( this.result.proposal.proposalInstituteCentreLab != null ) ? this.result.proposal.proposalInstituteCentreLab.description : this.select;
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

    addAreaOfResearch( areaInput ) {

    }

    addAreaOfExcellence( areaInput ) {

    }

    deleteAreaOfResearchConfirmation( e, area ) {

    }

    addFundingSupport( fundInput ) {

    }

    deleteFundingSupportConfirmation( e, area ) {

    }

    deleteIRBProtocolConfirmation( $event, area ) {

    }

    editAttachments( $event, i, attachments ) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    }

    saveEditedattachments( $event, i, attachments ) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    }

    cancelEditedattachments( $event, i, attachments ) {
        $event.preventDefault();
        this.editScheduleattachment = !this.editScheduleattachment;
    }

    downloadAttachements( e, attachments ) {
        e.preventDefault();
    }

    navigate( mode ) {
        this.router.navigate( ['/proposal/proposal'], { queryParams: { 'mode': mode } } );
    }

    differenceBetweenDates( startDate, endDate ) {
        /*if(startDate == null) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Select a proposal start date';
        } else if(startDate> endDate) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Start date is after end date';
        }
        if ( startDate != null && endDate != null && startDate <= endDate ) { */
        var diffInMs = Math.round( Date.parse( endDate ) - Date.parse( startDate ) );
        // diffInMs = Math.round(1523507183000); for testing
        var difference = Math.floor( diffInMs / 1000 / 60 / 60 / 24 | 0 );
        this.durInYears = Math.floor( difference / 365 | 0 );
        difference = Math.floor( difference % 365 | 0 )
        this.durInMonths = Math.floor( difference / 31 | 0 );
        this.durInDays = Math.floor( difference % 31 | 0 );
        /* }*/
    }

    dateValidation() {debugger;
        if ( this.result.proposal.startDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a start date';
        } else if ( this.result.proposal.startDate < this.currentDate ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select a start date from today';
        } else if ( this.result.proposal.startDate != null && this.result.proposal.endDate != null && this.result.proposal.startDate <= this.result.proposal.endDate ) {
            this.isDateWarningText = false;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            if ( this.result.proposal.submissionDate != null && ( this.result.proposal.startDate > this.result.proposal.submissionDate || this.result.proposal.submissionDate > this.result.proposal.endDate ) ) {
                this.isDateWarningText = true;
                this.dateWarningText = 'Please choose a submission date between proposal start date and proposal end date';
            }
        } else if ( this.result.proposal.endDate == null ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select an end date';
        } else if ( this.result.proposal.startDate > this.result.proposal.endDate ) {
            this.isDateWarningText = true;
            this.dateWarningText = 'Please select an end date after start date';
        } else if ( this.result.proposal.startDate != null && this.result.proposal.endDate != null && this.result.proposal.startDate <= this.result.proposal.endDate ) {
            this.isDateWarningText = false;
            this.differenceBetweenDates( this.result.proposal.startDate, this.result.proposal.endDate );
            if ( this.result.proposal.submissionDate != null && ( this.result.proposal.startDate > this.result.proposal.submissionDate || this.result.proposal.submissionDate > this.result.proposal.endDate ) ) {
                this.isDateWarningText = true;
                this.dateWarningText = 'Please choose a submission date between proposal start date and proposal end date';
            }
        } else {
            this.isDateWarningText = false;
        }
    }

    deleteKeyword( keyword, k ) {
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
                    this.keywordWarningText = "Keyword already added";
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
            this.keywordWarningText = "Keyword already added";
        }
        this.selectedKeyword = null;
    }

    closeKeywordWarning() {
        this.isKeywordWarning = false;
        this.keywordWarningText = null;
    }

    grantCallChangeFunction() {
        var d = new Date();
        var timeStamp = d.getTime();
        for ( let grant of this.result.grantCalls ) {
            if ( grant.grantCallName == this.selectedGrantCall ) {
                this.result.proposal.grantCall = grant;
                this.result.proposal.grantCallId = grant.grantCallId;
                this.result.proposal.grantCall.updateTimeStamp = timeStamp;
                this.result.proposal.grantCall.updateUser = this.currentUser;
            }
        }
        this.selectedGrantCall = null;
    }

    removeSelectedGrant( e ) {
        e.preventDefault();
        this.result.proposal.grantCall = null;
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
                tempObj.rolodexId = this.selectedMember.rolodex_id;
                tempObj.fullName = this.selectedMember.last_name + ' , ' + this.selectedMember.middle_name + ' ' + this.selectedMember.first_name;
                tempObj.leadUnitNumber = null;
                tempObj.leadUnitName = this.selectedMember.organization;
            }

            this.personRolesList.forEach(( value, index ) => {
                if ( value.description == this.personRoleSelected ) {
                    tempObj.proposalPersonRole = value;
                    tempObj.personRoleId = value.id;
                }
            } );

            if ( this.result.proposal.proposalPersons.length != 0 ) {
                for ( let person of this.result.proposal.proposalPersons ) {
                    if ( person.fullName == tempObj.fullName ) {
                        personFlag = true;
                        this.personWarningFlag = true;
                        this.personWarningMsg = 'You have already added ' + tempObj.fullName;
                        this.selectedMember = null;
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

                this.personWarningFlag = false;
                this.personWarningMsg = null;
            } else {
                this.personWarningFlag = true;
                this.personWarningMsg = 'You have already added ' + tempObj.fullName;
                this.selectedMember = null;
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

    closeMemberWarning() {
        this.personWarningFlag = false;
    }

    deletePerson() {
        this.showDeleteMember = false;
        if ( this.tempSavePersonObject.proposalPersonId == null ) {
            this.result.proposal.proposalPersons.splice( this.index, 1 );
        } else {
            this.proposalCreateService.deleteProposalPerson( this.result.proposal.proposalId, this.tempSavePersonObject.proposalPersonId ).subscribe( success => {
                var temp = success;
                this.result.proposal.proposalAttachments.splice( this.index, 1 );
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

    closeBudgetWarning() {
        this.budgetWarningFlag = false;
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



    ////// Methods by Ashik Varma
    addAttachments() {
        var d = new Date();
        var timestamp = d.getTime();
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
        this.proposalCreateService.addProposalAttachment( this.result.proposal, this.result.newAttachment, this.uploadedFile ).subscribe( success => {
            var temporaryObject: any = {};
            temporaryObject = success;
            this.result.proposal = temporaryObject.proposal;
        }, error => { console.log( error ) }, () => {
            this.closeAttachments();
        } );
    }

    showAddAttachmentPopUp( e ) {
        e.preventDefault();
        this.showAddAttachment = true;
        this.uploadedFile = [];
        this.attachmentDescription = '';
    }

    tempSaveAttachments( e, attachments, i ) {
        this.tempSaveAttachment = attachments;
        this.index = i;
        this.showDeleteAttachment = true;
    }

    onChange( files: FileList ) {
        this.file = files;
        this.ismandatoryFilled = true;
        for ( var i = 0; i < this.file.length; i++ ) {
            this.uploadedFile.push( this.file[i] );
        }
    }

    public dropped( event: UploadEvent ) {
        this.files = event.files;
        this.ismandatoryFilled = true;
        for ( const file of event.files ) {
            file.fileEntry.file( info => {
                this.uploadedFile.push( info );
                this.changeRef.detectChanges();
            } );
        }
    }

    //delete file function
    deleteFromUploadedFileList( item ) {
        for ( var i = 0; i < this.uploadedFile.length; i++ ) {
            if ( this.uploadedFile[i].name == item.name ) {
                this.uploadedFile.splice( i, 1 );
                this.changeRef.detectChanges();
            }
        }
    }

    closeAttachments() {
        this.showAddAttachment = false;
        this.uploadedFile = [];
    }

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
            this.areaWarningText = 'Select an area of research/excellence'
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

    closeAreaWarning() {
        this.areaWarningText = null;
        this.isAreaWarning = false;
    }

    saveProposal() {
        var type = ( this.result.proposal.proposalId != null ) ? "UPDATE" : "SAVE";
        // proposal details validation
        if ( this.result.proposal.title == "" || this.result.proposal.title == null ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please enter a title';
        } else if ( this.proposalCategorySelected == this.select ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose a category';
        } else if ( this.proposalTypeSelected == this.select ) {
            this.isMandatory = true;
            this.mandatoryText = '* Please choose proposal type';
        } else {
            this.isMandatory = false;
            this.dateValidation();
        }
        // AOR validation
        if ( this.result.proposal.proposalResearchAreas.length > 0 ) {
            this.isAreaWarning = true;
            this.areaWarningText = 'Select an area of research/excellence'
        } else {
            this.areaWarningText = null;
            this.isAreaWarning = false;
        }
        // Project members validation
        if ( this.result.proposal.proposalPersons.length > 0 ) {
            this.personWarningFlag = true;
            this.personWarningMsg = 'Select atleast one team member';
        } else {
            this.personWarningMsg = null;
            this.personWarningFlag = false;
        }
        this.showAddedModal = true;
        if ( !this.isMandatory && !this.isDateWarningText && !this.isAreaWarning && !this.personWarningFlag && !this.isFundingWarning && !this.isIRBWarning && !this.budgetWarningFlag && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0 ) {
            this.proposalCreateService.saveProposal( this.result.proposal, type ).subscribe( data => {
                var temp: any = data;
                this.result.proposal = temp.proposal;
                this.isProposalSaved = true;
            } );
        }
        else {
            this.isProposalSaved = false;
        }

    }

    submitProposal() {
        this.saveProposal();
        if ( this.result.proposal.title == "" || this.result.proposal.title == null ) {
            this.isMandatory = true;
        }
        if ( !this.isMandatory && !this.isDateWarningText && !this.isAreaWarning && !this.personWarningFlag && !this.isFundingWarning && !this.isIRBWarning && !this.budgetWarningFlag && this.result.proposal.proposalPersons.length > 0 && this.result.proposal.proposalResearchAreas.length > 0 ) {
            this.mode = 'view';
            this.showAddedModal = false;
            if ( this.mode == 'view' ) {
                this.editClass = "committeeBoxNotEditable";
                this.editAreaClass = "committeeBoxNotEditable";
            } else if ( this.mode == 'create' || this.mode == 'edit' ) {
                this.editClass = "committeeBox";
                this.editAreaClass = "scheduleBoxes";
            }
        }
    }

    deleteArea() {
        if ( this.tempAreaObject.researchAreaId != null ) {
            //serviceCall
            this.proposalCreateService.deleteProposalResearchArea( this.result.proposal.proposalId, this.tempAreaObject.researchAreaId ).subscribe();
            this.result.proposal.proposalResearchAreas.splice( this.index, 1 );
        } else {
            this.result.proposal.proposalResearchAreas.splice( this.index, 1 );
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

    closeIrbWarning() {
        this.isIRBWarning = false;
        this.irbWarningText = null;
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
            } else if ( this.selectedSponsorType == this.select ) {
                this.isFundingWarning = true;
                this.fundingWarningText = '* Please select funding agency type';
            } else {
                this.isFundingWarning = true;
                this.fundingWarningText = '* Please select funding agency name';
            }
        }
    }

    closeFundingWarning() {
        this.isFundingWarning = false;
        this.fundingWarningText = null;
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
            for ( let category of this.result.proposalCategories ) {
                if ( category.description == this.proposalCategorySelected ) {
                    this.result.proposal.categoryCode = category.categoryCode;
                    this.result.proposal.proposalCategory = category;
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
        this.result.proposal.proposalStatus.description = 'Submitted';
    }
    
    downloadRouteAttachment(e) {
        e.preventDefault();
    }
}
