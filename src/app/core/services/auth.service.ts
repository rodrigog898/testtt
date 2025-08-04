import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';

import { User, AuthResponse, LoginCredentials } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
  
  // Signals para mejor reactividad
  public readonly currentUser = signal<User | null>(null);
  public readonly isAuthenticated = signal<boolean>(false);
  public readonly isLoading = signal<boolean>(false);

  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token && !this.isTokenExpired(token)) {
      this.validateToken().subscribe({
        next: (user) => this.setCurrentUser(user),
        error: () => this.logout()
      });
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.isLoadingSubject.next(true);
    this.isLoading.set(true);

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.storeTokens(response.token, response.refreshToken);
          this.setCurrentUser(response.user);
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        }),
        tap(() => {
          this.isLoadingSubject.next(false);
          this.isLoading.set(false);
        })
      );
  }

  logout(): void {
    this.clearTokens();
    this.setCurrentUser(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.storeTokens(response.token, response.refreshToken);
          this.setCurrentUser(response.user);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  private validateToken(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/me`);
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
    this.currentUser.set(user);
    this.isAuthenticated.set(!!user);
  }

  private storeTokens(token: string, refreshToken: string): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  getToken(): string | null {
    return this.getStoredToken();
  }
}