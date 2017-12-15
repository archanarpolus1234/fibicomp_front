
import { Injectable } from '@angular/core';
import { Constants } from '../../constants/constants.service';
import { Http, HttpModule } from '@angular/http';
import { ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class  AwardReportsAndTermsService {
test: any;

constructor(private http: Http, private constant: Constants, private route: ActivatedRoute) {}

getAwardReportsAndTerms () {
	this.test = this.route.snapshot.queryParamMap.get('awardId');
	let params = {'awardId': this.test};
	return this.http.post(this.constant.awardTermsAndReportsUrl, params)
	.map( res => res.json())
	.catch( error => {
		console.error( error.message || error );
		return Observable.throw( error.message || error )
	} );
	}
}

