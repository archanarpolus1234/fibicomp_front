import {Component, ChangeDetectionStrategy, AfterViewInit, EventEmitter, OnChanges, Output, NgZone, Input} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {ProposalElasticsearchService} from '../elasticSearch/proposal.elasticsearch.service';
import {
    FormGroup,
    FormControl,
    FormControlName
} from '@angular/forms';

@Component({
  selector: 'app-proposal-elastic-search',
  templateUrl: './elasticsearch.component.html',
  styleUrls: ['../../assets/css/bootstrap.min.css',
              '../../assets/css/font-awesome.min.css',
              '../../assets/css/style.css',
              '../../assets/css/search.css'],
  providers: [ProposalElasticsearchService],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProposalElasticSearchComponent implements AfterViewInit {
  @Output()
  found: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  
  @Output()
  selected: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() messageEvent = new EventEmitter<boolean>();
  seachTextModel: string;
  active = false;
  message = '';
  resultCard: boolean = false;
  _results: Subject<Array<any>> = new Subject<Array<any>>();
  seachText: FormControl = new FormControl('');
  iconClass: string = 'fa fa-search';
  
  constructor(private es: ProposalElasticsearchService, private _ngZone: NgZone) {
   this._results.subscribe((res) => {
            this.found.emit(res);
        });
  }

  ngAfterViewInit() {
        this.seachText
            .valueChanges
            .map((text: any) => text ? text.trim() : '')                                            
            .do(searchString => searchString ? this.message = 'searching...' : this.message = '')
            .debounceTime(500)                                                                      
            .distinctUntilChanged()
            .switchMap(searchString => {
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
                                      let documentNo: string = hits_source[j].document_number;
                                      let proposalNo: string = hits_source[j].proposal_number;
                                      let title: string = hits_source[j].title;
                                      let lead_unit_name: string = hits_source[j].lead_unit_name;
                                      let lead_unit_number: string = hits_source[j].lead_unit_number;
                                      let sponsor: string = hits_source[j].sponsor;
                                      let statusCode: string = hits_source[j].status_code;
                                      let personName: string = hits_source[j].person_name;
                                      let test = hits_source[j];
                                      let all ;
                                      if (typeof(hits_highlight[j].document_number) !== 'undefined') {
                                        documentNo = hits_highlight[j].document_number;
                                      }
                                      if (typeof(hits_highlight[j].proposal_number) !== 'undefined') {
                                        proposalNo = hits_highlight[j].proposal_number;
                                      }
                                      if (typeof(hits_highlight[j].title) !== 'undefined') {
                                        title = hits_highlight[j].title;
                                      }
                                      if (typeof(hits_highlight[j].lead_unit_name) !== 'undefined') {
                                        lead_unit_name = hits_highlight[j].lead_unit_name;
                                      }
                                      if (typeof(hits_highlight[j].lead_unit_number) !== 'undefined') {
                                        lead_unit_number = hits_highlight[j].lead_unit_number;
                                      }
                                      if (typeof(hits_highlight[j].sponsor) !== 'undefined') {
                                        sponsor = hits_highlight[j].sponsor;
                                      }
                                      if (typeof(hits_highlight[j].status_code) !== 'undefined') {
                                        statusCode = hits_highlight[j].status_code;
                                      }
                                      if (typeof(hits_highlight[j].person_name) !== 'undefined') {
                                        personName = hits_highlight[j].person_name;
                                      }
                                      results.push({
                                        label: documentNo + '  :  ' + proposalNo
                                        + '  |  ' + title
                                        + '  |  ' + sponsor + '  |  '
                                        + lead_unit_number + '  |  '
                                        + lead_unit_name + ' | '
                                        + statusCode + ' | '
                                        + personName,
                                        obj: test });
                                    });
                                    if (results.length > 0) {
                                        this.message = '';
                                  } else {
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
        this.seachTextModel = result.obj.document_number;
        this.showResultDiv();
    }

    handleError(): any {
        this.message = 'something went wrong';
    }

    onSearchValueChange() {
      this.iconClass = this.seachTextModel ? 'fa fa-times' : 'fa fa-search';
      if (this.seachTextModel === '' && this.resultCard === true) {
        this.hideResultDiv();
       }
    }

    clearsearchBox( e: any) {
      e.preventDefault();
      this.seachTextModel = '';
       if (this.resultCard) {
        this.hideResultDiv();
       }
    }

    sendMessage() {
      this.messageEvent.emit(this.resultCard);
    }
  
    hideResultDiv() {
      this.resultCard = false;
      this.sendMessage();
    }
  
    showResultDiv() {
      this.resultCard = true;
      this.sendMessage();
    }
}

