import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { appConfig } from './app/app.config';
import { HeaderComponent } from './app/shared/components/header/header.component';
import { SidebarComponent } from './app/shared/components/sidebar/sidebar.component';
import { NotificationComponent } from './app/shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, NotificationComponent],
  template: `
    <div class="app-container">
      <app-header></app-header>
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-notification></app-notification>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .main-content {
      margin-left: 250px;
      margin-top: 80px;
      min-height: calc(100vh - 80px);
      transition: margin-left 0.3s ease;
    }

    @media (max-width: 768px) {
      .main-content { 
        margin-left: 0; 
      }
    }
  `]
})
export class App { }

bootstrapApplication(App, appConfig)
  .catch(err => console.error(err));