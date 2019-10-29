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
        }
      })
    );
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
