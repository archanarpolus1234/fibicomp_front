import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Constants } from '../constants/constants.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class ProposalCreateEditService {
    proposalMode: string;
    formData = new FormData();
    approveFormData = new FormData();
    proposalTab = new BehaviorSubject<string>('');
    proposalTabVariable = this.proposalTab.asObservable();
    proposalObject = new BehaviorSubject<any>({}); //only proposal
    proposalObjectVariable = this.proposalObject.asObservable();
    proposal: any = {}; // VO
    //proposalVariable = this.proposal.asObservable();
    proposalValidityFlag = new BehaviorSubject<boolean>(false);
    proposalValidityFlagVariable = this.proposalValidityFlag.asObservable();
    budgetData = new BehaviorSubject<any>({}); // budget header
    budgetDataVariable = this.budgetData.asObservable();
    
    constructor( private http: HttpClient, private constant: Constants ) {

    }
    
    setProposalData(proposalObject : any) { //proposal object only
        this.proposalObject.next( proposalObject );
    }
    
    getProposalData() {
        return this.proposalObject;
    }

    setProposalVO(proposalVO : any) { //whole application object
        this.proposal = proposalVO ;
    }
    
    getProposalVO() {
        return this.proposal;
    }
    
    setProposalTab(proposalTab : string) {
        this.proposalTab.next( proposalTab );
    }
    
    getProposalTab() {
        return this.proposalTab;
    }
    
    setProposalValidityFlag(proposalValidityFlag : boolean) {
        this.proposalValidityFlag.next( proposalValidityFlag );
    }
    
    getProposalValidityFlag() {
        return this.proposalValidityFlag;
    }
    
    setBudgetData(budgetData : any) {
        this.budgetData.next( budgetData );
    }
    
    getBudgetData() {
        return this.budgetData;
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

    deleteProposalSponsor( proposalId, sponsorId ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            sponsorId: sponsorId
        }
        return this.http.post( this.constant.deleteProposalSponsor, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
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

    assignReviewer( proposal: Object, loggedInWorkflowDetail: Object, proposalId: string ): Observable<JSON> {
        var params = {
                proposal: proposal,
                proposalId: proposalId,
                loggedInWorkflowDetail: loggedInWorkflowDetail
        };
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

    fetchAvailableReviewers( proposal: Object, personId: string ): Observable<JSON> {
        var params = {
                proposal: proposal,
                personId: personId
        }
        return this.http.post( this.constant.fetchReviewerUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }

    deleteAssignedReviewer( proposalId, reviewerId ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            reviewerId: reviewerId
        };
        return this.http.post( this.constant.removeAssignedReviewerUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    submitForEndorsement( proposalId, proposal ): Observable<JSON> {
        var params = {
            proposalId: proposalId,
            proposal: proposal
        };
        return this.http.post( this.constant.submitEndorsementUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    approveByProvost( proposalId, proposal, userName ): Observable<JSON> {
          var params = {
              proposalId: proposalId,
              proposal: proposal,
              userName: userName
          };
          return this.http.post( this.constant.approveByProvost, params )
              .catch( error => {
                  console.error( error.message || error );
                  return Observable.throw( error.message || error )
              } );
      }

    printProposal(proposalId) {
    return this.http.get( this.constant.printProposalUrl, {
        headers: new HttpHeaders().set( 'proposalId', proposalId.toString() ),
        responseType: 'blob'
        } );
    }
}
