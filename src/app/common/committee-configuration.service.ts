import {Injectable} from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CommitteeConfigurationService {
    private committeeReviewtype = new BehaviorSubject<any[]>([]);
    currentReviewType = this.committeeReviewtype.asObservable();
    private committeeAreaOfResearch = new BehaviorSubject<any[]>([]);
    currentAreaOfResearch = this.committeeAreaOfResearch.asObservable();
    private committeeData = new BehaviorSubject<any[]>([]);
    currentCommitteeData = this.committeeData.asObservable();
    
    constructor() {
        
    }
    
    changeReviewType(review :any[]){
        this.committeeReviewtype.next(review);
    }
    
    changeAreaOfResearch(areaOfResearch :any[]){
        this.committeeAreaOfResearch.next(areaOfResearch);
    }
    
    changeCommmitteeData(data :any[]){
        this.committeeData.next(data);
    }
}
