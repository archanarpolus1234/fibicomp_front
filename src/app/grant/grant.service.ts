import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Constants } from "../constants/constants.service";
import { HttpHeaders } from  '@angular/common/http';

@Injectable()
export class GrantService {
  formData = new FormData();
  constructor(private http: HttpClient, private constants: Constants) { }

  createGrantCall(){
      return this.http.post(this.constants.createGrantCalls,{})
  }

  saveGrantCall(grantCallObject,newAttachments,type,uploadedFile) {
    var sendObject = {
      grantCall :grantCallObject,
      updateType :type,
    }
    return this.http.post(this.constants.saveUpdateGrantCall,sendObject)
  }

  fetchSponsorsBySponsorType(code) {
    var params = {
      sponsorTypeCode : code
    }
    return this.http.post(this.constants.fetchSponsorsBySponsorType,params)
  }

  loadGrantById(grantCallId) {
    var params = {
      grantCallId: grantCallId
    }
    return this.http.post(this.constants.loadGrantCallById,params)
  }

  deleteGrantCallKeyword(grantCallId,grantKeywordId) {
    var params = {
      grantCallId : grantCallId,
      grantKeywordId : grantKeywordId
    }
    return this.http.post(this.constants.deleteGrantCallKeyword,params)
  }

  deleteGrantCallContact(grantCallId,grantContactId) {
    var params = {
      grantCallId : grantCallId,
      grantContactId : grantContactId
    }
    return this.http.post(this.constants.deleteGrantCallContact,params)
  }

  deleteGrantCallAreaOfResearch(grantCallId,grantResearchAreaId) {
    var params = {
      grantCallId : grantCallId,
      grantResearchAreaId : grantResearchAreaId
    }
    return this.http.post(this.constants.deleteGrantCallAreaOfResearch,params)
  }

  deleteGrantCallEligibility(grantCallId,grantEligibilityId) {
    var params = {
      grantCallId : grantCallId,
      grantEligibilityId : grantEligibilityId
    }
    return this.http.post(this.constants.deleteGrantCallEligibility,params)
  }

  addGrantCallAttachment(grantCallObject,newAttachment,uploadedFile) {

    this.formData.delete( 'files' );
    this.formData.delete( 'formDataJson' );
    
    for ( var i = 0; i < uploadedFile.length; i++ ) {
      this.formData.append( 'files', uploadedFile[i] );
  }
  var sendObject = {
    grantCall :grantCallObject,
    newAttachment :newAttachment,
    
  }
  this.formData.append( 'formDataJson', JSON.stringify( sendObject ) );
  return this.http.post(this.constants.addGrantCallAttachment,this.formData)
  }
  deleteGrantCallAttachment(grantCallId,attachmentId) {
    var params = {
      grantCallId : grantCallId,
      attachmentId : attachmentId
    }
    return this.http.post(this.constants.deleteGrantCallAttachment,params)
  }

  downloadAttachment(attachmentId) {
    return this.http.get( this.constants.downloadGrantCallAttachment, { 
      headers: new HttpHeaders().set('attachmentId',attachmentId.toString()),
      responseType:'blob'
  } );
  }

  publishCall(grantCallObject) {
    var params = {
      grantCall: grantCallObject
    }
    return this.http.post(this.constants.publishGrantCall,params)
  }
}
