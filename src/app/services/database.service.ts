import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  primitiveCollections = [
    'courses',
    'teachers',
    'sections',
    'rooms',
    'entries',
    'constraints'
  ];

  constructor(private afs: AngularFirestore) {}

  getCollection(path: string, options?: firebase.firestore.GetOptions) {
    return new Promise<firebase.firestore.QuerySnapshot>((resolve, reject) =>
      this.afs
        .collection(path)
        .get(options)
        .subscribe(doc => resolve(doc), reject)
    );
  }

  getLiveCollection(path: string) {
    return this.afs.collection(path).snapshotChanges();
  }

  createDoc(path: string, data: object, storeId = true) {
    if (storeId) {
      // Generate and set id
      data['id'] = this.afs.createId();
      // Check data for any nested arrays (2D/3D)
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key] = data[key].flat(Infinity);
        }
      });
      return this.afs
        .collection(path)
        .doc(data['id'])
        .set(JSON.parse(JSON.stringify(data)));
    }
    return this.afs.collection(path).add(JSON.parse(JSON.stringify(data)));
  }

  getDoc(path: string, options?: firebase.firestore.GetOptions) {
    return new Promise<firebase.firestore.DocumentSnapshot>((resolve, reject) =>
      this.afs
        .doc(path)
        .get(options)
        .subscribe(doc => resolve(doc), reject)
    );
  }

  getLiveDoc(path: string) {
    return this.afs.doc(path).snapshotChanges();
  }

  setDoc(path: string, data: object, options?: firebase.firestore.SetOptions) {
    return this.afs.doc(path).set(JSON.parse(JSON.stringify(data)), options);
  }

  updateDoc(path: string, data: object) {
    // Check data for any nested arrays (2D/3D)
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key] = data[key].flat(Infinity);
      }
    });
    return this.afs.doc(path).update(JSON.parse(JSON.stringify(data)));
  }

  deleteDoc(path: string) {
    return this.afs.doc(path).delete();
  }

  arrayUnion(path: string, field: string, element: any) {
    const updated = {};
    updated[field] = firestore.FieldValue.arrayUnion(
      JSON.parse(JSON.stringify(element))
    );

    return this.afs.doc(path).update(updated);
  }

  arrayRemove(path: string, field: string, element: any) {
    const updated = {};
    updated[field] = firestore.FieldValue.arrayRemove(
      JSON.parse(JSON.stringify(element))
    );

    return this.afs.doc(path).update(updated);
  }
}
