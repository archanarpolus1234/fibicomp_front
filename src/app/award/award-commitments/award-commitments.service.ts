import { Injectable } from '@angular/core';
import { Constants } from '../../constants/constants.service';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class AwardCommitmentsService {
    constructor( private constant: Constants, private http: Http ) {

    }

    loadCostsharingDetails( awardId: string ): Observable<JSON> {
        let params = { 'awardId': awardId };
        return this.http.post( this.constant.commitmentsUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}