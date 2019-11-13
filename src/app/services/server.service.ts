import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import {
  Course,
  Teacher,
  Section,
  Room,
  TCSEntry,
  sortAlphaNum
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

  constructor(private db: DatabaseService) {
    this.courses = [];
    this.teachers = [];
    this.sections = [];
    this.rooms = [];
    // Combo
    this.entries = [];
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
    entryProperty?: 'teacherId' | 'courseId' | 'sectionId'
  ) {
    if (entryProperty) {
      return this.entries.filter(entry => entry[entryProperty] === objectId);
    }
    // Search in each property O(n^3)
    const filteredEntries = [];
    ['teacherId', 'courseId', 'sectionId'].forEach(idProperty => {
      filteredEntries.push(
        ...this.entries.filter(entry => entry[idProperty] === objectId)
      );
    });
    return filteredEntries;
  }

  get collectionNames() {
    return this.db.primitiveCollections;
  }
}
