import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Client, SearchResponse} from 'elasticsearch';

@Injectable()
export class DisclosureElasticsearchService {
  private _client: Client;
  constructor() {
    if (!this._client) {
      this._connect();
    }
  }

  private _connect() {
    this._client = new Client({
      host: 'http://192.168.1.76:9200/',
      log: 'trace'
    });
  }

  search(value): any { //debugger;
    if (value) {
      console.log(value);
      return this._client.search({
        index: 'coifibi',
        size: 20 ,
        type: 'coi',
        body: {
                        query: {
                          bool: {
                            should: [
                              {
                                match: {
                                  coi_disclosure_id: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              },
                              {
                                match: {
                                  full_name: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              },
                              {
                                match: {
                                  disclosure_disposition: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              }
                              ,
                              {
                                match: {
                                  disclosure_status: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              }
                              ,
                              {
                                match: {
                                  module_item_key: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              },
                             ]
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
                            coi_disclosure_id: {},
                            full_name: {},
                            disclosure_disposition: {},
                            disclosure_status: {},
                            module_item_key: {}
                          }
                        } }
        });
    } else {
      return Promise.resolve({});
    }
  }

  addToIndex(value): any {
    return this._client.create(value);
  }

  isAvailable(): any {
    return this._client.ping({
      requestTimeout: Infinity,
      hello: 'elasticsearch!'
    });
  }
}
