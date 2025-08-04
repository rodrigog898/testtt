import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HeaderComponent } from './components/header.component';
import { SidebarComponent } from './components/sidebar.component';
import { CalendarComponent } from './components/calendar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, CalendarComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <app-calendar></app-calendar>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .main-content {
      margin-left: 240px;
      margin-top: 80px;               /* coincide con el header */
      min-height: calc(100vh - 80px);
    }

    @media (max-width: 768px) {
      .main-content { margin-left: 0; }
    }
  `]
})
export class App { }

bootstrapApplication(App);
