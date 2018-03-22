import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { CommitteCreateEditService } from '../committee-create-edit.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { ActivatedRoute, Router } from '@angular/router';
import { CommitteeConfigurationService } from '../../common/committee-configuration.service'
import { CommitteeMemberEmployeeElasticService } from '../../elastic-search/committee-members-employees-elastic-search.service';
import { CommitteeMemberNonEmployeeElasticService } from '../../elastic-search/committee-members-nonEmployee-elastic-search.service';

@Component( {
    selector: 'app-committee-members',
    templateUrl: './committee-members.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css'],
    providers: [CommitteeMemberEmployeeElasticService, CommitteeMemberNonEmployeeElasticService],
    changeDetection: ChangeDetectionStrategy.Default
} )

export class CommitteeMembersComponent implements OnInit, AfterViewInit {
    @Output() isOnEditMembers = new EventEmitter<boolean>();
    memberType;
    modalMessage: string = '';
    modalTitle: string = '';
    showPopup: boolean = false;;
    memberAdded: boolean = false;
    temptermStartDate='';
    addRole: boolean = false;
    memberRoleCode;
    editRole: boolean = false;
    temp_startDate;
    temp_endDate;
    addExpertise: boolean = false;
    editExpertise: boolean = false;
    showMembers: boolean = false;
    showNonEmployeeMembers: boolean = false;
    showAddMember: boolean = false;
    roleAdded = 0;
    committeeId: string;
    editDetails: boolean = false;
    editClass = "committeeBoxNotEditable";
    mode: string;
    memberSearchInput: any = {};
    roleSearchInput: any = {};
    expertiseSearchInput: any = {};
    employeeId: string;
    personId: string;
    personIdFromService: string;
    rolodexIdFromService: string;
    memberList: any = {};
    memberListtoView: any = {};
    membershipRoleList: any = {};
    membershipRoleListtoView: any = {};
    memberListLoaded: any = {};
    employeeFlag: boolean;
    dataServiceMemberList: any = {};
    dataServiceRoleList: any = {};
    dataServiceExpertiseList: any = {};
    employees: any = {};
    non_employees: any = {};
    membershipRoles: any = {};
    membershipExpertise: any = {};
    result: any = {};
    resultLoadedById: any = {};
    memberExist: boolean = false;
    sendMemberObject: any;
    saveResult: any = {};
    memberRoleObject: any = {};
    memberExpertiseObject: any = {};
    selectedExpertise: string;
    nonEmployeeFlag: boolean = false;

    selectedRole: string;
    searchString: string;
    hits_source: any[];
    first_name: string;
    middle_name: string;
    last_name: string;
    elasticSearchresults: Array<any> = [];
    searchTextModel: string;
    changePersonDetails: boolean = false;
    searchActive: boolean = false;
    selectedMember: any = {};
    _results: Subject<Array<any>> = new Subject<Array<any>>();

    prncpl_id: string;
    full_name: string;
    rolodexId: string;

    iconClass: string = 'fa fa-search';
    editClassRole = "committeeBoxNotEditable";
    message: string;
    activeMembers = true;
    inactiveMembers;
    currentUser = localStorage.getItem( 'currentUser' );
    searchText: FormControl = new FormControl( '' );
    placeHolderText: string = 'Search an employee';
    roleFieldsFilled: boolean = true;
    roleWarningMessage: string;
    commMemberRolesId: number;
    commMembershipId: string;
    IsToDeleteRole: boolean = false;
    commMemberExpertiseId: number;
    IsToDeleteExpertise: boolean = false;
    isTermDateFilled: boolean = true;

