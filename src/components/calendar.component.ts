import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  isWeekend?: boolean;
  isHoliday?: boolean;
  isAvailable?: boolean;
  isSelected?: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <h1 class="main-title">Mi calendario de teletrabajo</h1>
      
      <!-- Leyenda -->
      <div class="legend">
        <h2 class="legend-title">Leyenda</h2>
        <div class="legend-items">
          <div class="legend-item">
            <span class="legend-dot available"></span>
            <span class="legend-text">Días disponibles</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot current"></span>
            <span class="legend-text">Día actual</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot selected"></span>
            <span class="legend-text">Días seleccionados</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot holiday"></span>
            <span class="legend-text">Días feriados</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot weekend"></span>
            <span class="legend-text">Fines de semana</span>
          </div>
        </div>
      </div>

      <!-- Calendarios -->
      <div class="calendars-grid">
        <div *ngFor="let calendar of calendars" class="calendar-widget">
          <div class="calendar-header">
            <button class="nav-button" (click)="previousMonth()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            <h3 class="month-title">{{ calendar.month }} {{ calendar.year }}</h3>
            <button class="nav-button" (click)="nextMonth()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </div>
          
          <div class="calendar-grid">
            <div class="weekdays">
              <div *ngFor="let day of weekDays" class="weekday">{{ day }}</div>
            </div>
            
            <div class="days-grid">
              <div 
                *ngFor="let day of calendar.days" 
                class="day-cell"
                [ngClass]="{
                  'other-month': !day.isCurrentMonth,
                  'today': day.isToday,
                  'weekend': day.isWeekend,
                  'holiday': day.isHoliday,
                  'available': day.isAvailable,
                  'selected': day.isSelected
                }"
                (click)="selectDay(day)"
              >
                {{ day.day }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      padding: 32px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .main-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 32px;
      line-height: 1.2;
    }

    .legend {
      background: white;
      border-radius: 6px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid var(--border-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .legend-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 20px;
      line-height: 1.2;
    }

    .legend-items {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .legend-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-dot.available {
      background-color: #8b5cf6;
    }

    .legend-dot.current {
      background-color: #3b82f6;
    }

    .legend-dot.selected {
      background-color: #06b6d4;
    }

    .legend-dot.holiday {
      background-color: #ef4444;
    }

    .legend-dot.weekend {
      background-color: #9ca3af;
    }

    .calendars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 32px;
    }

    .calendar-widget {
      background: white;
      border-radius: 6px;
      padding: 24px;
      border: 1px solid var(--border-color);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .nav-button {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .nav-button svg {
      width: 16px;
      height: 16px;
    }

    .nav-button:hover {
      background-color: var(--sidebar-hover);
      color: var(--text-primary);
    }

    .month-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
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
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      padding: 10px 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .day-cell {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s ease;
      color: var(--text-primary);
      font-weight: 400;
      position: relative;
    }

    .day-cell:hover {
      background-color: var(--sidebar-hover);
    }

    .day-cell.other-month {
      color: var(--text-muted);
    }

    .day-cell.today {
      background-color: #3b82f6;
      color: white;
      font-weight: 600;
    }

    .day-cell.weekend {
      background-color: #f8fafc;
      color: #9ca3af;
    }

    .day-cell.holiday {
      background-color: #fef2f2;
      color: #ef4444;
      font-weight: 600;
    }

    .day-cell.available {
      background-color: #f3f4f6;
      color: #8b5cf6;
      font-weight: 600;
    }

    .day-cell.selected {
      background-color: #dbeafe;
      color: #06b6d4;
      font-weight: 600;
    }
  `]
})
export class CalendarComponent {
  weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  currentDate = new Date();
  
  calendars = [
    { month: 'August', year: 2025, days: this.generateCalendarDays(2025, 7) },
    { month: 'August', year: 2025, days: this.generateCalendarDays(2025, 7) },
    { month: 'August', year: 2025, days: this.generateCalendarDays(2025, 7) }
  ];

  generateCalendarDays(year: number, month: number): CalendarDay[] {
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const day: CalendarDay = {
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isHoliday: this.isHoliday(date),
        isAvailable: this.isAvailable(date),
        isSelected: this.isSelected(date)
      };
      
      days.push(day);
    }

    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isHoliday(date: Date): boolean {
    // Algunos días feriados de ejemplo
    const holidays = [15, 18]; // días del mes
    return holidays.includes(date.getDate()) && date.getMonth() === 7; // agosto
  }

  isAvailable(date: Date): boolean {
    // Días disponibles de ejemplo
    const availableDays = [5, 12, 19, 26];
    return availableDays.includes(date.getDate()) && date.getMonth() === 7;
  }

  isSelected(date: Date): boolean {
    // Días seleccionados de ejemplo
    const selectedDays = [8, 22];
    return selectedDays.includes(date.getDate()) && date.getMonth() === 7;
  }

  selectDay(day: CalendarDay): void {
    if (day.isCurrentMonth) {
      console.log('Día seleccionado:', day.day);
    }
  }

  previousMonth(): void {
    console.log('Mes anterior');
  }

  nextMonth(): void {
    console.log('Mes siguiente');
  }
}