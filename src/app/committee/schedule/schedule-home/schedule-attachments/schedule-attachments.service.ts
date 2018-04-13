import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpClientModule } from "@angular/common/http";
import { Constants } from "../../../../constants/constants.service";

@Injectable()
export class ScheduleAttachmentsService {
    formData = new FormData();
    constructor( private http: HttpClient, private constant: Constants, private httpReq: Http ) {

    }

    public addAttachments( scheduleId, newCommitteeScheduleAttachment: Object, attachmentTypeCode, uploadedFile, Description, currentUser ): Observable<JSON> {
        this.formData.delete( 'file' );
        this.formData.delete( 'formDataJson' );
        for ( var i = 0; i < uploadedFile.length; i++ ) {
            this.formData.append( 'files', uploadedFile[i] );
        }
        var sendObject = {
            scheduleId: scheduleId,
            newCommitteeScheduleAttachment: newCommitteeScheduleAttachment
        }
        this.formData.append( 'formDataJson', JSON.stringify( sendObject ) );
        return this.http.post( this.constant.addScheduleAttachment, this.formData )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    public deleteAttachments( scheduleId, committeeId, commScheduleAttachId ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
            scheduleId: scheduleId,
            commScheduleAttachId: commScheduleAttachId
        }
        return this.http.post( this.constant.deleteScheduleAttachment, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }

    downloadAttachment( commScheduleAttachId: string, mimeType ): Observable<any> {
        return this.http.get( this.constant.downloadAttachments, { 
            headers: new HttpHeaders().set('commScheduleAttachId', commScheduleAttachId.toString()),
            responseType:'blob'
        } );
    }

    updateScheduleAttachments(committeeId: string,scheduleId: number,newCommitteeScheduleAttachment: Object): Observable<JSON> {
        var params = {
                committeeId: committeeId,
                scheduleId: scheduleId,
                newCommitteeScheduleAttachment: newCommitteeScheduleAttachment
        };
        return this.http.post( this.constant.updateScheduleAttachments, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
