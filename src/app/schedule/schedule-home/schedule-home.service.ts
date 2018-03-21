import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Constants } from "../../constants/constants.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ScheduleHomeService {

  constructor( private http: HttpClient, private constant: Constants ) { }
  
  saveScheduleData( scheduleObj: Object ) {
      return this.http.post( this.constant.updateSchedule, scheduleObj )
          .catch( error => {
              console.error( error.message || error );
              return Observable.throw( error.message || error )
          } );
  }
}
