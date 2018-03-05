import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Constants } from "../../constants/constants.service";
import { Observable } from "rxjs";

@Injectable()
export class ScheduleHomeService {

  constructor( private http: Http, private constant: Constants ) { }
  
  saveScheduleData( scheduleObj: Object ): Observable<JSON> {
      return this.http.post( this.constant.updateSchedule, scheduleObj )
          .map( res => res.json()
          )
          .catch( error => {
              console.error( error.message || error );
              return Observable.throw( error.message || error )
          } );
  }
}
