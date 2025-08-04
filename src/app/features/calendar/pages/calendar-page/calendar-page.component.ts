import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CalendarService } from '../../../../core/services/calendar.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CalendarMonth, CalendarDay } from '../../../../core/models/calendar.model';
import { CalendarWidgetComponent } from '../../components/calendar-widget/calendar-widget.component';
import { CalendarLegendComponent } from '../../components/calendar-legend/calendar-legend.component';
import { TeleworkRequestModalComponent } from '../../components/telework-request-modal/telework-request-modal.component';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    CalendarWidgetComponent,
    CalendarLegendComponent,
    TeleworkRequestModalComponent
  ],
  template: `
    <div class="calendar-page">
      <div class="calendar-header">
        <h1 class="page-title">Mi calendario de teletrabajo</h1>
        
        <div class="calendar-actions">
          <button 
            class="btn btn--primary"
            [disabled]="selectedDatesCount() === 0"
            (click)="showRequestModal.set(true)"
          >
            Solicitar días ({{ selectedDatesCount() }})
          </button>
          
          <button 
            class="btn btn--secondary"
            [disabled]="selectedDatesCount() === 0"
            (click)="clearSelection()"
          >
            Limpiar selección
          </button>
        </div>
      </div>

      <app-calendar-legend></app-calendar-legend>

      <div class="calendars-container">
        <div class="calendar-navigation">
          <button class="nav-btn" (click)="navigateMonth('prev')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          
          <h2 class="current-period">{{ currentPeriodText() }}</h2>
          
          <button class="nav-btn" (click)="navigateMonth('next')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        <div class="calendars-grid">
          <app-calendar-widget
            *ngFor="let calendar of calendars(); trackBy: trackByMonth"
            [calendar]="calendar"
            (daySelected)="onDaySelected($event)"
          ></app-calendar-widget>
        </div>
      </div>

      <app-telework-request-modal
        *ngIf="showRequestModal()"
        [selectedDates]="calendarService.selectedDates()"
        (close)="showRequestModal.set(false)"
        (submit)="onRequestSubmit($event)"
      ></app-telework-request-modal>
    </div>
  `,
  styles: [`
    .calendar-page {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .calendar-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 8px;
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
      transform: translateY(-1px);
    }

    .btn--secondary {
      background-color: #f8f9fa;
      color: var(--text-secondary);
      border: 1px solid var(--border-color);
    }

    .btn--secondary:hover:not(:disabled) {
      background-color: #e9ecef;
    }

    .calendars-container {
      margin-top: 32px;
    }

    .calendar-navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-bottom: 32px;
    }

    .nav-btn {
      background: none;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-btn:hover {
      background-color: var(--sidebar-hover);
      border-color: var(--reale-blue);
      color: var(--reale-blue);
    }

    .nav-btn svg {
      width: 20px;
      height: 20px;
    }

    .current-period {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
      min-width: 200px;
      text-align: center;
    }

    .calendars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 32px;
    }

    @media (max-width: 768px) {
      .calendar-page {
        padding: 16px;
      }

      .calendar-header {
        flex-direction: column;
        align-items: stretch;
      }

      .calendar-actions {
        justify-content: center;
      }

      .calendars-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
})
export class CalendarPageComponent implements OnInit {
  public readonly calendarService = inject(CalendarService);
  private readonly notificationService = inject(NotificationService);

  public readonly calendars = signal<CalendarMonth[]>([]);
  public readonly showRequestModal = signal<boolean>(false);
  public readonly isLoading = signal<boolean>(false);

  public readonly selectedDatesCount = computed(() => 
    this.calendarService.selectedDates().length
  );

  public readonly currentPeriodText = computed(() => {
    const currentMonth = this.calendarService.currentMonth();
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const thirdMonth = new Date(currentMonth);
    thirdMonth.setMonth(thirdMonth.getMonth() + 2);

    return `${this.getMonthName(currentMonth.getMonth())} - ${this.getMonthName(thirdMonth.getMonth())} ${currentMonth.getFullYear()}`;
  });

  ngOnInit(): void {
    this.loadCalendars();
    
    // Subscribe to current month changes
    this.calendarService.currentMonth$.subscribe(() => {
      this.loadCalendars();
    });
  }

  private async loadCalendars(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      const currentMonth = this.calendarService.currentMonth();
      const calendarsPromises = [];

      // Load 3 consecutive months
      for (let i = 0; i < 3; i++) {
        const date = new Date(currentMonth);
        date.setMonth(date.getMonth() + i);
        calendarsPromises.push(
          this.calendarService.generateCalendarMonth(date.getFullYear(), date.getMonth()).toPromise()
        );
      }

      const calendarsData = await Promise.all(calendarsPromises);
      this.calendars.set(calendarsData.filter(Boolean) as CalendarMonth[]);
    } catch (error) {
      console.error('Error loading calendars:', error);
      this.notificationService.showError('Error al cargar los calendarios');
    } finally {
      this.isLoading.set(false);
    }
  }

  onDaySelected(day: CalendarDay): void {
    this.calendarService.selectDate(day.date);
  }

  navigateMonth(direction: 'prev' | 'next'): void {
    this.calendarService.navigateMonth(direction);
  }

  clearSelection(): void {
    this.calendarService.clearSelection();
  }

  async onRequestSubmit(reason: string): Promise<void> {
    try {
      await this.calendarService.submitTeleworkRequest(reason).toPromise();
      this.showRequestModal.set(false);
      this.notificationService.showSuccess('Solicitud enviada correctamente');
      this.loadCalendars(); // Reload to show updated status
    } catch (error) {
      console.error('Error submitting request:', error);
      this.notificationService.showError('Error al enviar la solicitud');
    }
  }

  trackByMonth(index: number, calendar: CalendarMonth): string {
    return `${calendar.month}-${calendar.year}`;
  }

  private getMonthName(month: number): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month];
  }
}