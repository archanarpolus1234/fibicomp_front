import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { SessionManagementService } from '../session/session-management.service';
import { Constants } from '../constants/constants.service';

@Injectable()
export class AwardconfigurationService {
    awardData = new BehaviorSubject<any>( {} );
    currentAwardData = this.awardData.asObservable();
    
    constructor( private http: HttpClient, private sessionService: SessionManagementService, private constant: Constants ) { }

    changeAwardData( awardData: any ) {
        this.awardData.next( awardData );
    }
    
    createProjectVariationRequest(serviceRequest): Observable<JSON> {
        
        var params = {
                serviceRequest: serviceRequest,
                isUnitAdmin: localStorage.getItem('isAdmin'),
                personId: localStorage.getItem( 'personId' )
        };
        return this.http.post( this.constant.projectVariationRequestUrl, params)
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error )
            } );
    }
    
    viewTemplate(categoryCode, serviceTypeCode): Observable<JSON> {
        var params = {
                categoryCode: categoryCode,
                serviceTypeCode: serviceTypeCode
        };
        return this.http.post( this.constant.viewTemplateUrl, params)
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
    
    getContractAdmin(unitNumber): Observable<JSON> {
        var params = {
                unitNumber: unitNumber
        };
        return this.http.post( this.constant.getContractAdminUrl, params)
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
    
    submitOSTDetails(serviceRequest,moduleCode, moduleItemKey): Observable<JSON> {
        var params = {
                serviceRequest: serviceRequest,
                isUnitAdmin: localStorage.getItem('isAdmin'),
                personId: localStorage.getItem( 'personId' ),
                userName: localStorage.getItem( 'currentUser' ),
                moduleCode: moduleCode,
                moduleItemKey: moduleItemKey
        };
        return this.http.post( this.constant.submitOSTDetailsUrl, params)
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
}
