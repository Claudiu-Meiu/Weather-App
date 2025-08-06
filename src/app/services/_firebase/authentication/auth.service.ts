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

  public signInEmail: string = '';
  public signInPassword: string = '';

  public signUpDisplayName: string = '';
  public signUpEmail: string = '';
  public signUpPassword: string = '';
  public signUpConfirmPassword: string = '';

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

  public async signIn(): Promise<UserCredential> {
    const userCredential = await signInWithEmailAndPassword(
      this._auth,
      this.signInEmail,
      this.signInPassword
    );
    return userCredential;
  }

  public async signUp(): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this._auth,
        this.signUpEmail,
        this.signUpPassword
      );
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: this.signUpDisplayName,
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

  public async deleteAccount(): Promise<void> {
    if (this._user) {
      try {
        const credential = await this.signIn();
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

  public clearAuthInputs(): void {
    this.signInEmail = '';
    this.signInPassword = '';
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.signUpConfirmPassword = '';
    this.signUpDisplayName = '';
  }

  public showSignInDialog(): boolean {
    this.clearAuthInputs();
    this.signUpDialogVisible = false;
    return (this.signInDialogVisible = !this.signInDialogVisible);
  }

  public showSignUpDialog(): boolean {
    this.clearAuthInputs();
    this.signInDialogVisible = false;
    return (this.signUpDialogVisible = !this.signUpDialogVisible);
  }

  public showUserDialog(): boolean {
    return (this.userDialogVisible = !this.userDialogVisible);
  }

  public showSignOutDialog(): boolean {
    this.clearAuthInputs();
    return (this.signOutDialogVisible = !this.signOutDialogVisible);
  }

  public showDeleteAccountDialog(): boolean {
    this.clearAuthInputs();
    return (this.deleteAccountDialogVisible = !this.deleteAccountDialogVisible);
  }
}
