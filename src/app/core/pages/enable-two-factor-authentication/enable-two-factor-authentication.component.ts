import { Component, HostListener, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, take } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { LOGIN_FLASH_MESSSAGE, LOCAL_USER_TOKEN } from 'src/app/shared/utils/constants';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user.model';
import { HttpService } from '../../services/http/http.service';
import { NotifyService } from '../../services/notify/notify.service';

@Component({
  selector: 'app-enable-two-factor-authentication',
  templateUrl: './enable-two-factor-authentication.component.html',
  styleUrls: ['./enable-two-factor-authentication.component.scss']
})
export class EnableTwoFactorAuthenticationComponent {
  private destroy$ = new Subject<void>();

  // Existing properties
  message: string = "";
  twoFactorCode!: string;
  error: boolean = false;
  error_message: string = "";
  loading: boolean = false;
  flash_message: string | null = "";
  appName: string = "";
  logo: string = "";
  recaptchaVerified: boolean = false;
  recaptchaSiteKey: string = "";
  currentYear = new Date().getFullYear();
  loginAttempts = 0;
  maxLoginAttempts = 5;
  isFormAnimating = false;
  uuid: string = "";


  constructor(private authService: AuthService, private dbService: HttpService, private notify: NotifyService, private ar: ActivatedRoute, private appService: AppService, private router: Router) {
    this.appService.appSettings.subscribe(data => {
      this.appName = data.appLongName;
      this.logo = data.logo;
      this.recaptchaSiteKey = data.recaptchaSiteKey;
    });

    this.uuid = this.ar.snapshot.params['uuid'];
    console.log(this.uuid);
  }

