import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants/constants.service';

@Injectable()
export class CommitteeSaveService {

    constructor( private http: Http, private constant: Constants) { debugger;
        
    }
    saveCommitteeData( committeeObj:Object ): Observable<JSON> {
        var params = {
                committee:committeeObj
        };
        return this.http.post( this.constant.committeeSaveUrl, params )
            .map( res => res.json()
            )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
