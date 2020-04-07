import {NgModule} from '@angular/core';
import {BrowserModule, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {Media} from '@ionic-native/media/ngx';
import {File} from '@ionic-native/file/ngx';
import {IonicStorageModule} from '@ionic/storage';
import {MediaCapture} from '@ionic-native/media-capture/ngx';
import {Base64} from '@ionic-native/base64/ngx';
import {IonicGestureConfig} from './config/hammer';
import { LongPressDirective } from './directives/hammer/long-press.directive';

@NgModule({
    declarations: [AppComponent, LongPressDirective],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicStorageModule.forRoot()],
    providers: [
        StatusBar,
        SplashScreen,
        MediaCapture,
        Media,
        File,
        Base64,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: HAMMER_GESTURE_CONFIG, useClass: IonicGestureConfig},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
