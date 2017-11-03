import {Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {FormGroup, FormControl, FormControlName } from '@angular/forms';

import {AwardElasticsearchService} from '../elasticSearch/award.elasticsearch.service';

@Component({
  selector: 'app-award-elastic-search',
  templateUrl: './elasticsearch.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css',
              '../../assets/css/font-awesome.min.css',
              '../../assets/css/style.css',
              '../../assets/css/search.css'],
  providers: [AwardElasticsearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AwardElasticSearchComponent implements AfterViewInit {
    
  @Output()
  found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  
  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() messageEvent = new EventEmitter<boolean>();
  
  seachTextModel: string;
  active = false;
  message = '';
  resultCardView: boolean = false;
  _results: Subject<Array<any>> = new Subject<Array<any>>();
  seachText: FormControl = new FormControl('');
  iconClass: string = 'fa fa-search';
  placeText: string = 'Search: Award#, Account#, Title, PI Name, Lead Unit';
  rolePerson: string;
  personId: string = localStorage.getItem('personId');
  
  constructor( private es: AwardElasticsearchService, private _ngZone: NgZone ) {
   this.rolePerson = localStorage.getItem( 'firstName' ) + ' ' + localStorage.getItem( 'lastName' );
   this._results.subscribe((res) => {
            this.found.emit( res );
        });
  }

  ngAfterViewInit() {
        this.seachText
            .valueChanges
            .map((text: any) => text ? text.trim() : '') 
            .do( searchString => searchString ? this.message = 'searching...' : this.message = '' )
            .debounceTime( 500 )  
            .distinctUntilChanged()
            .switchMap( searchString => {
                return new Promise <Array <String>> ((resolve, reject) => {
                    this._ngZone.runOutsideAngular(() => {
                        this.es.search( searchString, this.personId )
                            .then(( searchResult ) => {
                                this._ngZone.run(() => {
                                    
                                    const hits_source: Array<any> = ((searchResult.hits || {}).hits || [])
                                         .map((hit) => hit._source);
                                    const hits_highlight: Array<any> = ((searchResult.hits || {}).hits || [])
                                         .map((hit) => hit.highlight);
                                    const hits_out: Array<any> = [];
                                    let results: Array<any> = [];
                                
                                    hits_source.forEach((elmnt, j) => {
                                      if ( hits_source[j].pi_name === this.rolePerson ) {
                                          let awardNumber: string = hits_source[j].award_number;
                                          let title: string = hits_source[j].title;
                                          let account_number: string = hits_source[j].account_number;
                                          let pi_name: string = hits_source[j].pi_name;
                                          let lead_unit_name: string = hits_source[j].lead_unit_name;
                                          let lead_unit_number: string = hits_source[j].lead_unit_number;
                                          let test = hits_source[j];
                                          let all ;
                                          
                                          if ( typeof( hits_highlight[j].award_number ) !== 'undefined') {
                                              awardNumber = hits_highlight[j].award_number;
                                          }
                                          if ( typeof( hits_highlight[j].title ) !== 'undefined') {
                                              title = hits_highlight[j].title;
                                          }
                                          if ( typeof( hits_highlight[j].account_number ) !== 'undefined') {
                                              account_number = hits_highlight[j].account_number;
                                          }
                                          if ( typeof( hits_highlight[j].pi_name ) !== 'undefined') {
                                              pi_name = hits_highlight[j].pi_name;
                                          }
                                          if (typeof(hits_highlight[j].lead_unit_name ) !== 'undefined') {
                                              lead_unit_name = hits_highlight[j].lead_unit_name;
                                          }
                                          if ( typeof( hits_highlight[j].lead_unit_number ) !== 'undefined') {
                                              lead_unit_number = hits_highlight[j].lead_unit_number;
                                          }
                                          results.push({
                                              label: awardNumber + '  :  ' + account_number
                                              + '  |  ' + pi_name
                                              + '  |  ' + title + '  |  '
                                              + lead_unit_number + '  |  '
                                              + lead_unit_name,
                                              obj: test });
                                          }   
                                          
                                        });
                                    
                                       if ( results.length  >  0 ) {
                                           this.message = '';
                                       }
                                       else {
                                           if ( this.seachTextModel && this.seachTextModel.trim() ){
                                               this.message = 'nothing was found';
                                        }
                                    }
                                    resolve( results );
                                });
                                
                            })
                            .catch(( error ) => {
                                this._ngZone.run(() => {
                                    reject( error );
                                });
                            });
                    });
                });
            })
            .catch( this.handleError )
            .subscribe( this._results );
    }
  
  resutSelected( result ) {
      this.selected.next( result );
      this.active = !this.active;
      this.seachTextModel = result.obj.award_number;
      this.showResultDiv();
  }

  handleError(): any {
      this.message = 'something went wrong';
  }

  onSearchValueChange() {
    this.iconClass = this.seachTextModel ? 'fa fa-times' : 'fa fa-search';
    if (this.seachTextModel === '' && this.resultCardView === true) {
      this.hideResultDiv();
     }
  }

  clearsearchBox( e: any) {
    e.preventDefault();
    this.seachTextModel = '';
    if ( this.resultCardView ) {
        this.hideResultDiv();
     }
  }

  sendMessage() {
    this.messageEvent.emit( this.resultCardView );
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
