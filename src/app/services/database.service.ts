import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private afs: AngularFirestore) {}

  getCollection(path: string, options?: firebase.firestore.GetOptions) {
    return new Promise<firebase.firestore.QuerySnapshot>((resolve, reject) =>
      this.afs
        .collection(path)
        .get(options)
        .subscribe(doc => resolve(doc), reject)
    );
  }

  createDoc(path: string, data: object) {
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
