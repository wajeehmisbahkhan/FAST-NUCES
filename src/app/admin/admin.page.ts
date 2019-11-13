import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss']
})
export class AdminPage implements OnInit {
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
      url: '/admin/timetable',
      icon: 'time',
      children: [
        {
          title: 'Make Entries',
          url: '/admin/timetable/entries',
          icon: 'document'
        },
        {
          title: 'Pair Elective Courses',
          url: '/admin/timetable/pair-elective-courses',
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

  constructor() {}

  ngOnInit() {}
}
