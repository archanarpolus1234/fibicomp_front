import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectionStrategy, } from '@angular/core';
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
    memberType;
    modalMessage=' ';
    modalTitle=' ';
    showPopup;
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
    editDetails: boolean = true;
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
    hits_highlight: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    organization: string;
    elasticSearchresults: any = [];
    searchTextModel: string;
    changePersonDetails: boolean = false;
    searchActive: boolean = false;
    selectedMember: any = {};
    _results: Subject<Array<any>> = new Subject<Array<any>>();

    prncpl_id;
    full_name;
    prncpl_nm;
    email_addr;
    unit_number;
    unit_name;
    addr_line_1;
    phone_nbr;
    rolodexId;

    iconClass: string = 'fa fa-search';
    editClassRole = "committeeBoxNotEditable";
    message;
    activeMembers = true;
    inactiveMembers;
    currentUser = localStorage.getItem( 'currentUser' );
    searchText: FormControl = new FormControl( '' );

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

    setActiveAndchangeIconSearch() {
        this.searchActive = true;
        this.iconClass = 'fa fa-times';
    }
    
    setInActiveAndchangeIconSearch() {
        this.searchActive = false;
        this.iconClass = 'fa fa-search';
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
                                        this.hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );

                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.prncpl_id = this.hits_source[j].prncpl_id;
                                            this.full_name = this.hits_source[j].full_name;
                                            this.prncpl_nm = this.hits_source[j].prncpl_nm;
                                            this.email_addr = this.hits_source[j].email_addr;
                                            this.unit_number = this.hits_source[j].unit_number;
                                            this.unit_name = this.hits_source[j].unit_name;
                                            this.addr_line_1 = this.hits_source[j].addr_line_1;
                                            this.phone_nbr = this.hits_source[j].phone_nbr;
                                            this.elasticSearchresults.push( {
                                                label: this.full_name,
                                                id: this.prncpl_id
                                            }
                                            );
                                        }
                                        );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                        } else {
                                            if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                                this.message = '';
                                            }
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
                                        this.hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        this.hits_source.forEach(( elmnt, j ) => {
                                            this.rolodexId = this.hits_source[j].rolodex_id;
                                            this.first_name = this.hits_source[j].first_name;
                                            this.middle_name = this.hits_source[j].middle_name;
                                            this.last_name = this.hits_source[j].last_name;
                                            this.organization = this.hits_source[j].organization;
                                            this.elasticSearchresults.push( {
                                                label: this.first_name + '  ' + this.middle_name
                                                + '  ' + this.last_name,
                                                id: this.rolodexId
                                            }
                                            );
                                        }
                                        );
                                        if ( this.elasticSearchresults.length > 0 ) {
                                            this.message = '';
                                        } else {
                                            if ( this.searchTextModel && this.searchTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
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
            } ).catch( this.handleError )
            .subscribe( this._results );
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

    initialLoad() {
        if ( this.mode == 'view' ) { } else {
            this.editDetails = true;
        }
    }
    selected( value ) {
        this.searchTextModel = value.label
        this.selectedMember = value;
    }

    employeeRadioChecked() {
        this.nonEmployeeFlag = false;
        this.searchTextModel=' ';
    }

    nonEmployeeRadioChecked() {
        this.nonEmployeeFlag = true;
        this.searchTextModel=' ';
    }

    showEditDetails() {
        this.editDetails = true;
        if ( this.editDetails ) {
            this.editClass = 'committeeBox';
        }
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

    saveDetails(member) {
        if(member.termStartDate==null || member.termEndDate==null) {
            this.showPopup=true;
            this.editDetails=true;
            this.modalMessage="Term starting and ending date must be filled";
            this.modalTitle="Unfilled fields";
        } else {
            this.showPopup=false;
            this.editDetails = false;
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
    
    public dateFilter = (d: Date,member): boolean => {
        member.termStartDate = d.getDay();
        return ;
    }

    cancelEditDetails() {
        this.editDetails = false;
        if ( !this.editDetails ) {
            this.editClass = 'committeeBoxNotEditable';
        }
    }

    addRoles( event: any ) {
        event.preventDefault();
        if(this.editDetails==true) {
            this.showPopup=true;
            this.modalMessage="Save member details before proceeding";
            this.modalTitle="Member not saved";
                
            
        } else {
            this.addRole = !this.addRole;
            this.editClassRole = 'committeeBox';
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

    addExpertises( event: any ) {
        event.preventDefault();
        if(this.editDetails==true) {
            this.showPopup=true;
            this.modalMessage="Save member details before proceeding";
            this.modalTitle="Member not saved";     
        } else {
            this.addExpertise = !this.addExpertise;
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
        if(this.editDetails==true) {
            this.showPopup=true;
            this.modalMessage="Save member details before proceeding";
            this.modalTitle="Member not saved";
                
            
        } else {
            this.editExpertise = true;
            this.editClass = 'committeeBox';
        }        
    }

    roleAddtoTable( member ) {
        var flag: boolean = false;
        this.memberAdded = false;
        this.committeCreateEditService.saveCommMemberRole( member.commMembershipId, this.committeeId, this.memberRoleObject ).subscribe( data => {
            this.memberRoleObject.startDate = '';
            this.memberRoleObject.endDate = '';
            this.membershipRoles.description = '';
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
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

    deleteRole( event: any, commMemberRolesId, commMembershipId ) {
        event.preventDefault();
        event.preventDefault();
        this.committeCreateEditService.deleteRoles( commMemberRolesId, commMembershipId, this.committeeId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );

    }

    deleteExpertise( event: any, commMemberExpertiseId, commMembershipId ) {
        event.preventDefault();
        this.committeCreateEditService.deleteExpertises( commMemberExpertiseId, commMembershipId, this.committeeId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
    }

    deleteMember( event: any, commMembershipId ) {
        event.preventDefault();
        this.committeCreateEditService.deleteMember( commMembershipId, this.committeeId ).subscribe( data => {
            var temp: any = {};
            temp = data;
            this.resultLoadedById.committee = temp.committee;
        } );
    }

    showMembersNonEmployeesTab( event: any, rolodexIdFromService ) {
        event.preventDefault();
        this.personId = null;
        this.showMembers=false;
        this.showNonEmployeeMembers = !this.showNonEmployeeMembers;
        if(this.showNonEmployeeMembers) {
            this.editDetails=true;
            this.editClass="committeeBox";
        }
        this.rolodexId = rolodexIdFromService;
    }

    showMembersTab( event: any, personIdFromService ) {
        event.preventDefault();
        this.rolodexId = null;
        this.showNonEmployeeMembers=false;
        this.showMembers = !this.showMembers;
        if(this.showMembers) {
            this.editDetails=true;
            this.editClass="committeeBox";
        }
        this.personId = personIdFromService;
    }

    addMemberDiv( event: any ) {
        event.preventDefault();
        this.showAddMember = !this.showAddMember;
    }

    addMember() {
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
        } );
        this.searchTextModel=' ';
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
}
