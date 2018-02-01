import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, SearchResponse } from 'elasticsearch';

import { Constants } from '../constants/constants.service';

@Injectable()
export class AwardElasticsearchService {
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
                index: 'awardfibi',
                size: 20,
                type: 'award',
                body: {
                    query: {
                        bool: {
                            should: [
                                {
                                    match: {
                                        award_number: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                },
                                {
                                    match: {
                                        pi_name: {
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
                                        account_number: {
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
                                        title: {
                                            query: value,
                                            operator: 'or'
                                        }
                                    }
                                }]
                        }
                    },
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
                            award_number: {},
                            pi_name: {},
                            sponsor: {},
                            account_number: {},
                            lead_unit_number: {},
                            lead_unit_name: {},
                            title: {}
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
