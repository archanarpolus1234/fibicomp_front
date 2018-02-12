import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { Constants } from '../constants/constants.service';

@Injectable()
export class CommitteCreateEditService {

    constructor( private http: Http, private constant: Constants ) {

    }
    
    getCommitteeData( committeeTypeCode: string ): Observable<JSON> {
        var params = {
            committeeTypeCode: committeeTypeCode,
        };
        return this.http.post( this.constant.committeeCreateUrl, params )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    loadCommitteeById( committeeId: string ): Observable<JSON> {
        var params = {
            committeeId: committeeId,
        };
        return this.http.post( this.constant.committeeViewUrl, params )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    addMember(personId,committeeId ): Observable<JSON> {
       var params = {
          personId: personId,
          committeeId : committeeId
        };
       return this.http.post( this.constant.addCommitteeMembership, params )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    saveCommitteeMembers(CommiteeeObj: Object) : Observable<JSON>{
        return this.http.post( this.constant.saveCommitteeMembers, CommiteeeObj )
              .map( res => res.json()
              )
              .catch( error => {
                  console.error( error.message || error );
                  return Observable.throw( error.message || error )
              } );
      }
}
