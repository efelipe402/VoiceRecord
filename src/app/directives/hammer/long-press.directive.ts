import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
    selector: '[appLongPress]'
})
export class LongPressDirective {
    @Output() longPress = new EventEmitter();
    @Output() doubleTap = new EventEmitter();

    constructor() {
    }

    @HostListener('long-press', ['$event'])
    OnLongPress(e) {
        if (e) {
            this.longPress.emit(e);
        }
    }

    @HostListener('tap', ['$event'])
    onTap(e) {
        if (e.tapCount === 2) {
            this.doubleTap.emit(e);
        }
    }

}
