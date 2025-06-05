import { Injectable } from '@angular/core';
import {
  type Auth,
  type User,
  type UserCredential,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  deleteUser, // Import deleteUser
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth: Auth;
  private _user: User | null = null;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this._auth = getAuth(app);
    this._listenForAuthChanges();
  }

  private _listenForAuthChanges(): void {
    onAuthStateChanged(this._auth, (user) => {
      this._user = user;
    });
  }

  public getUser(): User | null {
    return this._user;
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
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

  public async deleteAccount(email: string, password: string): Promise<void> {
    if (this._user) {
      try {
        const credential = await this.signIn(email, password);
        if (credential.user) {
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

  public async signOut(): Promise<void> {
    return signOut(this._auth);
  }
}
