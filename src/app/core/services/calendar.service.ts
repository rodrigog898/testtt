import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, catchError, throwError } from 'rxjs';

import { 
  CalendarDay, 
  CalendarMonth, 
  TeleworkRequest, 
  DayStatus, 
  CalendarConfig,
  RequestStatus 
} from '../models/calendar.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private readonly http = inject(HttpClient);
  
  private readonly selectedDatesSubject = new BehaviorSubject<Date[]>([]);
  private readonly currentMonthSubject = new BehaviorSubject<Date>(new Date());
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
  
  // Signals
  public readonly selectedDates = signal<Date[]>([]);
  public readonly currentMonth = signal<Date>(new Date());
  public readonly isLoading = signal<boolean>(false);
  
  // Observables
  public readonly selectedDates$ = this.selectedDatesSubject.asObservable();
  public readonly currentMonth$ = this.currentMonthSubject.asObservable();
  public readonly isLoading$ = this.isLoadingSubject.asObservable();

  private calendarConfig: CalendarConfig = {
    maxDaysPerMonth: 10,
    maxDaysPerYear: 120,
    advanceNoticeDays: 7,
    blackoutDates: [],
    workingDays: [1, 2, 3, 4, 5] // Monday to Friday
  };

  getCalendarConfig(): Observable<CalendarConfig> {
    return this.http.get<CalendarConfig>(`${environment.apiUrl}/calendar/config`)
      .pipe(
        tap(config => this.calendarConfig = config),
        catchError(() => {
          // Fallback to default config
          return [this.calendarConfig];
        })
      );
  }

  generateCalendarMonth(year: number, month: number): Observable<CalendarMonth> {
    return this.http.get<any[]>(`${environment.apiUrl}/calendar/month/${year}/${month}`)
      .pipe(
        map(data => this.processCalendarData(year, month, data)),
        catchError(error => {
          console.error('Error fetching calendar data:', error);
          return [this.generateDefaultCalendarMonth(year, month)];
        })
      );
  }

  private processCalendarData(year: number, month: number, serverData: any[]): CalendarMonth {
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const serverDayData = serverData.find(d => 
        new Date(d.date).toDateString() === date.toDateString()
      );

      const day: CalendarDay = {
        date: new Date(date),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isWeekend: this.isWeekend(date),
        isHoliday: serverDayData?.isHoliday || false,
        isAvailable: this.isAvailable(date, serverDayData),
        isSelected: this.isDateSelected(date),
        isRequested: serverDayData?.isRequested || false,
        status: this.getDayStatus(date, serverDayData),
        metadata: serverDayData?.metadata
      };
      
      days.push(day);
    }

    return {
      month: this.getMonthName(month),
      year,
      days
    };
  }

  private generateDefaultCalendarMonth(year: number, month: number): CalendarMonth {
    const days: CalendarDay[] = [];
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const day: CalendarDay = {
        date: new Date(date),
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isWeekend: this.isWeekend(date),
        isHoliday: false,
        isAvailable: this.isAvailable(date),
        isSelected: this.isDateSelected(date),
        isRequested: false,
        status: this.getDayStatus(date)
      };
      
      days.push(day);
    }

    return {
      month: this.getMonthName(month),
      year,
      days
    };
  }

  selectDate(date: Date): void {
    if (!this.canSelectDate(date)) return;

    const currentSelected = this.selectedDatesSubject.value;
    const dateString = date.toDateString();
    const isAlreadySelected = currentSelected.some(d => d.toDateString() === dateString);

    let newSelected: Date[];
    if (isAlreadySelected) {
      newSelected = currentSelected.filter(d => d.toDateString() !== dateString);
    } else {
      newSelected = [...currentSelected, new Date(date)];
    }

    this.selectedDatesSubject.next(newSelected);
    this.selectedDates.set(newSelected);
  }

  clearSelection(): void {
    this.selectedDatesSubject.next([]);
    this.selectedDates.set([]);
  }

  submitTeleworkRequest(reason: string): Observable<TeleworkRequest> {
    const selectedDates = this.selectedDatesSubject.value;
    if (selectedDates.length === 0) {
      return throwError(() => new Error('No dates selected'));
    }

    this.isLoadingSubject.next(true);
    this.isLoading.set(true);

    const request = {
      dates: selectedDates,
      reason
    };

    return this.http.post<TeleworkRequest>(`${environment.apiUrl}/telework/requests`, request)
      .pipe(
        tap(() => this.clearSelection()),
        tap(() => {
          this.isLoadingSubject.next(false);
          this.isLoading.set(false);
        }),
        catchError(error => {
          this.isLoadingSubject.next(false);
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
  }

  getTeleworkRequests(): Observable<TeleworkRequest[]> {
    return this.http.get<TeleworkRequest[]>(`${environment.apiUrl}/telework/requests`);
  }

  private canSelectDate(date: Date): boolean {
    if (this.isWeekend(date)) return false;
    if (date < new Date()) return false;
    if (this.isBlackoutDate(date)) return false;
    
    const advanceNotice = new Date();
    advanceNotice.setDate(advanceNotice.getDate() + this.calendarConfig.advanceNoticeDays);
    if (date < advanceNotice) return false;

    return true;
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private isWeekend(date: Date): boolean {
    const day = date.getDay();
    return !this.calendarConfig.workingDays.includes(day);
  }

  private isAvailable(date: Date, serverData?: any): boolean {
    if (this.isWeekend(date)) return false;
    if (serverData?.isHoliday) return false;
    if (serverData?.isRequested) return false;
    return this.canSelectDate(date);
  }

  private isDateSelected(date: Date): boolean {
    return this.selectedDatesSubject.value.some(d => 
      d.toDateString() === date.toDateString()
    );
  }

  private isBlackoutDate(date: Date): boolean {
    return this.calendarConfig.blackoutDates.some(blackout => 
      blackout.toDateString() === date.toDateString()
    );
  }

  private getDayStatus(date: Date, serverData?: any): DayStatus {
    if (serverData?.status) return serverData.status;
    if (this.isWeekend(date)) return DayStatus.WEEKEND;
    if (serverData?.isHoliday) return DayStatus.HOLIDAY;
    if (this.isDateSelected(date)) return DayStatus.SELECTED;
    if (this.isAvailable(date, serverData)) return DayStatus.AVAILABLE;
    return DayStatus.UNAVAILABLE;
  }

  private getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  }

  setCurrentMonth(date: Date): void {
    this.currentMonthSubject.next(date);
    this.currentMonth.set(date);
  }

  navigateMonth(direction: 'prev' | 'next'): void {
    const current = this.currentMonthSubject.value;
    const newDate = new Date(current);
    
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    this.setCurrentMonth(newDate);
  }
}