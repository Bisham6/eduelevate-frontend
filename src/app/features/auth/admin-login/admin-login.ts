import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { AdminAuthStore } from '../../../core/admin/admin-auth.store';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss',
})
export class AdminLogin {
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AdminAuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected identifier = signal('bisham65');
  protected password = signal('');
  protected rememberMe = signal(false);
  protected showPassword = signal(false);
  protected loading = signal(false);
  protected errorMessage = signal('');

  protected onSubmit(): void {
    const identifier = this.identifier().trim();
    const password = this.password();

    if (!identifier || !password) {
      this.errorMessage.set('Please enter your username and password.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.adminLogin(identifier, password).subscribe({
      next: (response) => {
        this.authStore.setSession(response.accessToken, response.user, this.rememberMe());
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        this.errorMessage.set('Invalid username or password.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }
}
