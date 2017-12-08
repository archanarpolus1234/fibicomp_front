import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Client, SearchResponse} from 'elasticsearch';
import { Constants } from '../constants/constants.service';

@Injectable()
export class IacucElasticsearchService {
  private _client: Client;

  constructor( private constant: Constants ) {
    if (!this._client) {
      this._connect();
    }
  }

  private _connect() {
    this._client = new Client({
        host: this.constant.index_url
    });
  }
  
  search(value, personId): any { 
    if ( value ) {
      return this._client.search({
        index: 'iacucfibiqa',
        size: 20 ,
        type: 'iacuc',
        body: {
                query: {
                  bool: {
                    should: [
                      {
                        match: {
                          protocol_id: {
                            query: value,
                            operator: 'or'
                          }
                        }
                      },
                      {
                        match: {
                          protocol_number: {
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
                            lead_unit_name: {
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
                          protocol_type: {
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
                
              sort: [{
                  _score: {
                    order: 'desc'
                  }
                }],
                highlight: {
                  pre_tags: ['<b>'],
                  post_tags: ['</b>'],
                  fields: {
                    protocol_id: {},
                    protocol_number: {},
                    title: {},
                    lead_unit: {},
                    lead_unit_number: {},
                    protocol_type: {},
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
    return this._client.create( value );
  }

  isAvailable(): any {
    return this._client.ping({
          requestTimeout: Infinity,
          hello: 'elasticsearch!'
    });
  }
}
