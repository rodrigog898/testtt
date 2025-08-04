import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  
  public readonly notifications = signal<Notification[]>([]);
  public readonly notifications$ = this.notificationsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addNotification(notification: Omit<Notification, 'id'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      duration: notification.duration ?? 5000
    };

    const current = this.notificationsSubject.value;
    const updated = [...current, newNotification];
    
    this.notificationsSubject.next(updated);
    this.notifications.set(updated);

    // Auto remove after duration
    if (!newNotification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  }

  showSuccess(title: string, message?: string, duration?: number): void {
    this.addNotification({ type: 'success', title, message, duration });
  }

  showError(title: string, message?: string, persistent = false): void {
    this.addNotification({ 
      type: 'error', 
      title, 
      message, 
      persistent,
      duration: persistent ? 0 : 8000 
    });
  }

  showWarning(title: string, message?: string, duration?: number): void {
    this.addNotification({ type: 'warning', title, message, duration });
  }

  showInfo(title: string, message?: string, duration?: number): void {
    this.addNotification({ type: 'info', title, message, duration });
  }

  removeNotification(id: string): void {
    const current = this.notificationsSubject.value;
    const updated = current.filter(n => n.id !== id);
    
    this.notificationsSubject.next(updated);
    this.notifications.set(updated);
  }

  clearAll(): void {
    this.notificationsSubject.next([]);
    this.notifications.set([]);
  }
}