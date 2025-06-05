import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RealtimeDatabaseService } from '../realtime-database/realtime-database.service';

import { initializeApp } from 'firebase/app';
import { environment } from '../../../../environments/environment';
import {
  type Auth,
  type User,
  type UserCredential,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  signOut,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _realtimeDatabaseService = inject(RealtimeDatabaseService);

  private _auth: Auth;
  private _user: User | null = null;

  private _userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  public user$ = this._userSubject.asObservable();

  public signInDialogVisible: boolean = false;
  public signUpDialogVisible: boolean = false;
  public userDialogVisible: boolean = false;
  public signOutDialogVisible: boolean = false;
  public deleteAccountDialogVisible: boolean = false;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this._auth = getAuth(app);
    this._listenForAuthChanges();
  }

  private _listenForAuthChanges(): void {
    onAuthStateChanged(this._auth, (user) => {
      this._user = user;
      this._userSubject.next(user);
    });
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(
      this._auth,
      email,
      password
    );
    return userCredential;
  }

  public async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        email,
        password
      );
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }
      return userCredential;
    } catch (error) {
      console.error('Error in signUp service:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    return signOut(this._auth);
  }

  public async deleteAccount(email: string, password: string): Promise<void> {
    if (this._user) {
      try {
        const credential = await this.signIn(email, password);
        if (credential.user) {
          await this._realtimeDatabaseService.deleteUserData(
            credential.user.uid
          );
          await deleteUser(credential.user);
          this._user = null;
        }
      } catch (error) {
        console.error('Error deleting user account:', error);
        throw error;
      }
    } else {
      console.error('No user is currently signed in');
      throw new Error('No user is currently signed in');
    }
  }

  public showSignInDialog(): void {
    this.signUpDialogVisible = false;
    this.signInDialogVisible = true;
  }

  public showSignUpDialog(): void {
    this.signInDialogVisible = false;
    this.signUpDialogVisible = true;
  }

  public showUserDialog(): void {
    this.userDialogVisible = true;
  }

  public showSignOutDialog(): void {
    this.signOutDialogVisible = true;
  }

  public showDeleteAccountDialog() {
    this.deleteAccountDialogVisible = true;
  }
}
