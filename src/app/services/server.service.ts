import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  Course,
  Teacher,
  Section,
  Room,
  TCSEntry,
  sortAlphaNum,
  Constraint,
  AtomicSection,
  PublishedTimetable,
  Lecture
} from './helper-classes';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

interface TimetableGenerationRequest {}

interface TimetableGenerationResponse {
  code: number;
  message: // Server Side Messages
  | 'unknown-message-received'
    | 'could-not-parse-json'
    | 'attached-is-generating-status'
    | 'attached-are-timetables-progresses'
    | 'generating-timetables'
    | 'timetables-have-been-generated'
    | 'started-generating-timetables'
    | 'attached-are-timetables'
    | 'no-generated-timetables-found'
    | 'deleted-timetables'
    // Client Side Connection Messages
    | 'connection-established'
    | 'connection-closed';
  generating?: boolean;
  timetableProgress?: number;
  // [TimeTable][Lecture]
  timetables?: Array<Array<Lecture>>;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  courses: Array<Course>;
  teachers: Array<Teacher>;
  // From database
  sections: Array<Section>;
  // For backend
  atomicSections: Array<AtomicSection>;
  rooms: Array<Room>;

  entries: Array<TCSEntry>;
  constraints: Array<Constraint>;

  // Published
  published: Array<PublishedTimetable>;

  // Connection to backend
  socket: WebSocket;

  constructor(private db: DatabaseService) {
    this.courses = [];
    this.teachers = [];
    this.sections = [];
    this.atomicSections = [];
    this.rooms = [];
    // Combo
    this.entries = [];
    this.constraints = [];
    this.published = [];
  }

  // Called at the beginning of the program
  async loadObjects() {
    // Wait for collections to load
    const promises: Array<Promise<any>> = [];
    this.collectionNames.forEach(collectionName =>
      promises.push(
        new Promise(resolve =>
          this.db.getLiveCollection(collectionName).subscribe(docs => {
            const collection: Array<any> = [];
            docs.forEach(doc => {
              collection.push(doc.payload.doc.data());
              // Convert 1d array into 2d array
              const currentElement = collection[collection.length - 1];
              if (currentElement['availableSlots']) {
                currentElement['availableSlots'] = this.convertTo2D(
                  currentElement['availableSlots']
                );
              }
            });
            // Assign to all the local arrays
            this[collectionName] = collection;
            // TODO: Shouldn't be sorted here
            if (collectionName === 'rooms') {
              // Always sort rooms by name
              this.rooms = this.rooms.sort((roomA, roomB) =>
                sortAlphaNum(roomA.name, roomB.name)
              );
            }
            // Atomic section updates
            if (collectionName === 'sections') {
              const atomicSections = [];
              this.sections.forEach(section => {
                // Generate for each section
                for (let i = 0; i < section.numberOfSections; i++) {
                  atomicSections.push(
                    new AtomicSection(
                      String.fromCharCode('A'.charCodeAt(0) + i) + 1, // letter
                      section.batch,
                      section.department
                    )
                  );
                  atomicSections.push(
                    new AtomicSection(
                      String.fromCharCode('A'.charCodeAt(0) + i) + 2, // letter
                      section.batch,
                      section.department
                    )
                  );
                }
              });
              this.atomicSections = atomicSections;
            }
            // Promise resolved
            resolve(this[collectionName]);
          })
        )
      )
    );
    return Promise.all(promises);
  }

  // Specific to loading primitive
  convertTo2D(slots: Array<boolean>): Array<Array<boolean>> {
    const res = [];
    const size = 8; // Size of each day
    for (let i = 0; i < slots.length; i = i + size)
      res.push(slots.slice(i, i + size));
    return res; // [Day][Time] - 5x8
  }

  async addObject(
    name:
      | 'courses'
      | 'teachers'
      | 'sections'
      | 'rooms'
      | 'entries'
      | 'constraints'
      | 'generated'
      | 'published',
    object: object
  ) {
    return this.db.createDoc(name, object);
  }

  async deleteObject(
    name:
      | 'courses'
      | 'teachers'
      | 'sections'
      | 'rooms'
      | 'entries'
      | 'constraints'
      | 'generated'
      | 'published',
    id: string
  ) {
    return this.db.deleteDoc(`${name}/${id}`);
  }

  async updateObject(
    name:
      | 'courses'
      | 'teachers'
      | 'sections'
      | 'rooms'
      | 'entries'
      | 'constraints'
      | 'generated'
      | 'published',
    id: string,
    object: object
  ) {
    return this.db.updateDoc(`${name}/${id}`, object);
  }

  // Returns filtered entries containing object id passed in
  getReferencesInEntry(
    objectId: string,
    entryProperty?: 'teacherIds' | 'courseId' | 'atomicSectionIds'
  ): Array<TCSEntry> {
    if (entryProperty === 'courseId') {
      return this.entries.filter(entry => entry.courseId === objectId);
    } else if (
      entryProperty === 'atomicSectionIds' ||
      entryProperty === 'teacherIds'
    ) {
      return this.entries.filter(entry =>
        entry[entryProperty].includes(objectId)
      );
    }
    // Search in each property O(n^3)
    return [
      ...this.getReferencesInEntry(objectId, 'courseId'),
      ...this.getReferencesInEntry(objectId, 'atomicSectionIds'),
      ...this.getReferencesInEntry(objectId, 'teacherIds')
    ];
  }

  getReferencesInConstraints(
    objectId: string,
    entryProperty?: 'pairedCourses'
  ): Constraint[] {
    if (entryProperty === 'pairedCourses') {
      return this.constraints.filter(constraint =>
        constraint.pairedCourses.includes(
          this.courses.find(course => course.id === objectId)
        )
      );
    }
  }

  // TIMETABLE GENERATION
  connectToBackend() {
    // TODO: Check if already connected to backend
    if (this.socket) {
      return;
    }
    let wsUrl = `${environment.serverBaseUrl}/connect`;
    // Convert to websocket
    wsUrl = wsUrl.replace(/http/gm, 'ws');
    return new Observable<TimetableGenerationResponse>(subscriber => {
      this.socket = new WebSocket(wsUrl);
      this.socket.onopen = e => {
        subscriber.next({
          code: 200,
          message: 'connection-established'
        });
      };

      this.socket.onmessage = event => {
        subscriber.next(JSON.parse(event.data));
      };

      this.socket.onclose = event => {
        if (event.wasClean) {
          subscriber.next({
            code: 202,
            message: 'connection-closed'
          });
          subscriber.complete();
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          subscriber.error({
            code: 400,
            message: `Connection died, code=${event.code} reason=${event.reason}`
          });
        }
      };

      this.socket.onerror = error => {
        subscriber.error({
          code: 400,
          message: `Error: ${error}`
        });
      };
    });
  }

  sendMessageToBackend(
    message:
      | 'get-generating'
      | 'generate-timetables'
      | 'get-timetables-progress'
      | 'get-timetables'
      | 'delete-timetables',
    timetableRequest?: TimetableGenerationRequest
  ) {
    // TODO: Handle undefined / problematic socket
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    return this.socket.send(
      JSON.stringify({
        message,
        timetableRequest
      })
    );
  }

  get collectionNames() {
    return this.db.collections;
  }

  get connecting() {
    return this.socket && this.socket.readyState === this.socket.CONNECTING;
  }

  get connected() {
    return this.socket && this.socket.readyState === this.socket.OPEN;
  }
}
