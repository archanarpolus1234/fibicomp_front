import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class ProposalCreateEditService {
    formData = new FormData();
    approveFormData = new FormData();
    constructor( private http: HttpClient, private constant: Constants ) {

    }

    loadCreateProposalData( object: Object ): Observable<JSON> {
        return this.http.post( this.constant.createProposalUrl, object )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    addProposalAttachment( proposalObject, newAttachment, uploadedFile ) {
        this.formData.delete( 'files' );
        this.formData.delete( 'formDataJson' );

        for ( var i = 0; i < uploadedFile.length; i++ ) {
            console.log( "item->", i + 1, uploadedFile[i].name )
            this.formData.append( 'files', uploadedFile[i] );
        }
        var sendObject = {
            proposal: proposalObject,
            newAttachment: newAttachment,

        }
        this.formData.append( 'formDataJson', JSON.stringify( sendObject ) );
        return this.http.post( this.constant.addProposalAttachment, this.formData )
    }

    deleteProposalAttachment( proposalId, attachmentId ) {
        var params = {
            proposalId: proposalId,
            attachmentId: attachmentId
        }
        return this.http.post( this.constant.deleteProposalAttachment, params )
    }

    saveProposal( proposalObject, type ): Observable<JSON> {
        var sendObject = {
            proposal: proposalObject,
            updateType: type,
        }
        return this.http.post( this.constant.saveOrUpdateProposal, sendObject )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    downloadProposalAttachment( attachmentId ) {
        return this.http.get( this.constant.downloadProposalAttachment, {
            headers: new HttpHeaders().set( 'attachmentId', attachmentId.toString() ),
            responseType: 'blob'
        } );
    }

    deleteProposalResearchArea( proposalId, researchAreaId ) {
        var params = {
            proposalId: proposalId,
            researchAreaId: researchAreaId
        }
        return this.http.post( this.constant.deleteProposalResearchArea, params )
    }

    deleteIrbProtocol( proposalId, irbProtocolId ) {
        var params = {
            proposalId: proposalId,
            irbProtocolId: irbProtocolId
        }
        return this.http.post( this.constant.deleteIrbProtocol, params )
    }

    deleteProposalSponsor( proposalId, sponsorId ) {
        var params = {
            proposalId: proposalId,
            sponsorId: sponsorId
        }
        return this.http.post( this.constant.deleteProposalSponsor, params )
    }

    deleteProposalPerson( proposalId, personId ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            proposalPersonId: personId
        }
        return this.http.post( this.constant.deleteProposalPersonUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteBudget( proposalId, budgetId ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            budgetId: budgetId
        }
        return this.http.post( this.constant.deleteBudgetUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    deleteProposalKeyword( proposalId, keywordId ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            keywordId: keywordId
        }
        return this.http.post( this.constant.deleteProposalKeywordUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    fetchCostElementData( budgetCategoryCode ): Observable<JSON> {
        var params = {
            budgetCategoryCode: budgetCategoryCode
        }
        return this.http.post( this.constant.fetchCostElementUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    loadProposalById( proposalId, personId, currentUser ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            personId: personId,
            userName: currentUser
        }
        return this.http.post( this.constant.loadProposalById, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    submitProposal( proposal: Object, userName, proposalStatusCode ): Observable<JSON> {
        var params = {
            proposal: proposal,
            userName: userName,
            proposalStatusCode: proposalStatusCode
        }
        return this.http.post( this.constant.submitProposalUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    approveDisapproveProposal( sendObject: Object, uploadedFile ): Observable<JSON> {
        this.approveFormData.delete( 'files' );
        this.approveFormData.delete( 'formDataJson' );

        for ( var i = 0; i < uploadedFile.length; i++ ) {
            this.approveFormData.append( 'files', uploadedFile[i] );
        }
        this.approveFormData.append( 'formDataJson', JSON.stringify( sendObject ) );
        return this.http.post( this.constant.approveRejectProposalUrl, this.approveFormData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    downloadRoutelogAttachment( attachmentId ) {
        return this.http.get( this.constant.downloadRoutelogAttachmentUrl, {
            headers: new HttpHeaders().set( 'attachmentId', attachmentId.toString() ),
            responseType: 'blob'
        } );
    }
    
    assignReviewer( proposal: Object, proposalId: string, userName: string ) {
        var params = {
                proposal: proposal,
                proposalId: proposalId,
                userName: userName
        }
        return this.http.post( this.constant.addReviewerUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
    
    completeReviewAction( sendObject: Object, uploadedFile) {
        this.approveFormData.delete( 'files' );
        this.approveFormData.delete( 'formDataJson' );

        for ( var i = 0; i < uploadedFile.length; i++ ) {
            this.approveFormData.append( 'files', uploadedFile[i] );
        }
        this.approveFormData.append( 'formDataJson', JSON.stringify( sendObject ) );
        return this.http.post( this.constant.completeReviewUrl, this.approveFormData )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
}
