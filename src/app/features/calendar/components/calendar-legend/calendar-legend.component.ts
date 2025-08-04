import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LegendItem {
  key: string;
  label: string;
  className: string;
}

@Component({
  selector: 'app-calendar-legend',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="legend-container">
      <h2 class="legend-title">Leyenda</h2>
      <div class="legend-grid">
        <div 
          *ngFor="let item of legendItems" 
          class="legend-item"
        >
          <span class="legend-dot" [ngClass]="item.className"></span>
          <span class="legend-text">{{ item.label }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .legend-container {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid var(--border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .legend-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 20px;
      margin-top: 0;
    }

    .legend-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .legend-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 2px solid transparent;
    }

    .legend-dot--available {
      background-color: #f0f9ff;
      border-color: #bae6fd;
    }

    .legend-dot--current {
      background-color: var(--reale-blue);
    }

    .legend-dot--selected {
      background-color: #8b5cf6;
    }

    .legend-dot--holiday {
      background-color: #fef2f2;
      border-color: #fecaca;
    }

    .legend-dot--weekend {
      background-color: #f8fafc;
    }

    .legend-dot--requested {
      background-color: #d1fae5;
      border-color: #86efac;
    }

    @media (max-width: 768px) {
      .legend-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
      }

      .legend-item {
        font-size: 13px;
      }

      .legend-dot {
        width: 14px;
        height: 14px;
      }
    }
  `]
})
export class CalendarLegendComponent {
  legendItems: LegendItem[] = [
    {
      key: 'available',
      label: 'Días disponibles',
      className: 'legend-dot--available'
    },
    {
      key: 'current',
      label: 'Día actual',
      className: 'legend-dot--current'
    },
    {
      key: 'selected',
      label: 'Días seleccionados',
      className: 'legend-dot--selected'
    },
    {
      key: 'holiday',
      label: 'Días feriados',
      className: 'legend-dot--holiday'
    },
    {
      key: 'weekend',
      label: 'Fines de semana',
      className: 'legend-dot--weekend'
    },
    {
      key: 'requested',
      label: 'Días solicitados',
      className: 'legend-dot--requested'
    }
  ];
}