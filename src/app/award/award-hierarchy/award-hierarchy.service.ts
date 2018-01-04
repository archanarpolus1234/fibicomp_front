import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { Constants } from '../../constants/constants.service';

@Injectable()
export class AwardHierarchyService {
    private currentab = new BehaviorSubject<string>( "award_home" );
    currentvalue = this.currentab.asObservable();

    constructor( private http: Http, private constant: Constants ) { }

    loadAwardHierarchy( awardNumber: string, selectedAwardNumber: string ): Observable<JSON> {
        var params = {
            awardNumber: awardNumber,
            selectedAwardNumber: selectedAwardNumber
        };

        return this.http.post( this.constant.awardHierarchyUrl, params )
            .map( res => res.json() )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );

    }
    changeCurrenttab( tab: string ) {
        this.currentab.next( tab );
    }
}
