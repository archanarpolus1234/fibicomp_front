import {Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {IrbelasticsearchService} from '../elasticSearch/irbelasticsearch.service';
import {
    FormGroup,
    FormControl,
    FormControlName
} from '@angular/forms';

@Component({
  selector: 'app-irb-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css',
              '../../assets/css/font-awesome.min.css',
              '../../assets/css/style.css',
              '../../assets/css/search.css'],
  providers: [IrbelasticsearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IrbQuickSearchComponent implements AfterViewInit  {

  @Output()
  found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();
  seachTextModel: string;
  active = false;
  message = '';
  _results: Subject<Array<any>> = new Subject<Array<any>>();
  seachText: FormControl = new FormControl('');
  constructor(private es: IrbelasticsearchService, private _ngZone: NgZone) {
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
                                  //debugger;
                                    hits_source.forEach((elmnt, j) => {
                                      let protocol_id: string = hits_source[j].protocol_id;
                                      let protocol_number: string = hits_source[j].protocol_number;
                                      let title: string = hits_source[j].title;
                                      let lead_unit: string = hits_source[j].lead_unit;
                                      let unit_number: string = hits_source[j].unit_number;
                                      let protocol_type: string = hits_source[j].protocol_type;
                                      let status: string = hits_source[j].status;
                                      let test = hits_source[j];
                                      let all ;
                                      if (typeof(hits_highlight[j].protocol_id) !== 'undefined') {
                                        protocol_id = hits_highlight[j].protocol_id;
                                      }
                                      if (typeof(hits_highlight[j].protocol_number) !== 'undefined') {
                                        protocol_number = hits_highlight[j].protocol_number;
                                      }
                                      if (typeof(hits_highlight[j].title) !== 'undefined') {
                                        title = hits_highlight[j].title;
                                      }
                                      if (typeof(hits_highlight[j].lead_unit) !== 'undefined') {
                                        lead_unit = hits_highlight[j].lead_unit;
                                      }
                                      if (typeof(hits_highlight[j].unit_number) !== 'undefined') {
                                        unit_number = hits_highlight[j].unit_number;
                                      }
                                      if (typeof(hits_highlight[j].protocol_type) !== 'undefined') {
                                        protocol_type = hits_highlight[j].protocol_type;
                                      }
                                      if (typeof(hits_highlight[j].status) !== 'undefined') {
                                        status = hits_highlight[j].status;
                                      }
                                      results.push({
                                        label: protocol_id + '  :  ' + protocol_number
                                        + '  |  ' + title
                                        + '  |  ' + lead_unit + '  |  '
                                        + unit_number + '  |  '
                                        + protocol_type + '  |  '
                                        + status,
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

