import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css'
})
export class AuthCallbackComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  readonly toast = inject(ToastService);

  readonly processing = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    void this.handleCallback();
  }

  private async handleCallback(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.processing.set(false);
      this.errorMessage.set('Google login token not found.');
      this.toast.show('Google login failed. Please try again.', 'error');
      setTimeout(() => void this.router.navigate(['/login']), 1500);
      return;
    }

    try {
      const authResponse = await this.api.getGoogleAuthSuccess(token);
      this.auth.storeAuthSession(authResponse);
      this.toast.show(`Welcome, ${authResponse.name}! 🎉`, 'success');
      void this.router.navigate(['/calculator']);
    } catch (error: any) {
      this.processing.set(false);
      this.errorMessage.set(error?.error?.message || 'Unable to complete Google sign-in.');
      this.toast.show(this.errorMessage(), 'error');
      setTimeout(() => void this.router.navigate(['/login']), 1800);
    }
  }
}