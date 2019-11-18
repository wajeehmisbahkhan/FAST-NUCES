import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  Course,
  Teacher,
  Section,
  Room,
  TCSEntry,
  sortAlphaNum,
  Constraint
} from './helper-classes';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  courses: Array<Course>;
  teachers: Array<Teacher>;
  sections: Array<Section>;
  rooms: Array<Room>;

  entries: Array<TCSEntry>;
  constraints: Array<Constraint>;
  timetables: Array<Array<Array<Array<TCSEntry>>>>;

  constructor(private db: DatabaseService) {
    this.courses = [];
    this.teachers = [];
    this.sections = [];
    this.rooms = [];
    // Combo
    this.entries = [];
    this.constraints = [];
    // [TimeTable][Day][Room][Slots]
    this.timetables = [];
  }

  // Called at the beginning of the program
  async loadPrimitiveObjects() {
    // Collections to load
    this.collectionNames.forEach(collectionName =>
      this.db.getLiveCollection(collectionName).subscribe(docs => {
        const collection: Array<any> = [];
        docs.forEach(doc => {
          collection.push(doc.payload.doc.data());
        });
        // Assign to all the local arrays
        this[collectionName] = collection;
        // Generate timetable
        if (collectionName === 'entries') this.generateTimeTable();
        // Always sort rooms by name
        if (collectionName === 'rooms') {
          this.rooms = this.rooms.sort((roomA, roomB) =>
            sortAlphaNum(roomA.name, roomB.name)
          );
          // Set max size
          Room.maxRoomSize = this.rooms.length;
        }
        // Convert 1d 'availableSlots' into 2d and 3d
        const localCollection = this[collectionName] as Array<any>;
        if (localCollection[0] && localCollection[0]['availableSlots']) {
          // Convert room to 2d
          if (collectionName === 'rooms') {
            // For each room
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < localCollection.length; i++) {
              localCollection[i]['availableSlots'] = this.convertTo2D(
                localCollection[i]['availableSlots']
              );
            }
          } else {
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < localCollection.length; i++) {
              localCollection[i]['availableSlots'] = this.convertTo3D(
                localCollection[i]['availableSlots']
              );
            }
          }
        }
      })
    );
  }

  // Dummy data
  generateTimeTable() {
    console.log(this.entries);
    // 3 top time tables
    for (let i = 0; i < 3; i++) {
      this.timetables.push([]);
      // 5 days
      for (let j = 0; j < 5; j++) {
        const days = this.timetables[i];
        days.push([]);
        // 45 rooms
        for (let k = 0; k < 45; k++) {
          const rooms = days[j];
          rooms.push([]);
          // 8 slots
          for (let l = 0; l < 8; l++) {
            const slots = rooms[k];
            // Random lecture
            const lectureIndex = this.getRandomInteger(
              0,
              this.entries.length + 10 // For random nulls
            );
            slots[l] = this.entries[lectureIndex];
          }
        }
      }
    }
  }

  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   */
  getRandomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  // Specific to loading primitive
  convertTo2D(slots: Array<boolean>): Array<Array<boolean>> {
    const res = [];
    const size = 8; // Size of each day
    for (let i = 0; i < slots.length; i = i + size)
      res.push(slots.slice(i, i + size));
    return res; // [Day][Time] - 5x8
  }

  convertTo3D(slots: Array<boolean>): Array<Array<Array<boolean>>> {
    const res = [];
    // Break into days
    const gap = slots.length / 5;
    for (let i = 0; i < slots.length; i = i + gap)
      res.push(slots.slice(i, i + gap));
    // Should be of length 5 now
    // For each day
    for (let i = 0; i < res.length; i++) {
      res[i] = this.convertTo2D(res[i]);
    }
    return res;
  }

  async addPrimitiveObject(name: string, object: object) {
    return this.db.createDoc(name, object);
  }

  async deletePrimitiveObject(name: string, id: string) {
    return this.db.deleteDoc(`${name}/${id}`);
  }

  async updatePrimitiveObject(name: string, id: string, object: object) {
    return this.db.updateDoc(`${name}/${id}`, object);
  }

  // Returns filtered entries containing object id passed in
  getPrimitiveReferencesInEntry(
    objectId: string,
    entryProperty?: 'teacherIds' | 'courseId' | 'sectionIds'
  ): Array<TCSEntry> {
    if (entryProperty === 'courseId') {
      return this.entries.filter(entry => entry[entryProperty] === objectId);
    } else if (
      entryProperty === 'sectionIds' ||
      entryProperty === 'teacherIds'
    ) {
      return this.entries.filter(entry =>
        entry[entryProperty].filter(entryId => entryId === objectId)
      );
    }
    // Search in each property O(n^3)
    return [
      ...this.getPrimitiveReferencesInEntry(objectId, 'courseId'),
      ...this.getPrimitiveReferencesInEntry(objectId, 'sectionIds'),
      ...this.getPrimitiveReferencesInEntry(objectId, 'teacherIds')
    ];
  }

  get collectionNames() {
    return this.db.primitiveCollections;
  }
}
