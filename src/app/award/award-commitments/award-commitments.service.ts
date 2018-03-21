import { Injectable } from '@angular/core';
import { Constants } from '../../constants/constants.service';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AwardCommitmentsService {
    constructor( private constant: Constants, private http: HttpClient ) {

    }

    loadCostsharingDetails( awardId: string ): Observable<JSON> {
        let params = { 'awardId': awardId };
        return this.http.post( this.constant.commitmentsUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}