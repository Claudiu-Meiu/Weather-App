import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/_firebase/authentication/auth.service';

import { type User } from 'firebase/auth';

import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { Subject, takeUntil } from 'rxjs';

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
export class AuthComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);
  private _messageService = inject(MessageService);

  private _destroy$ = new Subject<void>();

  public user: User | null = null;

  public signInEmail: string = '';
  public signInPassword: string = '';

  public signUpDisplayName: string = '';
  public signUpEmail: string = '';
  public signUpPassword: string = '';
  public signUpConfirmPassword: string = '';

  public reAuthEmail: string = '';
  public reAuthPassword: string = '';

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this._destroy$))
      .subscribe((user: User | null) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public async signIn(): Promise<void> {
    try {
      await this.authService.signIn(this.signInEmail, this.signInPassword);
      this.authService.signInDialogVisible = false;
      window.location.reload();
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
      await this.authService.signUp(
        this.signUpEmail,
        this.signUpPassword,
        this.signUpDisplayName
      );
      this.authService.signUpDialogVisible = false;
      window.location.reload();
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

  public async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
      this.authService.userDialogVisible = false;
      this.authService.signOutDialogVisible = false;
      window.location.reload();
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

  public async deleteAccount(): Promise<void> {
    try {
      await this.authService.deleteAccount(
        this.reAuthEmail,
        this.reAuthPassword
      );
      window.location.reload();
      this.authService.userDialogVisible = false;
      this.authService.deleteAccountDialogVisible = false;
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

  public showSignInDialog(): void {
    this.authService.showSignInDialog();
  }

  public showSignUpDialog(): void {
    this.authService.showSignUpDialog();
  }

  public showUserDialog(): void {
    this.authService.showUserDialog();
  }

  public showSignOutDialog(): void {
    this.authService.showSignOutDialog();
  }

  public showDeleteAccountDialog() {
    this.authService.showDeleteAccountDialog();
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
