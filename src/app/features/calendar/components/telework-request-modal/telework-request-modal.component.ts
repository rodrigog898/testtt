import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-telework-request-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Solicitar días de teletrabajo</h2>
          <button class="modal-close" (click)="close.emit()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="selected-dates">
            <h3 class="section-title">Días seleccionados ({{ selectedDates.length }})</h3>
            <div class="dates-list">
              <div 
                *ngFor="let date of selectedDates" 
                class="date-chip"
              >
                {{ formatDate(date) }}
              </div>
            </div>
          </div>

          <div class="reason-section">
            <label for="reason" class="form-label">
              Motivo de la solicitud <span class="required">*</span>
            </label>
            <textarea
              id="reason"
              class="form-textarea"
              [(ngModel)]="reason"
              placeholder="Describe el motivo de tu solicitud de teletrabajo..."
              rows="4"
              required
            ></textarea>
            <div class="form-help">
              Proporciona una justificación clara para tu solicitud de teletrabajo.
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button 
            class="btn btn--secondary" 
            (click)="close.emit()"
          >
            Cancelar
          </button>
          <button 
            class="btn btn--primary" 
            [disabled]="!reason.trim() || isSubmitting()"
            (click)="onSubmit()"
          >
            <span *ngIf="isSubmitting()">Enviando...</span>
            <span *ngIf="!isSubmitting()">Enviar solicitud</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 24px;
      padding-bottom: 16px;
    }

    .modal-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-close:hover {
      background-color: var(--sidebar-hover);
      color: var(--text-primary);
    }

    .modal-close svg {
      width: 20px;
      height: 20px;
    }

    .modal-body {
      padding: 0 24px;
    }

    .selected-dates {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 16px;
      margin-top: 0;
    }

    .dates-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .date-chip {
      background-color: #f0f9ff;
      color: #0369a1;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid #bae6fd;
    }

    .reason-section {
      margin-bottom: 32px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .required {
      color: #ef4444;
    }

    .form-textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      transition: border-color 0.2s ease;
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--reale-blue);
      box-shadow: 0 0 0 3px rgba(0, 75, 155, 0.1);
    }

    .form-help {
      font-size: 12px;
      color: var(--text-secondary);
      margin-top: 6px;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid var(--border-color);
      margin-top: 24px;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn--primary {
      background-color: var(--reale-blue);
      color: white;
    }

    .btn--primary:hover:not(:disabled) {
      background-color: #003d82;
    }

    .btn--secondary {
      background-color: #f8f9fa;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }

    .btn--secondary:hover {
      background-color: #e9ecef;
    }

    @media (max-width: 640px) {
      .modal-overlay {
        padding: 10px;
      }

      .modal-content {
        max-height: 95vh;
      }

      .modal-header,
      .modal-body,
      .modal-footer {
        padding-left: 16px;
        padding-right: 16px;
      }

      .dates-list {
        gap: 6px;
      }

      .date-chip {
        font-size: 12px;
        padding: 6px 12px;
      }
    }
  `]
})
export class TeleworkRequestModalComponent {
  @Input({ required: true }) selectedDates: Date[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();

  public readonly isSubmitting = signal<boolean>(false);
  public reason = '';

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.reason.trim()) return;

    this.isSubmitting.set(true);
    
    try {
      this.submit.emit(this.reason.trim());
    } finally {
      this.isSubmitting.set(false);
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(date);
  }
}