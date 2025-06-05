import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/authentication/auth.service';

import { type User } from 'firebase/auth';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    FloatLabel,
    ToastModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private _authService = inject(AuthService);
  private _messageService = inject(MessageService);

  public signInEmail: string = '';
  public signInPassword: string = '';

  public signUpDisplayName: string = '';
  public signUpEmail: string = '';
  public signUpPassword: string = '';
  public signUpConfirmPassword: string = '';

  public reAuthEmail: string = '';
  public reAuthPassword: string = '';

  public signInDialogVisible: boolean = false;
  public signUpDialogVisible: boolean = false;
  public userDialogVisible: boolean = false;
  public deleteAccountDialogVisible: boolean = false;
  public signOutDialogVisible: boolean = false;

  public get currentUser(): User | null {
    return this._authService.getUser();
  }

  public async signIn(): Promise<void> {
    try {
      await this._authService.signIn(this.signInEmail, this.signInPassword);
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Signed in successfully!',
        life: 3000,
      });
      this.signInDialogVisible = false;
    } catch (error: any) {
      console.error('Signing in failed', error);
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Signing in failed! \n Invalid email or password.`,
        life: 3000,
      });
    }
    this._clearAuthInputs();
  }

  public async signUp(): Promise<void> {
    try {
      await this._authService.signUp(
        this.signUpEmail,
        this.signUpPassword,
        this.signUpDisplayName
      );
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account created successfully!',
        life: 3000,
      });
      this.signUpDialogVisible = false;
    } catch (error: any) {
      console.error('Account creation failed', error);
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Account creation failed!',
        life: 3000,
      });
    }
    this._clearAuthInputs();
  }

  public async deleteAccount(): Promise<void> {
    try {
      await this._authService.deleteAccount(
        this.reAuthEmail,
        this.reAuthPassword
      );
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account deleted successfully!',
        life: 3000,
      });
      this.userDialogVisible = false;
      this.deleteAccountDialogVisible = false;
    } catch (error: any) {
      console.error('Account deletion failed', error);
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Account deletion failed! \n Invalid email or password.`,
        life: 3000,
      });
    }
    this._clearAuthInputs();
  }

  public async signOut(): Promise<void> {
    try {
      await this._authService.signOut();
      this._messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Signed out successfully!',
        life: 3000,
      });
      this.userDialogVisible = false;
      this.signOutDialogVisible = false;
    } catch (error: any) {
      console.error('Sign out failed', error);
      this._messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Sign out failed!',
        life: 3000,
      });
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

  public async showDeleteAccountDialog(): Promise<void> {
    this.deleteAccountDialogVisible = true;
  }

  public showSignOutDialog(): void {
    this.signOutDialogVisible = true;
  }

  private _clearAuthInputs(): void {
    this.signInEmail = '';
    this.signInPassword = '';
    this.signUpEmail = '';
    this.signUpPassword = '';
    this.signUpConfirmPassword = '';
    this.signUpDisplayName = '';
    this.reAuthEmail = '';
    this.reAuthPassword = '';
  }
}
