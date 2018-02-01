import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Client, SearchResponse} from 'elasticsearch';

import { Constants } from '../constants/constants.service';

@Injectable()
export class ProposalElasticsearchService {
    
  private _client: Client;

  constructor( private constant: Constants ) {
    if (!this._client) {
        this._connect();
    }
  }

  private _connect() {
    this._client = new Client({
        host: this.constant.index_url,
    });
  }
  
  search( value, personId ): any {
    if ( value) {
      return this._client.search({
        index: 'pdfibi',
        size: 20 ,
        type: 'devproposal',
        body: {
                query: {
                  bool: {
                    should: [
                      {
                        match: {
                            proposal_number: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                            title: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                            lead_unit_number: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                            lead_unit_name: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                            sponsor: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                            person_name: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                            status: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      }]
                  }
                } ,
                /*filter: {
                    term: { 
                        person_id: personId
                    }
                  },*/
              sort: [{
                  _score: {
                    order: 'desc'
                  }
                }],
                highlight: {
                  pre_tags: ['<b>'],
                  post_tags: ['</b>'],
                  fields: {
                      proposal_number: {},
                      title: {},
                      lead_unit_number: {},
                      lead_unit_name: {},
                      sponsor: {},
                      person_name: {},
                      status: {}
                  }
                } 
                        }
        });
    } else {
      return Promise.resolve({});
    }
  }

  addToIndex( value ): any {
    return this._client.create(value);
  }

  isAvailable(): any {
    return this._client.ping({
          requestTimeout: Infinity,
          hello: 'elasticsearch!'
    });
  }

}