  ngOnInit(): void {
    this.initializeComponent();
    console.log(this.uuid);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  private initializeComponent(): void {
    // this.authService.logout();

    this.loadFlashMessage();
    this.addEntranceAnimation();
  }

  private loadFlashMessage(): void {
    this.flash_message = localStorage.getItem(LOGIN_FLASH_MESSSAGE);
    if (this.flash_message != null) {
      localStorage.removeItem(LOGIN_FLASH_MESSSAGE);
    }
  }



  private addEntranceAnimation(): void {
    setTimeout(() => {
      const card = document.querySelector('.login-card');
      card?.classList.add('animated');
    }, 100);
  }

  // Enhanced login method with better error handling

  // Enhanced 2FA submission
  submit2FA(): void {
    if (this.loading || this.isFormAnimating) return;

    if (!this.validate2FAForm()) {
      return;
    }

    this.startLoginProcess();

    let data = new FormData();
    data.append('token', this.twoFactorCode.trim());
    data.append('uuid', this.uuid);
    data.append('device_name', 'practitioners portal');


    this.dbService.post<{ token: string, requires_2fa: boolean, user: User, message: string }>(`portal/auth/verify-google-auth`, data)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
        },
        error: (err) => {
          this.handleLoginError(err);
        },
      });
  }


  private validate2FAForm(): boolean {
    if (!this.twoFactorCode?.trim()) {
      this.showError('Authentication code is required');
      this.focusField('twoFactorCode');
      return false;
    }

    if (this.twoFactorCode.trim().length !== 6) {
      this.showError('Authentication code must be 6 digits');
      this.focusField('twoFactorCode');
      return false;
    }

    if (!/^\d{6}$/.test(this.twoFactorCode.trim())) {
      this.showError('Authentication code must contain only numbers');
      this.focusField('twoFactorCode');
      return false;
    }

    return true;
  }

  private startLoginProcess(): void {
    this.loading = true;
    this.clearErrors();
    this.isFormAnimating = true;
  }

  private handleLoginSuccess(response: any): void {

    // Store token and redirect
    localStorage.setItem(LOCAL_USER_TOKEN, response.token);
    this.authService.isLoggedIn$.next(true);

    // Show success message
    this.notify.successNotification('2 Factor Authentication enabled successfully');

    this.router.navigate(['/login']);
  }

  private handleLoginError(err: any): void {
    this.loading = false;
    this.isFormAnimating = false;
    this.loginAttempts++;

    const errorMessage = err.error?.message || 'Verification failed. Please check the code you entered.';
    this.showError(errorMessage);

    // Add shake animation for visual feedback
    // this.addShakeAnimation();

    // Check for too many failed attempts
    if (this.loginAttempts >= this.maxLoginAttempts) {
      this.handleTooManyAttempts();
    }

  }

  private handleRecaptchaError(): void {
    this.error = true;
    this.error_message = "Please complete the reCAPTCHA verification";
    this.notify.failNotification("reCAPTCHA verification required");
    // this.addShakeAnimation();
  }

  private handleTooManyAttempts(): void {
    this.notify.failNotification('Too many failed attempts. Please wait before trying again or use the forgot password option.');

    // Optionally disable form temporarily
    setTimeout(() => {
      this.loginAttempts = 0; // Reset after some time
    }, 300000); // 5 minutes
  }



  // Enhanced reCAPTCHA handling
  resolved(response: string | null): void {
    if (!response) {
      this.recaptchaError();
      return;
    }

    const body = { 'g-recaptcha-response': response };
    this.dbService.post<{ message: string }>('api/verify-recaptcha', body)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          this.recaptchaVerified = true;
          this.clearErrors();
          this.notify.successNotification('reCAPTCHA verified successfully');
        },
        error: (err) => {
          this.recaptchaVerified = false;
          this.showError("reCAPTCHA verification failed. Please try again");
          this.notify.failNotification("reCAPTCHA verification failed");
        },
      });
  }

  recaptchaError(): void {
    this.recaptchaVerified = false;
    this.showError("reCAPTCHA verification failed. Please try again");
    this.notify.failNotification("reCAPTCHA verification failed");
  }



  // Utility methods for enhanced UX
  private showError(message: string): void {
    this.error = true;
    this.error_message = message;
  }

  private clearErrors(): void {
    this.error = false;
    this.error_message = '';
  }

  private focusField(fieldName: string): void {
    setTimeout(() => {
      const field = document.querySelector(`input[name="${fieldName}"]`) as HTMLInputElement;
      field?.focus();
    }, 100);
  }

  private addShakeAnimation(): void {
    const card = document.querySelector('.login-card');
    if (card) {
      card.classList.add('shake');
      setTimeout(() => {
        card.classList.remove('shake');
      }, 500);
    }
  }

  private addFormTransition(): void {
    const form = document.querySelector('.login-form');
    if (form) {
      form.classList.add('fade-transition');
      setTimeout(() => {
        form.classList.remove('fade-transition');
      }, 300);
    }
  }

  // Keyboard event handling for better accessibility
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Handle Enter key
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submit2FA();

    }

    // Handle Escape key to clear errors
    if (event.key === 'Escape') {
      this.clearErrors();
    }

    // Handle Tab navigation enhancement
    if (event.key === 'Tab') {
      this.handleTabNavigation(event);
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    // Add visual feedback for keyboard navigation
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'BUTTON') {
        activeElement.classList.add('keyboard-focus');
        setTimeout(() => {
          activeElement.classList.remove('keyboard-focus');
        }, 200);
      }
    }, 50);
  }

  // Format 2FA input to ensure only numbers
  onTwoFactorInput(event: any): void {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    this.twoFactorCode = value;

    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      setTimeout(() => {
        this.submit2FA();
      }, 500); // Small delay for better UX
    }
  }

  get is2FAFormValid(): boolean {
    return !!(this.twoFactorCode?.trim() &&
      this.twoFactorCode.trim().length === 6 &&
      /^\d{6}$/.test(this.twoFactorCode.trim()));
  }

  // Logout method (keeping existing functionality)
  logout(): void {
    this.authService.logout();
  }


  onPasswordChange(): void {
    // Clear password-related errors when user starts typing
    if (this.error_message.toLowerCase().includes('password')) {
      this.clearErrors();
    }
  }

  // Check if user has exceeded login attempts
  get hasExceededAttempts(): boolean {
    return this.loginAttempts >= this.maxLoginAttempts;
  }
}
