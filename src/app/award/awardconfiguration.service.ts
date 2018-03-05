import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class AwardconfigurationService {
    awardData = new BehaviorSubject<any>( {} );
    currentAwardData = this.awardData.asObservable();
    
    constructor() { }

    changeAwardData( awardData: any ) {
        this.awardData.next( awardData );
    }
}
