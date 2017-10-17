import {Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {DisclosureelasticsearchService} from '../elasticSearch/disclosureelasticsearch.service';
import {
    FormGroup,
    FormControl,
    FormControlName
} from '@angular/forms';
@Component({
  selector: 'app-disclosure-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css',
              '../../assets/css/font-awesome.min.css',
              '../../assets/css/style.css',
              '../../assets/css/search.css'],
  providers: [DisclosureelasticsearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisclosureQuickSearchComponent implements AfterViewInit  {

  @Output()
  found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();
  seachTextModel: string;
  active = false;
  message = '';
  _results: Subject<Array<any>> = new Subject<Array<any>>();
  seachText: FormControl = new FormControl('');
  constructor(private es: DisclosureelasticsearchService, private _ngZone: NgZone) {
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
                                      let coi_disclosure_id: string = hits_source[j].coi_disclosure_id;
                                      let full_name: string = hits_source[j].full_name;
                                      let disclosure_disposition: string = hits_source[j].disclosure_disposition;
                                      let disclosure_status: string = hits_source[j].disclosure_status;
                                      let module_item_key: string = hits_source[j].module_item_key;
                                      let test = hits_source[j];
                                      let all ;
                                      if (typeof(hits_highlight[j].coi_disclosure_id) !== 'undefined') {
                                        coi_disclosure_id = hits_highlight[j].coi_disclosure_id;
                                      }
                                      if (typeof(hits_highlight[j].full_name) !== 'undefined') {
                                        full_name = hits_highlight[j].full_name;
                                      }
                                      if (typeof(hits_highlight[j].disclosure_disposition) !== 'undefined') {
                                        disclosure_disposition = hits_highlight[j].disclosure_disposition;
                                      }
                                      if (typeof(hits_highlight[j].disclosure_status) !== 'undefined') {
                                        disclosure_status = hits_highlight[j].disclosure_status;
                                      }
                                      if (typeof(hits_highlight[j].module_item_key) !== 'undefined') {
                                        module_item_key = hits_highlight[j].module_item_key;
                                      }
                                      
                                      results.push({
                                        label: coi_disclosure_id + '  :  '
                                        + '  |  ' + full_name
                                        + '  |  ' + disclosure_disposition + '  |  '
                                        + disclosure_status + '  |  '
                                        + module_item_key, 
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