    constructor( public committeeMemberNonEmployeeElasticService: CommitteeMemberNonEmployeeElasticService, private _ngZone: NgZone, public committeeMemberEmployeeElasticService: CommitteeMemberEmployeeElasticService, public committeeConfigurationService: CommitteeConfigurationService, public route: ActivatedRoute, public completerService: CompleterService, public committeCreateEditService: CommitteCreateEditService ) {
        this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
        this.committeeId = this.route.snapshot.queryParamMap.get( 'id' );
        this.committeeConfigurationService.currentCommitteeData.subscribe( data => {
            this.resultLoadedById = data;
            if ( this.resultLoadedById != null ) {
                this.membershipRoles = this.resultLoadedById.membershipRoles;
                this.membershipExpertise = this.resultLoadedById.researchAreas;
                this.dataServiceRoleList = this.completerService.local( this.membershipRoles, 'description', 'description' );
                this.dataServiceExpertiseList = this.completerService.local( this.membershipExpertise, 'description', 'description' );
                this.memberList.committeeMembershipTypes = this.resultLoadedById.committeeMembershipTypes;
                this.memberExist = true;
                this.expandMemberToSave();
            }
            if ( this.resultLoadedById.committee.committeeMemberships.length == 0 ) {
                this.memberExist = false;
            } else {
                this.memberExist = true;
            }
        } );
    }

    ngOnInit() {
        this.initialLoad();
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
                                                id: this.prncpl_id
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
                                                id: this.rolodexId
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
            .subscribe( this._results );
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

    initialLoad() {
        if ( this.mode == 'view' ) { } else {
            this.editDetails = false;
            this.isOnEditMembers.emit( this.editDetails );
        }
    }

    selected( value ) {
        this.searchTextModel = value.label;
        this.selectedMember = value;
        this.message = '';
    }

    onSearchValueChange() {
        this.iconClass = this.searchTextModel ? 'fa fa-times' : 'fa fa-search';
        this.elasticSearchresults = [];
    }

    employeeRadioChecked() {
        this.nonEmployeeFlag = false;
        this.searchTextModel = '';
        this.placeHolderText = 'Search an employee';
    }

    nonEmployeeRadioChecked() {
        this.nonEmployeeFlag = true;
        this.searchTextModel = '';
        this.placeHolderText = 'Search a non-employee';
    }

    showEditDetails() {
        this.editDetails = true;
        this.isOnEditMembers.emit( this.editDetails );
        if ( this.editDetails ) {
            this.editClass = 'committeeBox';
        }
        this.addRole = false;
        this.addExpertise = false;
    }

    memberTypeChange( member, types ) {
        for ( let membertype of this.memberList.committeeMembershipTypes ) {
            if ( membertype.description == types ) {
                var d = new Date();
                var timestamp = d.getTime();
                membertype.updateTimestamp = timestamp;
                membertype.updateUser = this.currentUser;
                member.committeeMembershipType = membertype;
                member.membershipTypeCode = membertype.membershipTypeCode;
            }
        }
    }

    saveDetails( member ) {
        if ( member.termStartDate == null || member.termEndDate == null ) {
            this.isTermDateFilled = false;
            this.roleWarningMessage = '* Term start date and term end date are mandatory';
            this.editDetails = true;
            this.isOnEditMembers.emit( this.editDetails );
        } else if ( member.termStartDate > member.termEndDate ) {
            this.isTermDateFilled = false;
            this.roleWarningMessage = '* Term start date must be after term start date.';
        } else {
            this.isTermDateFilled = true;
            if ( member.committeeMemberRoles.length == 0 ) {
                this.showPopup = true;
                this.modalMessage = "Please add atleast one role";
                this.modalTitle = "No Roles added!";
            } else if ( member.committeeMemberExpertises.length == 0 ) {
                this.showPopup = true;
                this.modalMessage = "Please add atleast one expertise";
                this.modalTitle = "No Expertise added!";
            } else {
                this.showPopup = false;
                this.isOnEditMembers.emit( this.editDetails );
            }
            this.editDetails = false;
            this.isOnEditMembers.emit( this.editDetails );
            this.memberAdded = false;
            this.editClass = 'committeeBoxNotEditable';
            var currentDate = new Date();
            var currentTime = currentDate.getTime();
            for ( let member of this.resultLoadedById.committee.committeeMemberships ) {
                member.updateUser = this.currentUser;
                member.updateTimestamp = currentTime;
            }
            this.sendMemberObject = {};
            this.sendMemberObject.committee = this.resultLoadedById.committee;
            this.committeCreateEditService.saveCommitteeMembers( this.sendMemberObject ).subscribe( data => {
                this.saveResult = data;
                this.resultLoadedById.committee = this.saveResult.committee;
            } );
        }

    }

    public dateFilter = ( d: Date, member ): boolean => {
        member.termStartDate = d.getDay();
        return;
    }

    cancelEditDetails() {
        this.editDetails = false;
        if ( !this.editDetails ) {
            this.editClass = 'committeeBoxNotEditable';
        }
        this.isOnEditMembers.emit( this.editDetails );
        this.isTermDateFilled = true;
    }

    addRoles( event: any, member: any ) {
        event.preventDefault();
        if ( this.editDetails == true ) {
            this.showPopup = true;
            this.modalMessage = "You are in the middle of editing Person Details, please save the data once to proceed";
            this.modalTitle = "Warning!!!";
        } else {
            this.addRole = !this.addRole;
            this.addExpertise = false;
            this.editClassRole = 'committeeBox';
            if ( this.roleFieldsFilled == false ) {
                this.roleFieldsFilled = true;
            }
            this.membershipRoles.description = '';
            this.memberRoleObject.startDate = null;
            this.memberRoleObject.endDate = null;
        }
    }

    saveRole( event: any, role, member ) {
        event.preventDefault();
        this.addRole = false;
        this.memberAdded = false;
        this.memberRoleCode = '';
        this.editRole = false;
        this.editClassRole = 'committeeBoxNotEditable';
        this.committeCreateEditService.updateMemberRoles( role.commMemberRolesId, this.committeeId, member.commMembershipId, role ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
            if ( member.committeeMemberExpertises.length == 0 ) {
                
            }
        } );
    }

