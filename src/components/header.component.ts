import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo-container">
          <img
            src="https://www.reale.cl/v2/wp-content/themes/reale_010720/img/logoRealeBlanco.png"
            alt="Reale Seguros"
            class="logo"
          />
        </div>
        <div class="user-menu">
          <div class="avatar"></div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--reale-blue);
      border-bottom: 1px solid var(--border-color);
      height: 80px;                      /* header más alto */
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 20px;
    }

    .logo-container { display: flex; align-items: center; }
    .logo           { height: 40px; width: auto; }

    .user-menu { display: flex; align-items: center; }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.3);
      border: 2px solid rgba(255,255,255,0.5);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .avatar:hover {
      background-color: rgba(255,255,255,0.4);
      border-color: rgba(255,255,255,0.7);
    }
  `]
})
export class HeaderComponent { }
