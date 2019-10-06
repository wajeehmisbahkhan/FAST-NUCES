import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { Course, Teacher, Section, Room } from './helper-classes';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  courses: Array<Course>;
  teachers: Array<Teacher>;
  sections: Array<Section>;
  rooms: Array<Room>;

  constructor(private db: DatabaseService) {
    this.courses = [];
    this.teachers = [];
    this.sections = [];
    this.rooms = [];
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

  get collectionNames() {
    return this.db.primitiveCollections;
  }
}
