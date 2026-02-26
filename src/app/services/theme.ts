import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  darkMode = new BehaviorSubject<boolean>(false);

  constructor() {
    // Al iniciar lee el tema guardado
    const saved = localStorage.getItem('darkMode') === 'true';
    this.setTheme(saved);
  }

  setTheme(darkMode: boolean) {
    if (darkMode) {
      document.body.setAttribute('color-theme', 'dark');
    } else {
      document.body.setAttribute('color-theme', 'light');
    }
    this.darkMode.next(darkMode);
    // Guarda el tema elegido
    localStorage.setItem('darkMode', String(darkMode));
  }
}