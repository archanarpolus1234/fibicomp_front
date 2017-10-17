import { EventEmitter, OnDestroy } from '@angular/core';
import { Http, Request, Response } from '@angular/http';
import { KeepaliveSvc } from '@ng-idle/core';
/**
 * An example of an injectable service.
 */
export declare class Keepalive extends KeepaliveSvc implements OnDestroy {
    private http;
    private pingRequest;
    private pingInterval;
    private pingHandle;
    onPing: EventEmitter<any>;
    onPingResponse: EventEmitter<Response>;
    constructor(http: Http);
    request(url?: string | Request): Request;
    interval(seconds?: number): number;
    ping(): void;
    start(): void;
    stop(): void;
    ngOnDestroy(): void;
    isRunning(): boolean;
}
