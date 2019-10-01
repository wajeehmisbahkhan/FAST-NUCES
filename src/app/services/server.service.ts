import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  constructor(private db: DatabaseService) {}

  async addPrimitiveObject(name: string, object: object) {
    const objRef = await this.db.createDoc(name, object);
    object['id'] = objRef.id;
  }
}