    cancelEditRoles( event: any, role ) {
        event.preventDefault();
        role.startDate = this.temp_startDate;
        role.endDate = this.temp_endDate;
        this.memberRoleCode = '';
        this.addRole = false;
        this.editRole = false;
        this.editClassRole = 'committeeBoxNotEditable';
    }

    addExpertises( event: any, member: any ) {
        event.preventDefault();
        if ( this.editDetails == true ) {
            this.showPopup = true;
            this.modalMessage = "You are in the middle of editing Person Details, please save the data once to proceed";
            this.modalTitle = "Warning!!!";
        } else {
            this.addExpertise = !this.addExpertise;
            this.addRole = false;
        }
    }

    cancelExpertise() {
        this.addExpertise = false;
        this.editExpertise = false;
    }

    editRoles( event: any, role ) {
        event.preventDefault();
        this.memberRoleCode = role.membershipRoleCode;
        this.temp_startDate = role.startDate;
        this.temp_endDate = role.endDate;
        this.editRole = true;
        this.editClassRole = 'committeeBox';
    }

    editExpertises() {
        if ( this.editDetails == true ) {
            this.showPopup = true;
            this.modalMessage = "You are in the middle of editing Person Details, please save the data once to proceed";
            this.modalTitle = "Warning!!!";
        } else {
            this.editExpertise = true;
            this.editClass = 'committeeBox';
        }
    }

    roleAddtoTable( member ) {
        var termStartDate = new Date( member.termStartDate );
        var termEndDate = new Date( member.termEndDate );
        if ( this.membershipRoles.description == null || this.membershipRoles.description == undefined || this.memberRoleObject.startDate == null || this.memberRoleObject.endDate == null ) {
            this.roleFieldsFilled = false;
            this.roleWarningMessage = '* Please fill the mandatory fileds.';
        } else if ( this.memberRoleObject.startDate > this.memberRoleObject.endDate ) {
            this.roleFieldsFilled = false;
            this.roleWarningMessage = '* Role end date must be after role start date.';
        } else if ( this.memberRoleObject.startDate < termStartDate || this.memberRoleObject.startDate > termEndDate || this.memberRoleObject.endDate < termStartDate || this.memberRoleObject.endDate > termEndDate ) {
            this.roleFieldsFilled = false;
            this.roleWarningMessage = '* Role start date and role end date must be between term start date and term end date.';
        } else {
            this.roleFieldsFilled = true;
            this.roleWarningMessage = '';
            var flag: boolean = false;
            this.memberAdded = false;
            this.committeCreateEditService.saveCommMemberRole( member.commMembershipId, this.committeeId, this.memberRoleObject ).subscribe( data => {
                this.memberRoleObject.startDate = null;
                this.memberRoleObject.endDate = null;
                this.membershipRoles.description = null;
                var temp: any = {};
                temp = data;
                this.resultLoadedById.committee = temp.committee;
            } );
            if ( member.committeeMemberExpertises.length == 0 ) {
                this.showPopup = true;
                this.isOnEditMembers.emit( this.editDetails );
                this.modalMessage = "Please add atleast one expertise";
                this.modalTitle = "No Expertise added!";
            }
        }
    }

