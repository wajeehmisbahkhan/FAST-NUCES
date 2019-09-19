import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  appPages = [
    {
      title: 'Courses',
      url: '/admin/courses',
      icon: 'book'
    },
    {
      title: 'Teachers',
      url: '/admin/teachers',
      icon: 'person'
    },
    {
      title: 'Sections',
      url: '/admin/sections',
      icon: 'albums'
    },
    {
      title: 'Classrooms',
      url: '/admin/classrooms',
      icon: 'business'
    },
    {
      title: 'Timetable',
      icon: 'time',
      children: [
        {
          title: 'Make Entries',
          url: '/admin/timetable/entries',
          icon: 'document'
        },
        {
          title: 'Add Constraints',
          url: '/admin/timetable/constraints',
          icon: 'cube'
        },
        {
          title: 'Generate Timetable',
          url: '/admin/timetable/generate',
          icon: 'construct'
        }
      ]
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
