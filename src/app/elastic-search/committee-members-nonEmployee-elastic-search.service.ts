import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from 'elasticsearch';

import { Constants } from '../constants/constants.service';

@Injectable()
export class CommitteeMemberNonEmployeeElasticService {
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
                index: 'fibirolodex',
                size: 20,
                type: 'rolodex',
                body: {
                    query: {
                        bool: {
                            should: [

                                {
                                    match: {
                                        first_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        middle_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        last_name: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        organization: {
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
                            rolodex_id: {},
                            first_name: {},
                            middle_name: {},
                            last_name: {},
                            organization: {},
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
