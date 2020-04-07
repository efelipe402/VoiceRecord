import {Injectable} from '@angular/core';
import {HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs'; // HAMMER TIME
/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
    overrides = {pan: {direction: Hammer.DIRECTION_ALL}};
}
