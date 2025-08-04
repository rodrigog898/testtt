export interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  isAvailable: boolean;
  isSelected: boolean;
  isRequested: boolean;
  status: DayStatus;
  metadata?: CalendarDayMetadata;
}

export enum DayStatus {
  AVAILABLE = 'available',
  SELECTED = 'selected',
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  HOLIDAY = 'holiday',
  WEEKEND = 'weekend',
  UNAVAILABLE = 'unavailable'
}

export interface CalendarDayMetadata {
  holidayName?: string;
  requestId?: string;
  notes?: string;
}

export interface CalendarMonth {
  month: string;
  year: number;
  days: CalendarDay[];
}

export interface TeleworkRequest {
  id: string;
  userId: string;
  dates: Date[];
  reason: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface CalendarConfig {
  maxDaysPerMonth: number;
  maxDaysPerYear: number;
  advanceNoticeDays: number;
  blackoutDates: Date[];
  workingDays: number[]; // 0-6, Sunday-Saturday
}