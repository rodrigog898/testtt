import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-content">

        <!-- MAIN Section -->
        <div class="menu-section">
          <h3 class="section-title">MAIN</h3>
          <ul class="menu-list">
            <li class="menu-item active">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span class="menu-text">Dashboard</span>
            </li>
            <li class="menu-item">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span class="menu-text">Calendario</span>
            </li>
          </ul>
        </div>

        <!-- PRODUCTS Section -->
        <div class="menu-section">
          <h3 class="section-title">PRODUCTS</h3>
          <ul class="menu-list">
            <li class="menu-item">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              <span class="menu-text">Add Product</span>
            </li>
            <li class="menu-item">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <span class="menu-text">View Products</span>
            </li>
          </ul>
        </div>

        <!-- MISC Section -->
        <div class="menu-section">
          <h3 class="section-title">MISC</h3>
          <ul class="menu-list">
            <li class="menu-item">
              <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m15.5-6.5L19 4.5M5 19.5l1.5-1.5M19 19.5l-1.5-1.5M5 4.5L6.5 6"/>
              </svg>
              <span class="menu-text">Settings</span>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      top: 80px;
      left: 0;
      width: 250px;                             /* ancho más generoso */
      height: calc(100vh - 80px);
      background-color: var(--sidebar-bg);      /* asegúrate que sea #fff en global_styles */
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);  /* sombra suave */
      overflow-y: auto;
    }

    .sidebar-content {
      padding: 1rem;
    }

    .menu-section + .menu-section {
      margin-top: 2rem;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 0.5rem;
      padding-left: 0.5rem;
    }

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      color: var(--text-secondary);
      transition: background 0.2s, color 0.2s;
      margin-bottom: 0.5rem;
      cursor: pointer;
    }
    .menu-item:hover {
      background-color: #F2F4F6;
      color: var(--text-primary);
    }

    .menu-item.active {
      background-color: #F6F7F9;
      color: var(--text-primary);
      font-weight: 600;
      border-left: 4px solid var(--reale-blue);
    }

    .menu-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: inherit; /* hereda el color de .menu-item */
    }

    .menu-text {
      flex: 1;
    }
  `]
})
export class SidebarComponent { }
