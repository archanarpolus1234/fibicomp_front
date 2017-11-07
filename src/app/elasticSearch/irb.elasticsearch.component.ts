import {Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { FormGroup, FormControl,  FormControlName } from '@angular/forms';

import {IrbElasticsearchService} from '../elasticSearch/irb.elasticsearch.service';

@Component({
  selector: 'app-irb-elastic-search',
  templateUrl: './elasticsearch.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css',
              '../../assets/css/font-awesome.min.css',
              '../../assets/css/style.css',
              '../../assets/css/search.css'],
  providers: [IrbElasticsearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class IrbElasticSearchComponent implements AfterViewInit  {
    
  @Output()
  found: EventEmitter <Array <any>> = new EventEmitter <Array <any>>();
  
  @Output()
  selected: EventEmitter <any> = new EventEmitter <any>();
  
  @Output() messageEvent = new EventEmitter <boolean>();
  
  resultCardView: boolean = false;
  iconClass: string = 'fa fa-search';
  seachTextModel: string;
  active = false;
  message = '';
  _results: Subject <Array<any>> = new Subject <Array <any>>();
  seachText: FormControl = new FormControl('');
  placeText: string = 'Search: Protocol#, Title, PI Name, Lead Unit, Protocol Type';
  personId: string = localStorage.getItem('personId');
  
  constructor( private es: IrbElasticsearchService, private _ngZone: NgZone ) {
   this._results.subscribe(( res ) => {
            this.found.emit(res);
        });
  }

  ngAfterViewInit() {
        this.seachText
            .valueChanges
            .map((text: any) => text ? text.trim() : '')                                             
            .do(searchString => searchString ? this.message = 'searching...' : this.message = '')
            .debounceTime( 500 )                                                                      
            .distinctUntilChanged()
            .switchMap( searchString => {
               return new Promise<Array<String>>((resolve, reject) => {
                    this._ngZone.runOutsideAngular(() => {
                        this.es.search( searchString, this.personId )
                            .then(( searchResult ) => {
                                this._ngZone.run(() => {
                                    const hits_source: Array<any> = ((searchResult.hits || {}).hits || [])
                                         .map((hit) => hit._source);
                                    const hits_highlight: Array<any> = ((searchResult.hits || {}).hits || [])
                                         .map((hit) => hit.highlight);
                                    const hits_out: Array <any> = [];
                                    let results: Array <any> = [];
                                
                                    hits_source.forEach((elmnt, j) => {
                                          let protocol_id: string = hits_source[j].protocol_id;
                                          let protocol_number: string = hits_source[j].protocol_number;
                                          let title: string = hits_source[j].title;
                                          let lead_unit: string = hits_source[j].lead_unit_name;
                                          let unit_number: string = hits_source[j].lead_unit_number;
                                          let protocol_type: string = hits_source[j].protocol_type;
                                          let test = hits_source[j];
                                          let all ;
                                          if ( typeof( hits_highlight[j].protocol_id) !== 'undefined' )  {
                                              protocol_id = hits_highlight[j].protocol_id;
                                          }
                                          if ( typeof( hits_highlight[j].protocol_number) !== 'undefined' )  {
                                              protocol_number = hits_highlight[j].protocol_number;
                                          }
                                          if ( typeof( hits_highlight[j].title) !== 'undefined' )  {
                                              title = hits_highlight[j].title;
                                          }
                                          if ( typeof( hits_highlight[j].lead_unit_name) !== 'undefined' )  {
                                              lead_unit = hits_highlight[j].lead_unit_name;
                                          }
                                          if ( typeof( hits_highlight[j].lead_unit_number) !== 'undefined' )  {
                                              unit_number = hits_highlight[j].lead_unit_number;
                                          }
                                          if ( typeof( hits_highlight[j].protocol_type) !== 'undefined' )  {
                                              protocol_type = hits_highlight[j].protocol_type;
                                          }
                                          results.push({
                                                    label: protocol_number + '  :  ' 
                                                    + title + '  |  ' 
                                                    + lead_unit + '  |  '
                                                    + unit_number + '  |  '
                                                    + protocol_type, 
                                                    obj: test 
                                            });
                                        });
                                    if (results.length > 0) {
                                        this.message = '';
                                    } else {
                                        if (this.seachTextModel && this.seachTextModel.trim()){
                                            this.message = 'nothing was found';
                                        }
                                    }
                                    resolve( results );
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
            .catch( this.handleError )
            .subscribe( this._results );
    }

      resutSelected( result ) {
          this.selected.next(result);
          this.active = !this.active;
          this.seachTextModel = result.obj.protocol_number;
          this.showResultDiv();
      }
    
      handleError(): any {
          this.message = 'something went wrong';
      }
    
      onSearchValueChange() {
        this.iconClass = this.seachTextModel ? 'fa fa-times' : 'fa fa-search';
        if ( this.seachTextModel === '' && this.resultCardView === true ) {
          this.hideResultDiv();
         }
      }
    
      clearsearchBox( e: any) {
        e.preventDefault();
        this.seachTextModel = '';
        if (this.resultCardView) {
            this.hideResultDiv();
        }
      }
    
      sendMessage() {
        this.messageEvent.emit(this.resultCardView);
      }
    
      hideResultDiv() {
        this.resultCardView = false;
        this.sendMessage();
      }
    
      showResultDiv() {
        this.resultCardView = true;
        this.sendMessage();
      }
}
