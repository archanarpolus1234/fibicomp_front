import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Constants } from '../../constants/constants.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class ProposalBudgetService {
    
    sysGeneratedCostElementsData = new BehaviorSubject<any>({});
    sysGeneratedCostElementsDataVariable = this.sysGeneratedCostElementsData.asObservable();
    
    constructor( private http: HttpClient, private constant: Constants ) {}
    
    setSysGeneratedCostElements(sysGeneratedCostElementsData : any) {
        this.sysGeneratedCostElementsData.next( sysGeneratedCostElementsData );
    }
    
    getSysGeneratedCostElements() {
        return this.sysGeneratedCostElementsData;
    }
    
    createProposalBudget(userName, userFullName, proposal): Observable<JSON> {
        var params = {
                userName: userName,
                userFullName: userFullName,
                proposal: proposal
        };
        return this.http.post( this.constant.createProposalBudgetUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );

    }
    
    getBudgetRates(budgetId): Observable<JSON> {
        var params = {
                budgetId: budgetId
        };
        return this.http.post( this.constant.getBudgetRatesUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
    
    applyRates(userName, userFullName, proposal): Observable<JSON> {
        var params = {
                userName: userName,
                userFullName: userFullName,
                proposal: proposal
        };
        return this.http.post( this.constant.autoCalculateUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );

    }
    
    resetBudgetRates(userName, userFullName, proposal): Observable<JSON> {
        var params = {
                userName: userName,
                userFullName: userFullName,
                proposal: proposal
        };
        return this.http.post( this.constant.resetBudgetRatesUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );

    }
    
    getSyncBudgetRates(userName, userFullName, proposal): Observable<JSON> {
        var params = {
                userName: userName,
                userFullName: userFullName,
                proposal: proposal
        };
        return this.http.post( this.constant.getSyncBudgetRatesUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );

    }
    
    deleteBudgetLineItem(budgetPeriodId, budgetDetailId, createBudgetData) {
        var params = {
                budgetPeriodId: budgetPeriodId,
                budgetDetailId: budgetDetailId,
                proposal: createBudgetData 
        };
        return this.http.post( this.constant.deleteBudgetLineItemUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }
    
    deleteBudgetPeriod(budgetPeriodId, createBudgetData) {
        var params = {
                budgetPeriodId: budgetPeriodId,
                proposal: createBudgetData 
        };
        return this.http.post( this.constant.deleteBudgetPeriodUrl, params )
        .catch( error => {
            console.error( error.message || error );
            return Observable.throw( error.message || error )
        } );
    }

 }
