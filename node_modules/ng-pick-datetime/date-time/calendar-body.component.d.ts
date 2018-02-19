import { EventEmitter, OnInit } from '@angular/core';
export declare class CalendarCell {
    value: number;
    displayValue: string;
    ariaLabel: string;
    enabled: boolean;
    out: boolean;
    constructor(value: number, displayValue: string, ariaLabel: string, enabled: boolean, out?: boolean);
}
export declare class OwlCalendarBodyComponent implements OnInit {
    activeCell: number;
    allowDisabledCellSelection: boolean;
    rows: CalendarCell[][];
    numCols: number;
    cellRatio: number;
    todayValue: number;
    selectedValues: number[];
    selectMode: 'single' | 'range';
    selectedValueChange: EventEmitter<number>;
    readonly owlDTCalendarBodyClass: boolean;
    constructor();
    ngOnInit(): void;
    cellClicked(cell: CalendarCell): void;
    isActiveCell(rowIndex: number, colIndex: number): boolean;
    isSelected(value: number): boolean;
    isInRange(value: number): boolean;
    isRangeFrom(value: number): boolean;
    isRangeTo(value: number): boolean;
}
