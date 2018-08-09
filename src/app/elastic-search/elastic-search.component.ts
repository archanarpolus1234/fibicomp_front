import { Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { AwardElasticsearchService } from './award-elastic-search.service';
import { DisclosureElasticsearchService } from './disclosure-elastic-search.service';
import { IacucElasticsearchService } from './iacuc-elastic-search.service';
import { IrbElasticsearchService } from './irb-elastic-search.service';
import { ProposalElasticsearchService } from "./proposal-elastic-search.service";

@Component( {
    selector: 'app-elastic-search',
    templateUrl: './elastic-search.component.html',
    styleUrls: ['../../assets/css/bootstrap.min.css',
        '../../assets/css/font-awesome.min.css',
        '../../assets/css/style.css',
        '../../assets/css/search.css'],
    providers: [AwardElasticsearchService],
    changeDetection: ChangeDetectionStrategy.OnPush
} )

export class ElasticSearchComponent implements AfterViewInit {

    @Output()
    found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();

    @Output()
    selected: EventEmitter<any> = new EventEmitter<any>();

    @Output() messageEvent = new EventEmitter<boolean>();

    @Input() tabPosition: string;
    
    @Input() placeText: string;
    seachTextModel: string;
    active = false;
    message = '';
    resultCardView: boolean = false;
    _results: Subject<Array<any>> = new Subject<Array<any>>();
    seachText: FormControl = new FormControl( '' );
    iconClass: string = 'fa fa-search';
    rolePerson: string;
    personId: string = localStorage.getItem( 'personId' );
    isAdmin: string = localStorage.getItem('isAdmin');

    constructor( private es: AwardElasticsearchService, private ps: ProposalElasticsearchService,
        private irb: IrbElasticsearchService, private iacuc: IacucElasticsearchService,
        private dis: DisclosureElasticsearchService, private _ngZone: NgZone ) {
        this.rolePerson = localStorage.getItem( 'firstName' ) + ' ' + localStorage.getItem( 'lastName' );
        this._results.subscribe(( res ) => {
            this.found.emit( res );
        } );
    }

    ngAfterViewInit() {
        this.seachText
            .valueChanges
            .map(( text: any ) => text ? text.trim() : '' )
            .do( searchString => searchString ? this.message = 'searching...' : this.message = '' )
            .debounceTime( 500 )
            .distinctUntilChanged()
            .switchMap( searchString => {
                return new Promise<Array<String>>(( resolve, reject ) => {
                    this._ngZone.runOutsideAngular(() => {
                        var hits_source: Array<any> = [];
                        var hits_highlight: Array<any> = [];
                        var hits_out: Array<any> = [];
                        var results: Array<any> = [];
                        var awardNumber: string;
                        var title: string;
                        var account_number: string;
                        var pi_name: string;
                        var lead_unit_name: string;
                        var lead_unit_number: string;
                        var test;
                        var all;
                        var documentNo;
                        var proposalNo: string;
                        var sponsor: string;
                        var statusCode: string;
                        var personName: string;
                        var protocol_id: string;
                        var protocol_number: string;
                        var title: string;
                        var lead_unit: string;
                        var unit_number: string;
                        var protocol_type: string;
                        var lead_unit_number: string;
                        var full_name: string;
                        var disclosure_number: string;
                        var disclosure_disposition: string;
                        var disclosure_status: string;
                        var module_item_key: string;
                        
                        /*ELASTIC SEARCH FOR AWARDS*/
                        if ( this.tabPosition == 'AWARD' ) {
                            this.es.search( searchString, this.personId )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {

                                        hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        hits_source.forEach(( elmnt, j ) => {
                                            if( hits_source[j].pi_name === this.rolePerson || this.isAdmin === 'true' ) {
                                                awardNumber = hits_source[j].award_number;
                                                title = hits_source[j].title;
                                                account_number = hits_source[j].account_number;
                                                pi_name = hits_source[j].pi_name;
                                                lead_unit_name = hits_source[j].lead_unit_name;
                                                lead_unit_number = hits_source[j].lead_unit_number;
                                                sponsor = hits_source[j].sponsor;
                                                test = hits_source[j];
                                                
                                                if ( typeof ( hits_highlight[j].award_number ) !== 'undefined' ) {
                                                    awardNumber = hits_highlight[j].award_number;
                                                }
                                                if ( typeof ( hits_highlight[j].title ) !== 'undefined' ) {
                                                    title = hits_highlight[j].title;
                                                }
                                                if ( typeof ( hits_highlight[j].account_number ) !== 'undefined' ) {
                                                    account_number = hits_highlight[j].account_number;
                                                }
                                                if ( typeof ( hits_highlight[j].pi_name ) !== 'undefined' ) {
                                                    pi_name = hits_highlight[j].pi_name;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_name ) !== 'undefined' ) {
                                                    lead_unit_name = hits_highlight[j].lead_unit_name;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_number ) !== 'undefined' ) {
                                                    lead_unit_number = hits_highlight[j].lead_unit_number;
                                                }
                                                if ( typeof ( hits_highlight[j].sponsor ) !== 'undefined' ) {
                                                    sponsor = hits_highlight[j].sponsor;
                                                }
                                                results.push( {
                                                    label: awardNumber + '  :  ' + account_number
                                                    + '  |  ' + title 
                                                    + '  |  ' + lead_unit_number 
                                                    + '  |  ' + lead_unit_name
                                                    + '  |  ' + pi_name 
                                                    + '  |  ' + sponsor,
                                                    obj: test
                                                } );
                                            }

                                        } );

                                        if ( results.length > 0 ) {
                                            this.message = '';
                                        }
                                        else {
                                            if ( this.seachTextModel && this.seachTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
                                        }
                                        resolve( results );
                                    } );

                                } )
                                .catch(( error ) => {
                                    this._ngZone.run(() => {
                                        reject( error );
                                    } );
                                } );
                        }

                        /*ELASTIC SEARCH FOR PROPOSALS*/
                        if ( this.tabPosition == 'PROPOSAL' ) {
                            this.ps.search( searchString, this.personId )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {
                                        hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        hits_source.forEach(( elmnt, j ) => {
                                            if( hits_source[j].pi_name === this.rolePerson || this.isAdmin === 'true' ) {
                                                proposalNo = hits_source[j].proposal_number;
                                                title = hits_source[j].title;
                                                lead_unit_name = hits_source[j].lead_unit_name;
                                                lead_unit_number = hits_source[j].lead_unit_number;
                                                sponsor = hits_source[j].sponsor;
                                                status = hits_source[j].status;
                                                personName = hits_source[j].person_name;
                                                test = hits_source[j];
    
                                                if ( typeof ( hits_highlight[j].proposal_number ) !== 'undefined' ) {
                                                    proposalNo = hits_highlight[j].proposal_number;
                                                }
                                                if ( typeof ( hits_highlight[j].title ) !== 'undefined' ) {
                                                    title = hits_highlight[j].title;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_name ) !== 'undefined' ) {
                                                    lead_unit_name = hits_highlight[j].lead_unit_name;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_number ) !== 'undefined' ) {
                                                    lead_unit_number = hits_highlight[j].lead_unit_number;
                                                }
                                                if ( typeof ( hits_highlight[j].sponsor ) !== 'undefined' ) {
                                                    sponsor = hits_highlight[j].sponsor;
                                                }
                                                if ( typeof ( hits_highlight[j].status ) !== 'undefined' ) {
                                                    status = hits_highlight[j].status;
                                                }
                                                if ( typeof ( hits_highlight[j].person_name ) !== 'undefined' ) {
                                                    personName = hits_highlight[j].person_name;
                                                }
                                                results.push( {
                                                    label: proposalNo + '  :  ' + title
                                                    + '  |  ' + lead_unit_number 
                                                    + '  |  ' + lead_unit_name 
                                                    + '  |  ' + sponsor
                                                    + '  |  ' + personName,
                                                    obj: test
                                                }
                                                );
                                            }
                                        }
                                        );
                                        if ( results.length > 0 ) {
                                            this.message = '';
                                        } else {
                                            if ( this.seachTextModel && this.seachTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
                                        }
                                        resolve( results );
                                    } );
                                } )
                                .catch(( error ) => {
                                    this._ngZone.run(() => {
                                        reject( error );
                                    } );
                                } );
                        }

                        /*ELASTIC SEARCH FOR IRB*/
                        if ( this.tabPosition == 'IRB' ) {
                            this.irb.search( searchString, this.personId )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {
                                        hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        hits_source.forEach(( elmnt, j ) => {
                                            if( hits_source[j].pi_name === this.rolePerson || this.isAdmin === 'true' ) {
                                                protocol_number = hits_source[j].protocol_number;
                                                title = hits_source[j].title;
                                                lead_unit = hits_source[j].lead_unit_name;
                                                unit_number = hits_source[j].lead_unit_number;
                                                protocol_type = hits_source[j].protocol_type;
                                                personName = hits_source[j].person_name;
                                                status = hits_source[j].status;
                                                test = hits_source[j];
    
                                                if ( typeof ( hits_highlight[j].protocol_number ) !== 'undefined' ) {
                                                    protocol_number = hits_highlight[j].protocol_number;
                                                }
                                                if ( typeof ( hits_highlight[j].title ) !== 'undefined' ) {
                                                    title = hits_highlight[j].title;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_name ) !== 'undefined' ) {
                                                    lead_unit = hits_highlight[j].lead_unit_name;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_number ) !== 'undefined' ) {
                                                    unit_number = hits_highlight[j].lead_unit_number;
                                                }
                                                if ( typeof ( hits_highlight[j].protocol_type ) !== 'undefined' ) {
                                                    protocol_type = hits_highlight[j].protocol_type;
                                                }
                                                if ( typeof ( hits_highlight[j].person_name ) !== 'undefined' ) {
                                                    personName = hits_highlight[j].person_name;
                                                }
                                                if ( typeof ( hits_highlight[j].status ) !== 'undefined' ) {
                                                    status = hits_highlight[j].status;
                                                }
                                                results.push( {
                                                    label: protocol_number + '  :  ' + title 
                                                    + '  |  ' + unit_number 
                                                    + '  |  ' + lead_unit 
                                                    + '  |  ' + protocol_type
                                                    + '  |  ' + personName
                                                    + '  |  ' + status,
                                                    obj: test
                                                } );
                                            }
                                        } );
                                        if ( results.length > 0 ) {
                                            this.message = '';
                                        } else {
                                            if ( this.seachTextModel && this.seachTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
                                        }
                                        resolve( results );
                                    } );
                                } )
                                .catch(( error ) => {
                                    this._ngZone.run(() => {
                                        reject( error );
                                    } );
                                } );
                        }

                        /*ELASTIC SEARCH FOR IACUC*/
                        if ( this.tabPosition == 'IACUC' ) {
                            this.iacuc.search( searchString, this.personId )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {
                                        hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        hits_source.forEach(( elmnt, j ) => {
                                            if( hits_source[j].pi_name === this.rolePerson || this.isAdmin === 'true' ) {
                                                protocol_number = hits_source[j].protocol_number;
                                                title = hits_source[j].title;
                                                lead_unit = hits_source[j].lead_unit_name;
                                                lead_unit_number = hits_source[j].lead_unit_number;
                                                protocol_type = hits_source[j].protocol_type;
                                                status = hits_source[j].status;
                                                personName = hits_source[j].person_name;
                                                test = hits_source[j];
    
                                                if ( typeof ( hits_highlight[j].protocol_number ) !== 'undefined' ) {
                                                    protocol_number = hits_highlight[j].protocol_number;
                                                }
                                                if ( typeof ( hits_highlight[j].title ) !== 'undefined' ) {
                                                    title = hits_highlight[j].title;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_name ) !== 'undefined' ) {
                                                    lead_unit = hits_highlight[j].lead_unit_name;
                                                }
                                                if ( typeof ( hits_highlight[j].lead_unit_number ) !== 'undefined' ) {
                                                    lead_unit_number = hits_highlight[j].lead_unit_number;
                                                }
                                                if ( typeof ( hits_highlight[j].protocol_type ) !== 'undefined' ) {
                                                    protocol_type = hits_highlight[j].protocol_type;
                                                }
                                                if ( typeof ( hits_highlight[j].status ) !== 'undefined' ) {
                                                    status = hits_highlight[j].status;
                                                }
                                                if ( typeof ( hits_highlight[j].person_name ) !== 'undefined' ) {
                                                    personName = hits_highlight[j].person_name;
                                                }
                                                results.push( {
                                                    label: protocol_number + '  :  ' + title 
                                                    + '  |  ' + lead_unit_number 
                                                    + '  |  ' + lead_unit 
                                                    + '  |  ' + protocol_type
                                                    + '  |  ' + status
                                                    + '  |  ' + personName,
                                                    obj: test
                                                } );
                                            }
                                        } );
                                        if ( results.length > 0 ) {
                                            this.message = '';
                                        } else {
                                            if ( this.seachTextModel && this.seachTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
                                        }
                                        resolve( results );
                                    } );
                                } )
                                .catch(( error ) => {
                                    this._ngZone.run(() => {
                                        reject( error );
                                    } );
                                } );
                        }

                        /*ELASTIC SEARCH FOR DISCLOSURE*/
                        if ( this.tabPosition == 'DISCLOSURE' ) {
                            this.dis.search( searchString, this.personId )
                                .then(( searchResult ) => {
                                    this._ngZone.run(() => {
                                        hits_source = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit._source );
                                        hits_highlight = ( ( searchResult.hits || {} ).hits || [] )
                                            .map(( hit ) => hit.highlight );
                                        hits_source.forEach(( elmnt, j ) => {
                                            if( hits_source[j].pi_name === this.rolePerson || this.isAdmin === 'true' ) {
                                                full_name = hits_source[j].full_name;
                                                disclosure_number = hits_source[j].coi_disclosure_number;
                                                disclosure_disposition = hits_source[j].disclosure_disposition;
                                                disclosure_status = hits_source[j].disclosure_status;
                                                module_item_key = hits_source[j].module_item_key;
                                                test = hits_source[j];
    
                                                if ( typeof ( hits_highlight[j].coi_disclosure_number ) !== 'undefined' ) {
                                                    disclosure_number = hits_highlight[j].coi_disclosure_number;
                                                }
                                                if ( typeof ( hits_highlight[j].full_name ) !== 'undefined' ) {
                                                    full_name = hits_highlight[j].full_name;
                                                }
                                                if ( typeof ( hits_highlight[j].disclosure_disposition ) !== 'undefined' ) {
                                                    disclosure_disposition = hits_highlight[j].disclosure_disposition;
                                                }
                                                if ( typeof ( hits_highlight[j].disclosure_status ) !== 'undefined' ) {
                                                    disclosure_status = hits_highlight[j].disclosure_status;
                                                }
                                                if ( typeof ( hits_highlight[j].module_item_key ) !== 'undefined' ) {
                                                    module_item_key = hits_highlight[j].module_item_key;
                                                }
    
                                                results.push( {
                                                    label: disclosure_number + '  :  '
                                                    + '  |  ' + full_name
                                                    + '  |  ' + disclosure_disposition 
                                                    + '  |  ' + disclosure_status
                                                    + '  |  ' + module_item_key,
                                                    obj: test
                                                } );
                                            }
                                        } );

                                        if ( results.length > 0 ) {
                                            this.message = '';
                                        } else {
                                            if ( this.seachTextModel && this.seachTextModel.trim() ) {
                                                this.message = 'nothing was found';
                                            }
                                        }
                                        resolve( results );
                                    } );
                                } )
                                .catch(( error ) => {
                                    this._ngZone.run(() => {
                                        reject( error );
                                    } );
                                } );
                        }
                    } );
                } );
            } )
            .catch( this.handleError )
            .subscribe( this._results );
    }

    resutSelected( result ) {
        this.selected.next( result );
        this.active = !this.active;
        switch(this.tabPosition) {
            case 'AWARD' : this.seachTextModel = result.obj.award_number; break;
            case 'PROPOSAL' : this.seachTextModel = result.obj.proposal_number; break;
            case 'IRB' : this.seachTextModel = result.obj.protocol_number; break;
            case 'IACUC' : this.seachTextModel = result.obj.protocol_number; break;
            case 'DISCLOSURE' : this.seachTextModel = result.obj.coi_disclosure_number; break;
        }
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

    clearsearchBox( e: any ) {
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
