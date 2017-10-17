import { NgModule } from '@angular/core';
import { KeepaliveSvc, NgIdleModule } from '@ng-idle/core';
import { Keepalive } from './keepalive';
var NgIdleKeepaliveModule = (function () {
    function NgIdleKeepaliveModule() {
    }
    NgIdleKeepaliveModule.forRoot = function () {
        return {
            ngModule: NgIdleKeepaliveModule,
            providers: [Keepalive, { provide: KeepaliveSvc, useExisting: Keepalive }]
        };
    };
    return NgIdleKeepaliveModule;
}());
export { NgIdleKeepaliveModule };
NgIdleKeepaliveModule.decorators = [
    { type: NgModule, args: [{ imports: [NgIdleModule.forRoot()] },] },
];
/** @nocollapse */
NgIdleKeepaliveModule.ctorParameters = function () { return []; };
//# sourceMappingURL=module.js.map