import { Component, OnInit } from '@angular/core';
import { CommitteCreateEditService } from '../committee-create-edit.service';
import { CompleterService, CompleterData } from 'ng2-completer';
import { ActivatedRoute, Router } from '@angular/router';

@Component( {
    selector: 'app-committee-members',
    templateUrl: './committee-members.component.html',
    styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
} )

export class CommitteeMembersComponent implements OnInit {
    memberType;
    addRole: boolean = false;
    editRole: boolean = false;
    addExpertise: boolean = false;
    showMembers: boolean = false;
    showAddMember: boolean = false;
    roleAdded = 0;
    committeeId;
    editDetails: boolean = false;
    editClass = "committeeBox";
    mode;
    memberSearchInput: any = {};
    roleSearchInput: any = {};
    expertiseSearchInput: any = {};
    employeeId;
    personId;
    personIdFromService;
    memberList: any = {};
    memberListtoView: any = {};
    membershipRoleList: any = {};
    membershipRoleListtoView: any = {};
    memberListLoaded: any = {};
    employeeFlag;
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
    selectedExpertise;
    selectedRole;
    currentUser = localStorage.getItem( 'currentUser' );

    constructor( public route: ActivatedRoute, public completerService: CompleterService, public committeCreateEditService: CommitteCreateEditService ) {
        this.mode = this.route.snapshot.queryParamMap.get( 'mode' );
        this.committeeId = this.route.snapshot.queryParamMap.get( 'id' );
        this.committeCreateEditService.loadCommitteeById( this.committeeId ).subscribe( data => {
            this.resultLoadedById = data;
            if ( this.resultLoadedById != null ) {
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

    initialLoad() {
        this.committeCreateEditService.getCommitteeData( '1' )
            .subscribe( data => {
                this.result = data;
                if ( this.result != null ) {
                    this.employees = this.result.employees;
                    this.non_employees = this.result.nonEmployees;
                    this.membershipRoles = this.result.membershipRoles;
                    this.membershipExpertise = this.result.researchAreas;
                    this.dataServiceMemberList = this.completerService.local( this.employees, 'fullName', 'fullName' );
                    this.dataServiceRoleList = this.completerService.local( this.membershipRoles, 'description', 'description' );
                    this.dataServiceExpertiseList = this.completerService.local( this.membershipExpertise, 'description', 'description' );
                }
            } );
        if ( this.mode == 'view' ) { } else {
            this.editDetails = true;
        }
    }

    showEditDetails() {
        this.editDetails = !this.editDetails;
        if ( this.editDetails ) {
            this.editClass = 'committeeBox';
        }
    }

    memberTypeChange( member, types ) {
        for ( let membertype of this.memberList.committeeMembershipTypes ) {
            if ( membertype.description == types ) {
                var d = new Date();
                var timestamp = d.getTime();
                member.committeeMembershipType = membertype;
                member.membershipTypeCode = membertype.membershipTypeCode;
            }
        }
    }

    saveDetails() {
        this.editDetails = !this.editDetails;
        this.editClass = 'committeeBoxNotEditable';
        var currentDate = new Date();
        var currentTime = currentDate.getTime();
        for ( let member of this.resultLoadedById.committee.committeeMemberships ) {
            member.updateUser = this.currentUser;
            member.updateTimestamp = currentTime;
        }
        this.sendMemberObject = {};
        this.sendMemberObject.committee = this.resultLoadedById.committee;
        for ( let member of this.sendMemberObject.committee.committeeMemberships ) {
            delete member['active'];
        }
        this.committeCreateEditService.saveCommitteeMembers( this.sendMemberObject ).subscribe( data => {
            this.saveResult = data;
            this.resultLoadedById.committee = this.saveResult.committee;
        } );
    }

    cancelEditDetails() {
        this.editDetails = !this.editDetails;
        if ( !this.editDetails ) {
            this.editClass = 'committeeBoxNotEditable';
        }
    }

    addRoles( $event ) {
        event.preventDefault();
        this.addRole = true;
        this.editRole = true;
    }

    saveRole() {
        this.addRole = false;
        this.editRole = false;
    }

    cancelRole() {
        this.addRole = false;
        this.editRole = false;
    }
    editRoles() {

        this.editRole = true;
    }

    roleAddtoTable( member ) {
        var flag: boolean = false;
        if ( member.committeeMemberRoles.length == 0 ) {
            member.committeeMemberRoles.push( this.memberRoleObject );
        } else {
            for ( let role of member.committeeMemberRoles ) {
                if ( role.membershipRoleDescription == this.selectedRole ) {
                    flag = true;
                }
            }
            if ( flag == false ) {
                member.committeeMemberRoles.push( this.memberRoleObject );
            }
        }
    }

    expertiseAddtoTable( member ) {
        zvar flag: boolean = false;
        if ( member.committeeMemberExpertises.length == 0 ) {
            member.committeeMemberExpertises.push( this.memberExpertiseObject );
        } else {
            for ( let expertise of member.committeeMemberExpertises ) {
                if ( expertise.researchAreaDescription == this.selectedExpertise ) {
                    flag = true;
                }
            }
            if ( flag == false ) {
                member.committeeMemberExpertises.push( this.memberExpertiseObject );
            }
        }
    }


    deleteRole( description ) {
    }

    addExpertises( $event ) {
        event.preventDefault();
        this.addExpertise = !this.addExpertise;
    }

    showMembersTab( $event, personIdFromService ) {
        event.preventDefault();
        this.showMembers = !this.showMembers;
        this.personId = personIdFromService;
    }

    addMemberDiv( $event ) {
        $event.preventDefault();
        this.showAddMember = !this.showAddMember;
    }

    addMember() {
        this.committeCreateEditService.addMember( this.memberSearchInput.personId, this.committeeId ).subscribe( data => {
            this.memberList = data;
            var length = this.memberList.committee.committeeMemberships.length;
            for ( let membertype of this.memberList.committeeMembershipTypes ) {
                if ( membertype.description == 'Non-voting member' ) {
                    this.memberList.committee.committeeMemberships[length - 1].committeeMembershipType = membertype;
                    this.memberList.committee.committeeMemberships[length - 1].membershipTypeCode = membertype.membershipTypeCode;
                }
            }
            this.resultLoadedById.committee.committeeMemberships = this.memberList.committee.committeeMemberships;
            this.memberExist = true;
        } );
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