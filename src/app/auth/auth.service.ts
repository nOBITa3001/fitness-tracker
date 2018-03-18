import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UiService } from './shared/ui.service.service';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UiService,
    private store: Store<{ ui: fromApp.State }>
  ) { }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    this.afAuth.auth
      .createUserWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(result => {
        this.store.dispatch({ type: 'STOP_LOADING' });
      })
      .catch(error => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    this.afAuth.auth
      .signInWithEmailAndPassword(
        authData.email,
        authData.password
      )
      .then(result => {
        this.store.dispatch({ type: 'STOP_LOADING' });
      })
      .catch(error => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
