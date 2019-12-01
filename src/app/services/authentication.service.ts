import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AbstractControl, FormGroup } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _user: firebase.User = null;
  private validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'email', message: 'Enter a valid email.' },
      { type: 'pattern', message: `Enter your university's email` },
      { type: 'emailExists', message: 'No such email exists.' }
    ],
    password: [{ type: 'required', message: 'Password is required.' }]
  };
  authState = new BehaviorSubject(false);

  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) this.authState.next(true);
      else this.authState.next(false);
    });
  }

  isAuthenticated() {
    return this.authState.value;
  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  emailExists(control: AbstractControl) {
    // Delay email check by 0.6 seconds after each value change
    return timer(600).pipe(
      switchMap(() => {
        return this.afAuth.auth
          .fetchSignInMethodsForEmail(control.value)
          .then(signInMethods => {
            if (signInMethods.length === 0) {
              return {
                emailExists: {
                  passedInEmail: control.value
                }
              };
            }
            return null;
          });
      })
    );
  }

  validate(form: FormGroup, field: string, error: object): boolean {
    for (let i = 0; i < this.validation_messages[field].length; i++) {
      const validation = this.validation_messages[field][i];
      if (
        form.get(field).hasError(validation.type) &&
        (form.get(field).dirty || form.get(field).touched)
      ) {
        // Set error message
        error[field] = validation.message;
        return false;
      }
    }
    // Clear error message
    error[field] = '';
    return true;
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      // Password is too small, invalid by default
      if (password.length < 6)
        return reject({
          code: 'auth/wrong-password',
          message: 'Invalid password.'
        });
      this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(auth => {
          if (auth.user) {
            this.user = auth.user;
            // this.storage.set('user', JSON.stringify(this.user));
            return resolve();
          }
        })
        .catch(reject);
    });
  }

  // Getters
  get user(): firebase.User {
    return this._user;
  }

  set user(user: firebase.User) {
    this._user = user;
  }
}
