import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo-container">
          <img
            src="https://www.reale.cl/v2/wp-content/themes/reale_010720/img/logoRealeBlanco.png"
            alt="Reale Seguros"
            class="logo"
          />
        </div>
        
        <div class="header-actions" *ngIf="authService.isAuthenticated()">
          <div class="user-info">
            <span class="user-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</span>
            <span class="user-role">{{ authService.currentUser()?.role }}</span>
          </div>
          
          <div class="user-menu">
            <button class="avatar-button" (click)="toggleUserMenu()">
              <div class="avatar">
                {{ getInitials() }}
              </div>
            </button>
            
            <div class="dropdown-menu" *ngIf="showUserMenu">
              <button class="dropdown-item" (click)="logout()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--reale-blue);
      border-bottom: 1px solid var(--border-color);
      height: 80px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 24px;
    }

    .logo-container { 
      display: flex; 
      align-items: center; 
    }
    
    .logo { 
      height: 40px; 
      width: auto; 
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      color: white;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
    }

    .user-role {
      font-size: 12px;
      opacity: 0.8;
      text-transform: capitalize;
    }

    .user-menu {
      position: relative;
    }

    .avatar-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    .avatar:hover {
      background-color: rgba(255,255,255,0.3);
      border-color: rgba(255,255,255,0.5);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 1px solid var(--border-color);
      min-width: 160px;
      z-index: 1001;
    }

    .dropdown-item {
      width: 100%;
      padding: 12px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: var(--text-primary);
      transition: background-color 0.2s ease;
    }

    .dropdown-item:hover {
      background-color: var(--sidebar-hover);
    }

    .dropdown-item:first-child {
      border-radius: 8px 8px 0 0;
    }

    .dropdown-item:last-child {
      border-radius: 0 0 8px 8px;
    }

    .dropdown-item svg {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .user-info {
        display: none;
      }

      .header-content {
        padding: 0 16px;
      }
    }
  `]
})
export class HeaderComponent {
  public readonly authService = inject(AuthService);
  
  public showUserMenu = false;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  getInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    
    const firstInitial = user.firstName?.charAt(0) || '';
    const lastInitial = user.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
  }
}