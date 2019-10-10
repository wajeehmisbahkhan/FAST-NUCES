import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss']
})
export class StudentPage implements OnInit {
  appPages = [
    {
      title: 'Home',
      url: '/student/home',
      icon: 'home'
    },
    {
      title: 'Course',
      url: '/student/course',
      icon: 'book',
      children: [
        {
          title: 'Registration',
          url: '/student/course/registration',
          icon: 'bookmarks'
        },
        {
          title: 'My Courses',
          url: '/student/course/my-courses',
          icon: 'bookmark'
        },
        {
          title: 'Feedback',
          url: '/student/course/feedback',
          icon: 'create'
        }
      ]
    },
    {
      title: 'Timetable',
      url: '/student/timetable',
      icon: 'time',
      children: [
        {
          title: 'My Timetable',
          url: '/student/timetable/my-timetable',
          icon: 'clock'
        },
        {
          title: 'General Timetable',
          url: '/student/timetable/general-timetable',
          icon: 'calendar'
        }
      ]
    },
    {
      title: 'Attendance',
      url: '/student/attendance',
      icon: 'hand'
    },
    {
      title: 'Marks',
      url: '/student/marks',
      icon: 'podium'
    },
    {
      title: 'Transcript',
      url: '/student/transcript',
      icon: 'paper'
    },
    {
      title: 'Fee',
      url: '/student/fee',
      icon: 'wallet',
      children: [
        {
          title: 'Challan',
          url: '/student/fee/challan',
          icon: 'browsers'
        },
        {
          title: 'Details',
          url: 'student/fee/details',
          icon: 'clipboard'
        }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}
}
