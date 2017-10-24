import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Client, SearchResponse} from 'elasticsearch';

@Injectable()
export class ProposalElasticsearchService {
  private _client: Client;

  constructor() {
    if (!this._client) {
      this._connect();
    }
  }

  private _connect() {
    this._client = new Client({
      host: 'http://192.168.1.76:9200/'
    });
  }
  
  search( value ): any {
    if (value) {
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
                                  document_number: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              },
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
                              }
                              ,
                              {
                                match: {
                                  lead_unit_number: {
                                    query: value,
                                    operator: 'or'
                                  }
                                }
                              }
                              ,
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
                                  status_code: {
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
                            document_number: {},
                            proposal_number: {},
                            title: {},
                            lead_unit_number: {},
                            lead_unit_name: {},
                            sponsor: {},
                            status_code: {},
                            person_name: {}
                          }
                        } }
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
