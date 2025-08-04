import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
  section: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar" *ngIf="authService.isAuthenticated()">
      <div class="sidebar-content">

        <!-- MAIN Section -->
        <div class="menu-section">
          <h3 class="section-title">PRINCIPAL</h3>
          <ul class="menu-list">
            <li *ngFor="let item of getMenuItemsBySection('main')" class="menu-item">
              <a 
                [routerLink]="item.route" 
                routerLinkActive="active"
                class="menu-link"
              >
                <div class="menu-icon" [innerHTML]="item.icon"></div>
                <span class="menu-text">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- GESTIÓN Section -->
        <div class="menu-section">
          <h3 class="section-title">GESTIÓN</h3>
          <ul class="menu-list">
            <li *ngFor="let item of getMenuItemsBySection('management')" class="menu-item">
              <a 
                [routerLink]="item.route" 
                routerLinkActive="active"
                class="menu-link"
              >
                <div class="menu-icon" [innerHTML]="item.icon"></div>
                <span class="menu-text">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- CONFIGURACIÓN Section -->
        <div class="menu-section">
          <h3 class="section-title">CONFIGURACIÓN</h3>
          <ul class="menu-list">
            <li *ngFor="let item of getMenuItemsBySection('settings')" class="menu-item">
              <a 
                [routerLink]="item.route" 
                routerLinkActive="active"
                class="menu-link"
              >
                <div class="menu-icon" [innerHTML]="item.icon"></div>
                <span class="menu-text">{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 80px;
      left: 0;
      width: 250px;
      height: calc(100vh - 80px);
      background-color: var(--sidebar-bg);
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      transition: transform 0.3s ease;
    }

    .sidebar-content {
      padding: 24px 16px;
    }

    .menu-section + .menu-section {
      margin-top: 32px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-left: 12px;
    }

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .menu-item {
      margin-bottom: 4px;
    }

    .menu-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
    }

    .menu-link:hover {
      background-color: var(--sidebar-hover);
      color: var(--text-primary);
    }

    .menu-link.active {
      background-color: #e3f2fd;
      color: var(--reale-blue);
      font-weight: 600;
    }

    .menu-link.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background-color: var(--reale-blue);
      border-radius: 0 2px 2px 0;
    }

    .menu-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-icon :global(svg) {
      width: 20px;
      height: 20px;
      stroke: currentColor;
    }

    .menu-text {
      flex: 1;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .sidebar.open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  public readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      section: 'main',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>`
    },
    {
      label: 'Calendario',
      route: '/calendar',
      section: 'main',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>`
    },
    {
      label: 'Mis Solicitudes',
      route: '/calendar/requests',
      section: 'management',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>`
    },
    {
      label: 'Configuración',
      route: '/settings',
      section: 'settings',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5L19 4.5M5 19.5l1.5-1.5M19 19.5l-1.5-1.5M5 4.5L6.5 6"/>
      </svg>`
    }
  ];

  getMenuItemsBySection(section: string): MenuItem[] {
    return this.menuItems.filter(item => item.section === section);
  }
}