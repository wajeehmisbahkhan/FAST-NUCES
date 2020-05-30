import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Lecture } from 'src/app/services/helper-classes';
import { AlertService } from 'src/app/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss']
})
export class GeneratePage implements OnInit, OnDestroy {
  departments: Array<string>;
  timetables: Array<Array<Lecture>>;

  // Server side variables
  generating: boolean;
  timetablesProgresses: number;

  connectionSubscription: Subscription;

  constructor(
    private server: ServerService,
    private alertService: AlertService
  ) {
    this.generating = false;
    this.timetablesProgresses = null;
  }

  ngOnInit() {
    // React to current state of application
    this.connectionSubscription = this.server
      .connectToBackend()
      .subscribe(response => {
        if (response.message === 'connection-established') {
          // 1. Check if already generating
          this.server.sendMessageToBackend('get-generating');
        } else if (response.message === 'attached-is-generating-status') {
          // 2. Server tells the current generating status
          this.generating = response.generating;
          if (this.generating) {
            // 2a. If generating, request current progress
            this.server.sendMessageToBackend('get-timetables-progress');
          } else {
            // 2b. If not generating, check if already generated
            this.server.sendMessageToBackend('get-timetables');
          }
        } else if (response.message === 'attached-are-timetables-progresses') {
          // 3a. Server tells the timetable progress
          this.timetablesProgresses = response.timetablesProgresses / 100;
        } else if (response.message === 'generating-timetables') {
          this.generating = true;
        } else if (response.message === 'timetables-have-been-generated') {
          this.generating = false;
        } else if (response.message === 'started-generating-timetables') {
          this.generating = true;
          // Ask for progress
          this.server.sendMessageToBackend('get-timetables-progress');
        } else if (response.message === 'no-generated-timetables-found') {
          // 3b1. Timetable is not generated (message = 'get-timetable')
          if (response.code === 404) {
            // User can now generate new timetables
            this.timetables = [];
            this.departments = [];
          }
        } else if (response.message === 'canceled-timetables-generation') {
          this.generating = false;
          this.timetablesProgresses = null;
        } else if (response.message === 'attached-are-timetables') {
          // 3b2/N. Timetable is generated
          this.timetables = response.timetables;
          this.departments = [];
          this.calculateDepartments();
          // Just finished generating
          if (response.code === 200) {
            this.generating = false;
          }
        } else if (response.message === 'deleted-timetables') {
          // User can now generate new timetables
          this.timetables = [];
          this.departments = [];
        } else {
          this.alertService.error(response);
        }
      }, this.alertService.error);
  }

  ngOnDestroy() {
    this.server.disconnectFromBackend();
    this.connectionSubscription.unsubscribe();
  }

  calculateDepartments() {
    // Departments in timetables
    this.timetables.forEach(lecture => {
      // Only need one lecture to find department
      const department = this.getCourseById(lecture[0].courseId).department;
      if (!this.departments.includes(department))
        this.departments.push(department);
    });
  }

  generateTimetables() {
    this.server.sendMessageToBackend('generate-timetables', {
      atomicSections: this.server.atomicSections,
      constraints: this.server.constraints,
      courses: this.server.courses,
      entries: this.server.entries,
      rooms: this.server.rooms,
      teachers: this.server.teachers
    });
  }

  deleteTimetables() {
    this.server.sendMessageToBackend('delete-timetables');
  }

  cancel() {
    this.server.sendMessageToBackend('cancel-generation');
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get connecting() {
    return this.server.connecting;
  }

  get connected() {
    return this.server.connected;
  }
}
