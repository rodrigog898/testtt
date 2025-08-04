import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-header">
          <img
            src="https://www.reale.cl/v2/wp-content/themes/reale_010720/img/logoRealeBlanco.png"
            alt="Reale Seguros"
            class="logo"
          />
          <h1 class="login-title">Iniciar Sesión</h1>
          <p class="login-subtitle">Accede a tu calendario de teletrabajo</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              [(ngModel)]="credentials.email"
              required
              email
              placeholder="tu.email@reale.cl"
              [disabled]="isLoading()"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-input"
              [(ngModel)]="credentials.password"
              required
              placeholder="••••••••"
              [disabled]="isLoading()"
            />
          </div>

          <button
            type="submit"
            class="login-button"
            [disabled]="!loginForm.valid || isLoading()"
          >
            <span *ngIf="isLoading()">Iniciando sesión...</span>
            <span *ngIf="!isLoading()">Iniciar Sesión</span>
          </button>
        </form>

        <div class="login-footer">
          <p class="help-text">
            ¿Problemas para acceder? Contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--reale-blue) 0%, #0056b3 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .login-container {
      background: white;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      height: 48px;
      width: auto;
      margin-bottom: 24px;
      filter: brightness(0) saturate(100%) invert(16%) sepia(99%) saturate(2048%) hue-rotate(210deg) brightness(95%) contrast(101%);
    }

    .login-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 8px 0;
    }

    .login-subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      margin: 0;
    }

    .login-form {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--reale-blue);
      box-shadow: 0 0 0 3px rgba(0, 75, 155, 0.1);
    }

    .form-input:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    .login-button {
      width: 100%;
      padding: 14px 24px;
      background-color: var(--reale-blue);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .login-button:hover:not(:disabled) {
      background-color: #003d82;
      transform: translateY(-1px);
    }

    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .login-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid var(--border-color);
    }

    .help-text {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 32px 24px;
      }

      .login-title {
        font-size: 24px;
      }

      .login-subtitle {
        font-size: 14px;
      }
    }
  `]
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  public readonly isLoading = signal<boolean>(false);

  public credentials = {
    email: '',
    password: ''
  };

  async onSubmit(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);

    try {
      await this.authService.login(this.credentials).toPromise();
      this.notificationService.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error?.error?.message || 'Error al iniciar sesión';
      this.notificationService.showError('Error de autenticación', message);
    } finally {
      this.isLoading.set(false);
    }
  }
}