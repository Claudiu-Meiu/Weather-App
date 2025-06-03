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

  public getUser(): User | null {
    return this._user;
  }

  private _listenForAuthChanges(): void {
    onAuthStateChanged(this._auth, (user) => {
      console.log('Auth state changed:', user);
      this._user = user;
    });
  }

  public async signIn(
    email: string,
    password: string
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this._auth, email, password);
  }

  public async signOut(): Promise<void> {
    return signOut(this._auth);
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
        console.log('User created and profile updated:', userCredential.user);
      }
      return userCredential;
    } catch (error) {
      console.error('Error in signUp service:', error);
      throw error;
    }
  }

  public async deleteAccount(): Promise<void> {
    if (this._user) {
      try {
        await deleteUser(this._user);
        console.log('User account deleted successfully');
        this._user = null;
      } catch (error) {
        console.error('Error deleting user account:', error);
        throw error;
      }
    } else {
      console.error('No user is currently signed in');
      throw new Error('No user is currently signed in');
    }
  }
}
