(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/http'), require('@ng-idle/core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/http', '@ng-idle/core'], factory) :
    (factory((global.ngidle = global.ngidle || {}, global.ngidle.keepalive = global.ngidle.keepalive || {}),global.ng.core,global.ng.http,global.ng.core));
}(this, (function (exports,_angular_core,_angular_http,_ngIdle_core) { 'use strict';

var __extends = (undefined && undefined.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        _this.onPing = new _angular_core.EventEmitter;
        /*
         * An event emitted when the service has pinged an HTTP endpoint and received a response.
         */
        _this.onPingResponse = new _angular_core.EventEmitter();
        return _this;
    }
    /*
     * Sets the string or Request that should be used when pinging.
     * @param url - The URL or Request object to use when pinging.
     * @return The current Request used when pinging.
     */
    Keepalive.prototype.request = function (url) {
        if (typeof url === 'string') {
            this.pingRequest = new _angular_http.Request({ method: _angular_http.RequestMethod.Get, url: url });
        }
        else if (url instanceof _angular_http.Request) {
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
}(_ngIdle_core.KeepaliveSvc));
Keepalive.decorators = [
    { type: _angular_core.Injectable },
];
/** @nocollapse */
Keepalive.ctorParameters = function () { return [
    { type: _angular_http.Http, },
]; };

var NgIdleKeepaliveModule = (function () {
    function NgIdleKeepaliveModule() {
    }
    NgIdleKeepaliveModule.forRoot = function () {
        return {
            ngModule: NgIdleKeepaliveModule,
            providers: [Keepalive, { provide: _ngIdle_core.KeepaliveSvc, useExisting: Keepalive }]
        };
    };
    return NgIdleKeepaliveModule;
}());
NgIdleKeepaliveModule.decorators = [
    { type: _angular_core.NgModule, args: [{ imports: [_ngIdle_core.NgIdleModule.forRoot()] },] },
];
/** @nocollapse */
NgIdleKeepaliveModule.ctorParameters = function () { return []; };

exports.NgIdleKeepaliveModule = NgIdleKeepaliveModule;
exports.Keepalive = Keepalive;

Object.defineProperty(exports, '__esModule', { value: true });

})));
