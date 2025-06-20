import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

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
      await this.authService.signIn();
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
    this.authService.clearAuthInputs();
  }

  public async signUp(): Promise<void> {
    try {
      await this.authService.signUp();
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
    this.authService.clearAuthInputs();
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
    this.authService.clearAuthInputs();
  }

  public async deleteAccount(): Promise<void> {
    try {
      await this.authService.deleteAccount();
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
    this.authService.clearAuthInputs();
  }

  public verifySignIn(): boolean {
    const email = this.authService.signInEmail;
    const password = this.authService.signInPassword;

    const checkEmailFormat = this.checkEmailFormat(email);

    if (!checkEmailFormat || password.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  public verifySignUp(): boolean {
    const displayName = this.authService.signUpDisplayName;
    const email = this.authService.signUpEmail;
    const password = this.authService.signUpPassword;
    const confirmPassword = this.authService.signUpConfirmPassword;

    const checkEmailFormat = this.checkEmailFormat(email);
    const hasLowercase = this.hasLowercase(password);
    const hasUppercase = this.hasUppercase(password);
    const hasNumber = this.hasNumber(password);
    const hasSpecialCharacter = this.hasSpecialCharacter(password);

    if (
      displayName.length === 0 ||
      !checkEmailFormat ||
      password.length === 0 ||
      password.length < 8 ||
      confirmPassword !== password ||
      !hasLowercase ||
      !hasUppercase ||
      !hasNumber ||
      !hasSpecialCharacter
    ) {
      return true;
    } else {
      return false;
    }
  }

  public checkEmailFormat(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  public hasLowercase(password: string): boolean {
    return /[a-z]/.test(password);
  }

  public hasUppercase(password: string): boolean {
    return /[A-Z]/.test(password);
  }

  public hasNumber(password: string): boolean {
    return /[0-9]/.test(password);
  }

  public hasSpecialCharacter(password: string): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
}
