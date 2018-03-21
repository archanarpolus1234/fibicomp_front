
import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { Constants } from '../../constants/constants.service';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AwardReportsAndTermsService {
    awardId: any;

    constructor( private http: HttpClient, private constant: Constants, private route: ActivatedRoute ) { }

    getAwardReportsAndTerms() {
        this.awardId = this.route.snapshot.queryParamMap.get( 'awardId' );
        let params = { 'awardId': this.awardId };
        return this.http.post( this.constant.awardTermsAndReportsUrl, params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
}
