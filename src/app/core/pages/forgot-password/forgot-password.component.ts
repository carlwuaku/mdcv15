import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, Subscription, interval, takeUntil } from 'rxjs';
import { HttpService } from '../../services/http/http.service';
import { NotifyService } from '../../services/notify/notify.service';
import { API_PATH } from 'src/app/shared/utils/constants';
interface ResetTokenResponse { message: string, data: { timeout: number } }
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Form states
  currentStep: 'username' | 'password' = 'username';

  // Forms
  usernameForm: FormGroup;
  passwordForm: FormGroup;

  // Loading states
  isSubmittingUsername = false;
  isSubmittingToken = false;
  isSubmittingPassword = false;

  // Timer for token expiration
  timeRemaining = 0;
  timerDisplay = '';
  timerInterval: Subscription | null = null;

  // Password visibility
  hidePassword = true;
  hideConfirmPassword = true;

  // Store username for display
  submittedUsername = '';

  private apiUrl = API_PATH; // Replace with your actual API URL

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private snackBar: MatSnackBar,
    private router: Router,
    private notify: NotifyService
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });


    this.passwordForm = this.fb.group({
      token: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {

  }

  // Custom validator for password confirmation
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  }

  // Step 1: Submit username to get token
  onSubmitUsername(): void {
    if (this.usernameForm.valid) {
      this.isSubmittingUsername = true;
      const username = this.usernameForm.value.username;

      this.http.post<ResetTokenResponse>(`${this.apiUrl}/send-reset-token`, {
        username: username
      }).subscribe({
        next: (response) => {
          this.submittedUsername = username;
          this.currentStep = 'password';
          this.startTimer(response.data.timeout); // 15 minutes in seconds
          this.notify.successNotification(response.message);
          this.isSubmittingUsername = false;
        },
        error: (error) => {
          const message = error.error?.message || 'An error occurred. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
          this.isSubmittingUsername = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.usernameForm);
    }
  }



  // Step 3: Submit new password
  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      this.isSubmittingPassword = true;
      const token = this.passwordForm.value.token;
      const newPassword = this.passwordForm.value.newPassword;
      const confirmPassword = this.passwordForm.value.confirmPassword;

      this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, {
        token: token,
        username: this.usernameForm.value.username,
        password: newPassword,
        password_confirm: confirmPassword
      }).subscribe({
        next: (response) => {
          this.notify.successNotification(response.message);
          this.router.navigate(['/login']);
          this.isSubmittingPassword = false;
        },
        error: (error) => {
          const message = error.error?.message || 'Failed to reset password. Please try again.';
          this.notify.failNotification(message);
          this.isSubmittingPassword = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  // Resend token
  onResendToken(): void {
    this.isSubmittingUsername = true;

    this.http.post<ResetTokenResponse>(`${this.apiUrl}/send-reset-token`, {
      username: this.submittedUsername
    }).subscribe({
      next: (response) => {
        this.startTimer(response.data.timeout); // Reset timer
        this.passwordForm.reset();
        this.notify.successNotification(response.message);
        this.isSubmittingUsername = false;
      },
      error: (error) => {
        const message = error.error?.message || 'Failed to resend token. Please try again.';
        this.notify.failNotification(message);
        this.isSubmittingUsername = false;
      }
    });
  }

  // Go back to previous step
  goBack(): void {
    switch (this.currentStep) {

      case 'password':
        this.stopTimer();
        this.currentStep = 'username';
        break;
    }
    this.passwordForm.reset();
  }

  // Start countdown timer
  private startTimer(timeout: number): void {
    if (this.timerInterval) {
      this.timerInterval.unsubscribe();
    }
    this.timeRemaining = timeout * 60;
    this.updateTimerDisplay();

    this.timerInterval = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timeRemaining--;
        this.updateTimerDisplay();

        if (this.timeRemaining <= 0) {
          this.stopTimer();
        }
      });
  }

  private stopTimer(): void {
    this.timeRemaining = 0;
    this.timerDisplay = '';
    this.timerInterval?.unsubscribe();
  }

  private updateTimerDisplay(): void {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    this.timerDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Utility method to mark all fields in a form as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  // Getter methods for form validation
  get usernameError(): string {
    const control = this.usernameForm.get('username');
    if (control?.hasError('required') && control?.touched) {
      return 'Username is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Username must be at least 3 characters';
    }
    return '';
  }

  get tokenError(): string {
    const control = this.passwordForm.get('token');
    if (control?.hasError('required') && control?.touched) {
      return 'Token is required';
    }
    if (control?.hasError('pattern') && control?.touched) {
      return 'Token must be exactly 6 digits';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.passwordForm.get('newPassword');

    if (control?.hasError('required') && control?.touched) {
      return 'Password is required';
    }
    if (control?.hasError('minlength') && control?.touched) {
      return 'Password must be at least 8 characters';
    }
    if (control?.hasError('pattern') && control?.touched) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    return '';
  }

  get confirmPasswordError(): string {
    const control = this.passwordForm.get('confirmPassword');
    if (control?.hasError('required') && control?.touched) {
      return 'Password confirmation is required';
    }
    if (control?.hasError('mismatch') && control?.touched) {
      return 'Passwords do not match';
    }
    return '';
  }

  // Format token input (add spaces for better readability)
  onTokenInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    this.passwordForm.get('token')?.setValue(value);
  }
}
