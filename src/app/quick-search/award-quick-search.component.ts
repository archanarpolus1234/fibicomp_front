import {Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {AwardelasticsearchService} from '../elasticSearch/awardelasticsearch.service';
import {
    FormGroup,
    FormControl,
    FormControlName
} from '@angular/forms';

@Component({
  selector: 'app-award-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css',
              '../../assets/css/font-awesome.min.css',
              '../../assets/css/style.css',
              '../../assets/css/search.css'],
  providers: [AwardelasticsearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AwardQuickSearchComponent implements AfterViewInit {
  @Output()
  found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();
  seachTextModel: string;
  active = false;
  message = '';
  _results: Subject<Array<any>> = new Subject<Array<any>>();
  seachText: FormControl = new FormControl('');
  constructor(private es: AwardelasticsearchService, private _ngZone: NgZone) {
   this._results.subscribe((res) => {
            this.found.emit(res);
        });
  }

  ngAfterViewInit() {
        this.seachText
            .valueChanges
            .map((text: any) => text ? text.trim() : '')                                             // ignore spaces
            .do(searchString => searchString ? this.message = 'searching...' : this.message = '')
            .debounceTime(500)                                                                      // wait when input completed
            .distinctUntilChanged()
            .switchMap(searchString => {
              console.log(this.seachText); debugger;
               return new Promise<Array<String>>((resolve, reject) => {
                    this._ngZone.runOutsideAngular(() => {
                                // perform search operation outside of angular boundaries
                        this.es.search(searchString)
                            .then((searchResult) => {
                                this._ngZone.run(() => {
                                    const hits_source: Array<any> = ((searchResult.hits || {}).hits || [])
                                         .map((hit) => hit._source);
                                    const hits_highlight: Array<any> = ((searchResult.hits || {}).hits || [])
                                         .map((hit) => hit.highlight);
                                    const hits_out: Array<any> = [];
                                    let results: Array<any> = [];
                                    hits_source.forEach((elmnt, j) => {
                                      let awardNumber: string = hits_source[j].award_number;
                                      let awardNumberVal: string = awardNumber;
                                      let title: string = hits_source[j].title;
                                      let account_number: string = hits_source[j].account_number;
                                      let pi_name: string = hits_source[j].pi_name;
                                      let lead_unit_name: string = hits_source[j].lead_unit_name;
                                      let lead_unit_number: string = hits_source[j].lead_unit_number;
                                      let test = hits_source[j];
                                      let all ;
                                      if (typeof(hits_highlight[j].award_number) !== 'undefined') {
                                        awardNumber = hits_highlight[j].award_number;
                                      }
                                      if (typeof(hits_highlight[j].title) !== 'undefined') {
                                        title = hits_highlight[j].title;
                                      }
                                      if (typeof(hits_highlight[j].account_number) !== 'undefined') {
                                        account_number = hits_highlight[j].account_number;
                                      }
                                      if (typeof(hits_highlight[j].pi_name) !== 'undefined') {
                                        pi_name = hits_highlight[j].pi_name;
                                      }
                                      if (typeof(hits_highlight[j].lead_unit_name) !== 'undefined') {
                                        lead_unit_name = hits_highlight[j].lead_unit_name;
                                      }
                                      if (typeof(hits_highlight[j].lead_unit_number) !== 'undefined') {
                                        lead_unit_number = hits_highlight[j].lead_unit_number;
                                      }
                                      results.push({
                                        label: awardNumber + '  :  ' + account_number
                                        + '  |  ' + pi_name
                                        + '  |  ' + title + '  |  '
                                        + lead_unit_number + '  |  '
                                        + lead_unit_name,
                                        value: awardNumberVal,
                                        obj: test });
                                    });
                                    if (results.length > 0) {
                                        this.message = '';
                                        console.log(results);
                                  }
                                    else {
                                        if (this.seachTextModel && this.seachTextModel.trim()){
                                            this.message = 'nothing was found';
                                      }
                                    }
                                    resolve(results);
                                });
                            })
                            .catch((error) => {
                                this._ngZone.run(() => {
                                    reject(error);
                                });
                            });
                    });
                });
            })
            .catch(this.handleError)
            .subscribe(this._results);
    }


    resutSelected(result) {
        this.selected.next(result);
        this.active = !this.active;
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

}
