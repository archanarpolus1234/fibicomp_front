import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
export declare class OwlTimerBoxComponent implements OnInit, OnDestroy {
    showDivider: boolean;
    upBtnAriaLabel: string;
    upBtnDisabled: boolean;
    downBtnAriaLabel: string;
    downBtnDisabled: boolean;
    boxValue: number;
    value: number;
    min: number;
    max: number;
    step: number;
    valueChange: EventEmitter<number>;
    readonly displayValue: number;
    readonly owlDTTimerBoxClass: boolean;
    constructor();
    ngOnInit(): void;
    ngOnDestroy(): void;
    upBtnClicked(): void;
    downBtnClicked(): void;
    private updateValue(value);
}
