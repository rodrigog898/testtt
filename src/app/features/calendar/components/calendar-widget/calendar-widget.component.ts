import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarMonth, CalendarDay } from '../../../../core/models/calendar.model';

@Component({
  selector: 'app-calendar-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-widget">
      <div class="calendar-header">
        <h3 class="month-title">{{ calendar.month }} {{ calendar.year }}</h3>
      </div>
      
      <div class="calendar-grid">
        <div class="weekdays">
          <div *ngFor="let day of weekDays" class="weekday">{{ day }}</div>
        </div>
        
        <div class="days-grid">
          <div 
            *ngFor="let day of calendar.days; trackBy: trackByDay" 
            class="day-cell"
            [ngClass]="{
              'day-cell--other-month': !day.isCurrentMonth,
              'day-cell--today': day.isToday,
              'day-cell--weekend': day.isWeekend,
              'day-cell--holiday': day.isHoliday,
              'day-cell--available': day.isAvailable,
              'day-cell--selected': day.isSelected,
              'day-cell--requested': day.isRequested,
              'day-cell--clickable': day.isCurrentMonth && day.isAvailable
            }"
            (click)="onDayClick(day)"
            [title]="getDayTitle(day)"
          >
            <span class="day-number">{{ day.day }}</span>
            <div *ngIf="day.metadata?.holidayName" class="day-label">
              {{ day.metadata.holidayName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-widget {
      background: white;
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: box-shadow 0.2s ease;
    }

    .calendar-widget:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .calendar-header {
      margin-bottom: 24px;
      text-align: center;
    }

    .month-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .calendar-grid {
      width: 100%;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
      margin-bottom: 12px;
    }

    .weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      padding: 12px 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .day-cell {
      min-height: 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s ease;
      position: relative;
      padding: 4px;
    }

    .day-cell--clickable {
      cursor: pointer;
    }

    .day-cell--clickable:hover {
      background-color: var(--sidebar-hover);
      transform: scale(1.05);
    }

    .day-number {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .day-label {
      font-size: 10px;
      color: var(--text-muted);
      text-align: center;
      line-height: 1.2;
      margin-top: 2px;
    }

    .day-cell--other-month .day-number {
      color: var(--text-muted);
    }

    .day-cell--today {
      background-color: var(--reale-blue);
      color: white;
    }

    .day-cell--today .day-number {
      color: white;
      font-weight: 700;
    }

    .day-cell--weekend {
      background-color: #f8fafc;
    }

    .day-cell--weekend .day-number {
      color: #9ca3af;
    }

    .day-cell--holiday {
      background-color: #fef2f2;
      border: 2px solid #fecaca;
    }

    .day-cell--holiday .day-number {
      color: #ef4444;
      font-weight: 600;
    }

    .day-cell--available {
      background-color: #f0f9ff;
      border: 2px solid #bae6fd;
    }

    .day-cell--available .day-number {
      color: #0369a1;
      font-weight: 600;
    }

    .day-cell--selected {
      background-color: #8b5cf6;
      color: white;
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }

    .day-cell--selected .day-number {
      color: white;
      font-weight: 700;
    }

    .day-cell--requested {
      background-color: #d1fae5;
      border: 2px solid #86efac;
    }

    .day-cell--requested .day-number {
      color: #059669;
      font-weight: 600;
    }

    @media (max-width: 480px) {
      .calendar-widget {
        padding: 16px;
      }

      .day-cell {
        min-height: 40px;
      }

      .day-number {
        font-size: 12px;
      }

      .day-label {
        font-size: 9px;
      }
    }
  `]
})
export class CalendarWidgetComponent {
  @Input({ required: true }) calendar!: CalendarMonth;
  @Output() daySelected = new EventEmitter<CalendarDay>();

  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  onDayClick(day: CalendarDay): void {
    if (day.isCurrentMonth && day.isAvailable) {
      this.daySelected.emit(day);
    }
  }

  getDayTitle(day: CalendarDay): string {
    const titles: string[] = [];
    
    if (day.isToday) titles.push('Hoy');
    if (day.isHoliday) titles.push('Día feriado');
    if (day.isWeekend) titles.push('Fin de semana');
    if (day.isAvailable) titles.push('Disponible para teletrabajo');
    if (day.isSelected) titles.push('Seleccionado');
    if (day.isRequested) titles.push('Solicitado');
    if (day.metadata?.holidayName) titles.push(day.metadata.holidayName);
    
    return titles.join(' • ') || 'Día no disponible';
  }

  trackByDay(index: number, day: CalendarDay): string {
    return `${day.year}-${day.month}-${day.day}`;
  }
}