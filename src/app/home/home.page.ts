import {Component, OnInit, ViewChild} from '@angular/core';
import {Media, MediaObject} from '@ionic-native/media/ngx';
import {File} from '@ionic-native/file/ngx';
import {Platform} from '@ionic/angular';
import {MediaCapture} from '@ionic-native/media-capture/ngx';
import {Storage} from '@ionic/storage';
import {VoiceService} from '../voice.service';
import {Base64} from '@ionic-native/base64/ngx';
import {error} from 'util';
import {Isounds} from '../interfaces/Isounds';
import {SOUNDS} from '../data/data';

const MEDIA_FILES_KEY = 'MEDIA';
const INIT_RECORD_MESSAGE = 'Habla ahora';
const END_RECORD_MESSAGE = 'Intentar nuevamente?';
const INIT_STATUS = 'init';
const END_STATUS = 'end';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    recordSound: Isounds = SOUNDS as Isounds;
    recordingMessage = INIT_RECORD_MESSAGE;
    statusRecording = false;
    status;
    audioObject: MediaObject;
    records = [];
    private filePath: string;
    private fileName: string;
    mediaFiles = [];


    constructor(private mediaCapture: MediaCapture, private storage: Storage, private platform: Platform,
                private voiceService: VoiceService, private file: File, private media: Media, private base64: Base64) {
    }

    getFileName() {
        this.fileName = new Date().getTime().toString();
    }

    playRecordAudio() {
        if (!this.recordSound.isPlaying) {
            const audio = new Audio(this.recordSound.audio);
            audio.load();
            this.recordSound.isPlaying = true;
            audio.play().then(() => {
                this.record();
            });
        }

    }

    async record() {
        try {
            await this.playRecordAudio();
            this.status = INIT_STATUS;
            this.statusRecording = true;
            this.getFileName();
            await this.verifyPlatform();
            this.audioObject = this.media.create(this.filePath);
            await this.audioObject.startRecord();
            console.log('cache dir: ' + this.file.cacheDirectory);
            console.log('start recording' + this.filePath);
        } catch (e) {
            console.log(e);
        }
    }

    async verifyPlatform() {
        this.platform.ready().then(() => {
            if (!this.platform.is('cordova')) {
                return false;
            }
            if (this.platform.is('ios')) {
                this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + `${this.fileName}.m4a`;
            } else if (this.platform.is('android')) {
                this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + `${this.fileName}.3gp`;
            } else {
                // future usage for more platform support
                return false;
            }
        });
    }

    async storeMediaFiles(files) {
        this.storage.get(MEDIA_FILES_KEY).then(res => {
            if (res) {
                let arr = JSON.parse(res);
                arr = arr.concat(files);
                this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
            } else {
                this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files));
            }
            this.mediaFiles = this.mediaFiles.concat(files);
        }, err => {
            console.log(err);
        });
    }

    async stopRecording() {
        try {
            this.status = END_STATUS;
            this.recordSound.isPlaying = false;
            this.recordingMessage = END_RECORD_MESSAGE;
            this.statusRecording = false;
            this.audioObject.stopRecord();
            this.audioObject.release();
            this.records.push({path: this.filePath, name: this.fileName, audio: this.audioObject});
            this.fileName = '';
            this.storeMediaFiles(this.audioObject);
        } catch (e) {
            console.log(e);
        }
    }

    playAudio(file: any) {
        file.audio.play();
        file.audio.setVolume(0.8);
        this.sendToServer(file.path, file.name);
        // console.log(file);
    }

    sendToServer(voiceMessagePath, fileName) {
        this.base64.encodeFile(voiceMessagePath + fileName).then(
            (base64: any) => {
                console.log('file base64 encoding: ' + base64);
                let x = base64.substr(13, base64.length);
                x = 'data:audio/3gp;base64' + x;
            }).catch(error(console.log(error)));


    }

    onPress($event) {
        if ($event.type === 'press') {
            this.playRecordAudio();
        } else if ($event.type === 'pressup') {
            this.stopRecording();
        }
    }

    onLongPress($event) {
        //  this.stopRecording();
        this.record();
        console.log('long press', $event);
    }


    doubleTap($event) {

        console.log('double tap ', $event);
    }

    ngOnInit(): void {
        /* this.watchRecordButton();
         const recordButton = document.getElementById('record-button');

         document.addEventListener('long-press', (e) => {
             console.log(e);
         });*/
    }

    watchRecordButton() {
        // tslint:disable-next-line:prefer-const


    }
}
