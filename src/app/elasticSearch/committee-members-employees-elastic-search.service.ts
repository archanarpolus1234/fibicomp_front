import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from 'elasticsearch';

import { Constants } from '../constants/constants.service';

@Injectable()
export class CommitteeMemberEmployeeElasticService {
    private _client: Client;

    constructor( private constant: Constants ) {
        if ( !this._client ) {
            this._connect();
        }
    }

    private _connect() {
        this._client = new Client( {
            host: this.constant.index_url
        } );
    }

    search( value ): any {
        if ( value ) {
            return this._client.search( {
                index: 'fibiperson',
                size: 20,
                type: 'person',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        prncpl_id: {
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
                                        prncpl_nm: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        email_addr: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                              {
                                    match: {
                                        unit_number: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                            {
                                    match: {
                                        unit_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                          {
                                    match: {
                                        addr_line_1: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                          {
                                    match: {
                                       phone_nbr: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                }]
                        }
                    },
                    sort: [{
                        _score: {
                            order: 'desc'
                        }
                    }],
                    highlight: {
                        pre_tags: ['<b>'],
                        post_tags: ['</b>'],
                        fields: {
                            prncpl_id: {},
                            full_name: {},
                            prncpl_nm: {},
                            email_addr: {},
                              unit_number: {},
                                unit_name: {},
                                  addr_line_1: {},
                                    phone_nbr: {},
                                  
                        }
                    }
                }
            } );
        } else {
            return Promise.resolve( {} );
        }
    }

    addToIndex( value ): any {
        return this._client.create( value );
    }

    isAvailable(): any {
        return this._client.ping( {
            requestTimeout: Infinity,
            hello: 'elasticsearch!'
        } );
    }
}
