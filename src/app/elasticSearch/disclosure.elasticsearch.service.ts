import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from 'elasticsearch';

import { Constants } from '../constants/constants.service';

@Injectable()
export class DisclosureElasticsearchService {

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

    search( value, personId ): any {
        if ( value ) {
            return this._client.search( {
                index: 'coifibiqa',
                size: 20,
                type: 'coi',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        coi_disclosure_number: {
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
                                },
                                {
                                    match: {
                                        disclosure_status: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
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
                    },
                    filter: {
                        term: { 
                            person_id: personId
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
                            coi_disclosure_id: {},
                            full_name: {},
                            disclosure_disposition: {},
                            disclosure_status: {},
                            module_item_key: {}
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
