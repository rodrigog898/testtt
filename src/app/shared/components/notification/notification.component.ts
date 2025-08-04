import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notificationService.notifications(); trackBy: trackByFn"
        class="notification"
        [ngClass]="'notification--' + notification.type"
        [@slideIn]
      >
        <div class="notification__icon">
          <svg *ngIf="notification.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
          <svg *ngIf="notification.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <svg *ngIf="notification.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg *ngIf="notification.type === 'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>
        
        <div class="notification__content">
          <h4 class="notification__title">{{ notification.title }}</h4>
          <p *ngIf="notification.message" class="notification__message">{{ notification.message }}</p>
        </div>
        
        <button 
          class="notification__close"
          (click)="notificationService.removeNotification(notification.id)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 100px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: white;
      border-left: 4px solid;
    }

    .notification--success { border-left-color: #10b981; }
    .notification--error { border-left-color: #ef4444; }
    .notification--warning { border-left-color: #f59e0b; }
    .notification--info { border-left-color: #3b82f6; }

    .notification__icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
    }

    .notification--success .notification__icon { color: #10b981; }
    .notification--error .notification__icon { color: #ef4444; }
    .notification--warning .notification__icon { color: #f59e0b; }
    .notification--info .notification__icon { color: #3b82f6; }

    .notification__content {
      flex: 1;
      min-width: 0;
    }

    .notification__title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .notification__message {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      line-height: 1.4;
    }

    .notification__close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 2px;
      border-radius: 4px;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s;
    }

    .notification__close:hover {
      color: #6b7280;
    }

    .notification__close svg {
      width: 14px;
      height: 14px;
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent {
  public readonly notificationService = inject(NotificationService);

  trackByFn(index: number, notification: Notification): string {
    return notification.id;
  }
}