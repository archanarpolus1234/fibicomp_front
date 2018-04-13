import { Component, Injectable, Input, Output, EventEmitter } from '@angular/core'
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class ExpandedViewDataService {
    public changedSponsorCode =  new BehaviorSubject<string>("");
    sponsorCode = this.changedSponsorCode.asObservable();
    public changedPersonId  = new BehaviorSubject<string>("");
    personId = this.changedPersonId.asObservable();
    public changedPiechartIndex = new BehaviorSubject<string>("");
    piechartIndex = this.changedPiechartIndex.asObservable();
    public changedResearchSummaryIndex = new BehaviorSubject<string>("");
    researchSummaryIndex = this.changedResearchSummaryIndex.asObservable();
    public changedExpandedViewHeading = new BehaviorSubject<string>("");
    expandedViewHeading = this.changedExpandedViewHeading.asObservable();
    public changedExapandedViewAwardHeading = new BehaviorSubject<string>("");
    expandedViewAwardHeading = this.changedExapandedViewAwardHeading.asObservable();
    public changedExapandedDonutViewProposalHeading = new BehaviorSubject<string>("");
    expandedDonutViewProposalHeading = this.changedExapandedDonutViewProposalHeading.asObservable();
    public changedExapandedViewProposalHeading = new BehaviorSubject<string>("");
    expandedViewProposalHeading = this.changedExapandedViewProposalHeading.asObservable();
    public changedExapandedDonutViewAwardHeading = new BehaviorSubject<string>("");
    exapandedDonutViewAwardHeading = this.changedExapandedDonutViewAwardHeading.asObservable();
    public changedDonutChartIndex = new BehaviorSubject<string>("");
    donutChartIndex = this.changedDonutChartIndex.asObservable();
    
    
    setSponsorCode(sponsorCode : string) {
        this.changedSponsorCode.next(sponsorCode);
    }
    setPersonId(personId : string) {
        this.changedPersonId.next(personId);
    }
    setPiechartIndex(piechartIndex : string) {
        this.changedPiechartIndex.next(piechartIndex);
    }
    setResearchSummaryIndex(researchSummaryIndex : string) {
        this.changedResearchSummaryIndex.next(researchSummaryIndex);
    }
    setExpandedViewHeading(expandedViewHeading : string) {
        this.changedExpandedViewHeading.next(expandedViewHeading);
    }
    setExpandedViewAwardHeading(expandedViewAwardHeading : string) {
        this.changedExapandedViewAwardHeading.next(expandedViewAwardHeading);
    }
    setExpandedDonutViewAwardHeading(expandedDonutViewAwardHeading : string) {
        this.changedExapandedDonutViewAwardHeading.next(expandedDonutViewAwardHeading);
    }
    setExpandedDonutViewProposalHeading(expandedDonutViewProposalHeading : string) {
        this.changedExapandedDonutViewProposalHeading.next(expandedDonutViewProposalHeading);
    }
    setExpandedViewProposalHeading(expandedViewProposalHeading : string) {
        this.changedExapandedViewProposalHeading.next(expandedViewProposalHeading);
    }
    setDonutChartIndex(donutChartIndex : string) {
        this.changedDonutChartIndex.next(donutChartIndex);
    }
}


