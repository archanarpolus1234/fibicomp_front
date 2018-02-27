import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule,RequestOptions,Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Constants } from '../../../constants/constants.service';

@Injectable()
export class ScheduleAttachmentsService {
    formData = new FormData();
    constructor( private http: Http, private constant: Constants ) {

    }

    public addAttachments( scheduleId,newCommitteeScheduleAttachment: Object,attachmentTypeCode,uploadedFile,Description,currentUser ): Observable<JSON> {
            this.formData.delete('file');
            this.formData.delete('formDataJson');
            for(var i=0;i<uploadedFile.length;i++) {
            	this.formData.append('files',uploadedFile[i]);
            }
            var sendObject={
                    scheduleId: scheduleId,
                    newCommitteeScheduleAttachment: newCommitteeScheduleAttachment    
               }
            this.formData.append('formDataJson',JSON.stringify(sendObject));
        return this.http.post( this.constant.addScheduleAttachment, this.formData)
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    public deleteAttachments( scheduleId,committeeId,commScheduleAttachId ): Observable<JSON> {
      var params={
              committeeId:committeeId,
              scheduleId:scheduleId,
              commScheduleAttachId:commScheduleAttachId
      }
    return this.http.post( this.constant.deleteScheduleAttachment, params)
        .map( res => res.json() )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
	}
}
