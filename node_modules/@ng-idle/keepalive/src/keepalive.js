var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EventEmitter, Injectable } from '@angular/core';
import { Http, Request, RequestMethod } from '@angular/http';
import { KeepaliveSvc } from '@ng-idle/core';
/**
 * An example of an injectable service.
 */
var Keepalive = (function (_super) {
    __extends(Keepalive, _super);
    /*
     * Initializes a new instance of Keepalive
     * @param http - The HTTP service.
     */
    function Keepalive(http) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.pingInterval = 10 * 60;
        /*
         * An event emitted when the service is pinging.
         */
        _this.onPing = new EventEmitter;
        /*
         * An event emitted when the service has pinged an HTTP endpoint and received a response.
         */
        _this.onPingResponse = new EventEmitter();
        return _this;
    }
    /*
     * Sets the string or Request that should be used when pinging.
     * @param url - The URL or Request object to use when pinging.
     * @return The current Request used when pinging.
     */
    Keepalive.prototype.request = function (url) {
        if (typeof url === 'string') {
            this.pingRequest = new Request({ method: RequestMethod.Get, url: url });
        }
        else if (url instanceof Request) {
            this.pingRequest = url;
        }
        else if (url === null) {
            this.pingRequest = null;
        }
        return this.pingRequest;
    };
    /*
     * Sets the interval (in seconds) at which the ping operation will occur when start() is called.
     * @param seconds - The ping interval in seconds.
     * @return The current interval value.
     */
    Keepalive.prototype.interval = function (seconds) {
        if (!isNaN(seconds) && seconds > 0) {
            this.pingInterval = seconds;
        }
        else if (!isNaN(seconds) && seconds <= 0) {
            throw new Error('Interval value must be greater than zero.');
        }
        return this.pingInterval;
    };
    /*
     * Immediately performs the ping operation. If a request has been set, an HTTP
     * request will be made and the response will be emitted via the
     * onPingResponse event.
     */
    Keepalive.prototype.ping = function () {
        var _this = this;
        this.onPing.emit(null);
        if (this.pingRequest) {
            this.http.request(this.pingRequest).subscribe(function (response) {
                _this.onPingResponse.emit(response);
            });
        }
    };
    /*
     * Starts pinging on an interval.
     */
    Keepalive.prototype.start = function () {
        var _this = this;
        this.stop();
        this.pingHandle = setInterval(function () {
            _this.ping();
        }, this.pingInterval * 1000);
    };
    /*
     * Stops pinging on an interval.
     */
    Keepalive.prototype.stop = function () {
        if (this.pingHandle) {
            clearInterval(this.pingHandle);
            this.pingHandle = null;
        }
    };
    /*
     * Performs any cleanup tasks when Angular destroys the instance.
     */
    Keepalive.prototype.ngOnDestroy = function () {
        this.stop();
    };
    /*
     * Returns whether or not the service will ping automatically at the specified interval.
     * @return True if the service will ping at the specified interval; otherwise, false.
     */
    Keepalive.prototype.isRunning = function () {
        return !!this.pingHandle;
    };
    return Keepalive;
}(KeepaliveSvc));
export { Keepalive };
Keepalive.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Keepalive.ctorParameters = function () { return [
    { type: Http, },
]; };
//# sourceMappingURL=keepalive.js.map