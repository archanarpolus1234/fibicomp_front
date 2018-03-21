import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CommitteCreateEditService {
    constructor( private http: HttpClient, private constant: Constants ) {

    }

    getCommitteeData( committeeTypeCode: string ): Observable<JSON> {
        var params = {
            committeeTypeCode: committeeTypeCode,
        };
        return this.http.post( this.constant.committeeCreateUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    loadCommittee( committeeId: string ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
        };
        return this.http.post( this.constant.committeeViewUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    addMember( Id: string, committeeId: string, nonEmployeeFlag: boolean, committeeObj: Object ): Observable<JSON> {
        var params: any = {};
        if ( nonEmployeeFlag == true ) {
            params = {
                rolodexId: Id,
                committeeId: committeeId,
                nonEmployeeFlag: nonEmployeeFlag,
                committee: committeeObj
            };
        }
        if ( nonEmployeeFlag == false ) {
            params = {
                personId: Id,
                committeeId: committeeId,
                nonEmployeeFlag: nonEmployeeFlag,
                committee: committeeObj
            };

        }
        return this.http.post( this.constant.addCommitteeMembership, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    saveCommitteeMembers( CommiteeeObj: Object ): Observable<JSON> {
        return this.http.post( this.constant.saveCommitteeMembers, CommiteeeObj )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteRoles( commMemberRolesId: number, commMembershipId: string, committeeId: string ) {
        var params = {
            commMemberRolesId: commMemberRolesId,
            committeeId: committeeId,
            commMembershipId: commMembershipId

        };
        return this.http.post( this.constant.deleteMemberRoles, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }


    deleteExpertises( commMemberExpertiseId: number, commMembershipId: string, committeeId: string ) {
        var params = {
            commMemberExpertiseId: commMemberExpertiseId,
            committeeId: committeeId,
            commMembershipId: commMembershipId
        };
        return this.http.post( this.constant.deleteMemberExpertise, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteMember( commMembershipId: string, committeeId: string ) {
        var params = {
            committeeId: committeeId,
            commMembershipId: commMembershipId
        };
        return this.http.post( this.constant.deleteCommitteeMembers, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    saveCommMemberRole( commMembershipId: string, committeeId: string, committeeMemberRole: object ) {
        var params = {
            committeeId: committeeId,
            commMembershipId: commMembershipId,
            committeeMemberRole: committeeMemberRole
        };
        return this.http.post( this.constant.saveCommitteeMembersRole, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    saveCommMemberExpertise( commMembershipId: string, committeeId: string, committeeMemberExpertise: object ) {
        var params = {
            committeeId: committeeId,
            commMembershipId: commMembershipId,
            committeeMemberExpertise: committeeMemberExpertise
        };
        return this.http.post( this.constant.saveCommitteeMembersExpertise, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    updateMemberRoles( commMemberRolesId, committeeId, commMembershipId, role ) {
        var params = {
            commMemberRolesId: commMemberRolesId,
            committeeId: committeeId,
            commMembershipId: commMembershipId,
            committeeMemberRole: role

        };
        return this.http.post( this.constant.updateMemberRoles, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
