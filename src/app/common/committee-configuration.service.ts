import {Injectable} from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class CommitteeConfigurationService {
    private committeeMode = new BehaviorSubject<string>("");
    currentMode = this.committeeMode.asObservable(); 
    private committeeAreaOfResearch = new BehaviorSubject<any[]>([]);
    currentAreaOfResearch = this.committeeAreaOfResearch.asObservable();
    private committeeData = new BehaviorSubject<any[]>([]);
    currentCommitteeData = this.committeeData.asObservable();
    
    constructor() {
        
    }
    
    changeMode(mode :string){
        this.committeeMode.next(mode);
    }
    
    changeAreaOfResearch(areaOfResearch :any[]){
        this.committeeAreaOfResearch.next(areaOfResearch);
    }
    
    changeCommmitteeData(data :any[]){
        this.committeeData.next(data);
    }
}
