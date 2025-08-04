import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <div class="dashboard-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Bienvenido a tu panel de control de teletrabajo</p>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">Calendario</h3>
            <p class="card-description">Gestiona tus días de teletrabajo</p>
            <a routerLink="/calendar" class="card-link">Ver calendario →</a>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">Solicitudes</h3>
            <p class="card-description">Revisa el estado de tus solicitudes</p>
            <a routerLink="/calendar/requests" class="card-link">Ver solicitudes →</a>
          </div>
        </div>

        <div class="dashboard-card">
          <div class="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4m6-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-6 0a2 2 0 0 0-2-2v-3a2 2 0 0 0 2-2m6 0a2 2 0 0 1 2-2v-3a2 2 0 0 1-2-2"/>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">Estadísticas</h3>
            <p class="card-description">Visualiza tus métricas de teletrabajo</p>
            <span class="card-link disabled">Próximamente →</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 32px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 48px;
      text-align: center;
    }

    .page-title {
      font-size: 36px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 12px 0;
    }

    .page-subtitle {
      font-size: 18px;
      color: var(--text-secondary);
      margin: 0;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 24px;
    }

    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .dashboard-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .card-icon {
      width: 64px;
      height: 64px;
      background-color: #f0f9ff;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      color: var(--reale-blue);
    }

    .card-icon svg {
      width: 32px;
      height: 32px;
    }

    .card-content {
      flex: 1;
    }

    .card-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 8px 0;
    }

    .card-description {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0 0 24px 0;
      line-height: 1.5;
    }

    .card-link {
      color: var(--reale-blue);
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: color 0.2s ease;
    }

    .card-link:hover {
      color: #003d82;
    }

    .card-link.disabled {
      color: var(--text-muted);
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .dashboard-page {
        padding: 16px;
      }

      .dashboard-header {
        margin-bottom: 32px;
      }

      .page-title {
        font-size: 28px;
      }

      .page-subtitle {
        font-size: 16px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .dashboard-card {
        padding: 24px;
      }
    }
  `]
})
export class DashboardPageComponent { }