    expertiseAddtoTable( member ) {
        var flag: boolean = false;
        this.addExpertise = false;
        this.memberAdded = false;
        this.editExpertise = false;
        this.editClass = 'committeeBoxNotEditable';
        this.committeCreateEditService.saveCommMemberExpertise( member.commMembershipId, this.committeeId, this.memberExpertiseObject ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
    }

    clearsearchBox( e: any ) {
        e.preventDefault();
        this.searchTextModel = '';
    }

    showWarning( event: any, commMemberRolesId, commMembershipId ) {
        event.preventDefault();
        this.commMemberRolesId = commMemberRolesId;
        this.commMembershipId = commMembershipId;
        this.showPopup = true;
        this.modalTitle = 'Delete Role ?';
        this.modalMessage = 'Do you want to remove the current role ?'
        this.IsToDeleteRole = true;
    }

    deleteRole() {
        this.committeCreateEditService.deleteRoles( this.commMemberRolesId, this.commMembershipId, this.committeeId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
        this.showPopup = false;
        this.IsToDeleteRole = false;
    }

    showExpertiseDeleteWarning( event: any, commMemberExpertiseId, commMembershipId ) {
        event.preventDefault();
        this.commMemberExpertiseId = commMemberExpertiseId;
        this.commMembershipId = commMembershipId;
        this.showPopup = true;
        this.modalTitle = 'Delete Expertise ?';
        this.modalMessage = 'Do you want to remove the current expertise ?'
        this.IsToDeleteExpertise = true;
    }

    deleteExpertise() {
        this.committeCreateEditService.deleteExpertises( this.commMemberExpertiseId, this.commMembershipId, this.committeeId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
        this.showPopup = false;
        this.IsToDeleteExpertise = false;
    }

    deleteMember( event: any, commMembershipId ) {
        event.preventDefault();
        this.committeCreateEditService.deleteMember( commMembershipId, this.committeeId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
    }

    showMembersNonEmployeesTab( event: any, rolodexIdFromService, member ) {
        event.preventDefault();
        this.isTermDateFilled = true;
        this.personId = null;
        this.showMembers = false;
        if ( member.updateTimestamp == null ) {
            this.memberAdded = true;
            this.showEditDetails();
        }
        this.committeeConfigurationService.changeMemberData( member );
        this.showNonEmployeeMembers = !this.showNonEmployeeMembers;
        if ( this.showNonEmployeeMembers ) {
            this.editDetails = false;
            this.isOnEditMembers.emit( this.editDetails );
            this.editClass = "committeeBoxNotEditable";
        }
        this.rolodexId = rolodexIdFromService;
    }

    showMembersTab( event: any, personIdFromService, member ) {
        event.preventDefault();
        this.isTermDateFilled = true;
        this.rolodexId = null;
        this.showNonEmployeeMembers = false;
        if ( member.updateTimestamp == null ) {
            this.memberAdded = true;
            this.showEditDetails();
        }
        this.showMembers = !this.showMembers;
        this.committeeConfigurationService.changeMemberData( member );
        if ( this.showMembers ) {
            this.editDetails = false;
            this.isOnEditMembers.emit( this.editDetails );
            this.editClass = "committeeBoxNotEditable";
        }
        this.personId = personIdFromService;
    }

    addMemberDiv( event: any ) {
        event.preventDefault();
        this.showAddMember = !this.showAddMember;
    }

    addMember() {
        if ( this.memberAdded == true ) {
            this.showPopup = true;
            this.modalMessage = "You are yet to save the details of an already added member. Please add details and save to proceed";
            this.modalTitle = "Warning!!!";
        } else {
            this.committeCreateEditService.addMember( this.selectedMember.id, this.committeeId, this.nonEmployeeFlag, this.resultLoadedById.committee ).subscribe( data => {
                this.memberList = data;
                var length = this.memberList.committee.committeeMemberships.length;
                for ( let membertype of this.memberList.committeeMembershipTypes ) {
                    if ( membertype.description == 'Non-voting member' ) {
                        var d = new Date();
                        var timestamp = d.getTime();
                        membertype.updateTimestamp = timestamp;
                        membertype.updateUser = this.currentUser;
                        this.memberList.committee.committeeMemberships[length - 1].committeeMembershipType = membertype;
                        this.memberList.committee.committeeMemberships[length - 1].membershipTypeCode = membertype.membershipTypeCode;
                    }
                }
                this.memberAdded = true;
                this.resultLoadedById.committee.committeeMemberships = this.memberList.committee.committeeMemberships;
                this.memberExist = true;
                this.expandMemberToSave();
            } );
            this.searchTextModel = '';
        }
    }

    areaChangeFunction( unitName ) {
        this.employees.forEach(( value, index ) => {
            if ( value.unitName == unitName ) {
                this.memberSearchInput.personId = value.prncplId;
            }
        } );
    }

    onSelectMember() {
        this.employees.forEach(( value, index ) => {
            if ( value.fullName == this.memberSearchInput.fullName ) {
                this.memberSearchInput.personId = value.prncplId;
            }
        } );
    }

    onSelectRole() {
        var tempObj: any = {};
        this.membershipRoles.forEach(( value, index ) => {
            if ( value.description == this.membershipRoles.description ) {
                this.selectedRole = this.membershipRoles.description;
                for ( let member of this.resultLoadedById.committee.committeeMemberships ) {
                    if ( member.personId == this.personId ) {
                        var d = new Date();
                        var timestamp = d.getTime();
                        tempObj.membershipRoleCode = this.membershipRoles[index].membershipRoleCode;
                        tempObj.membershipRoleDescription = this.membershipRoles[index].description;
                        tempObj.startDate = this.membershipRoles[index].startDate;
                        tempObj.endDate = this.membershipRoles[index].endDate;
                        tempObj.updateTimestamp = timestamp;
                        tempObj.updateUser = this.currentUser;
                        this.memberRoleObject = tempObj;
                    }
                }
            }
        } );
    }

    onSelectExpertise() {
        var tempObj: any = {};
        var d = new Date();
        var timestamp = d.getTime();
        this.membershipExpertise.forEach(( value, index ) => {
            if ( value.description == this.membershipExpertise.description ) {
                this.selectedExpertise = this.membershipExpertise.description;
                for ( let member of this.resultLoadedById.committee.committeeMemberships ) {
                    if ( member.personId == this.personId ) {
                        tempObj.researchAreaCode = this.membershipExpertise[index].researchAreaCode;
                        tempObj.researchAreaDescription = this.membershipExpertise[index].description;
                        tempObj.updateTimestamp = timestamp;
                        tempObj.updateUser = this.currentUser;
                        this.memberExpertiseObject = tempObj;
                    }
                }
            }
        } );
    }

    expandMemberToSave() {
        this.showPopup = false;
        this.resultLoadedById.committee.committeeMemberships.forEach(( value, index ) => {
            if ( value.updateTimestamp == null || value.committeeMemberRoles.length == 0 || value.committeeMemberExpertises.length == 0) {
                this.memberAdded = true;
                this.showEditDetails();
                if ( value.personId == null ) {
                    this.rolodexId = value.rolodexId;
                    this.showNonEmployeeMembers = true;
                } else if ( value.rolodexId == null ) {
                    this.personId = value.personId;
                    this.showMembers = true;
                }
            }
        } );
    }

    modalFooterClear() {
        this.IsToDeleteRole = false;
        this.IsToDeleteExpertise = false;
        this.showPopup = false;
    }
}
