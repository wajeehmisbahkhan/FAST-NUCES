import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ServerService } from './services/server.service';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { AlertService } from './services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private as: AlertService,
    private authService: AuthenticationService,
    private server: ServerService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Data persistence
      firestore()
        .enablePersistence()
        .catch(err => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled
            // in one tab at a a time.
            // ...
          } else if (err.code === 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            // ...
          }
          console.log(err);
        });
      this.authService.authState.subscribe(async res => {
        if (res) {
          // User is logged in
          await this.as.load('Loading data...', this.server.loadObjects());
          this.router.navigate(['admin']);
        } else {
          // TODO: Redirect to login?
          this.router.navigate(['public']);
        }
      });
    });
  }
}
