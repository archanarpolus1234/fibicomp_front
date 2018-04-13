import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Constants } from "../constants/constants.service";

@Injectable()
export class GrantService {

  constructor(private http: HttpClient, private constants: Constants) { }

  createGrantCall(){
      return this.http.post(this.constants.createGrandCalls,{})
  }
}
