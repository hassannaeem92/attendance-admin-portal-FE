import { inject, Injectable } from '@angular/core';
import { ColorModeService } from '@coreui/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  readonly #colorModeService = inject(ColorModeService); // Inject service
  readonly colorMode = this.#colorModeService.colorMode;

    private themeSubject = new BehaviorSubject<string>('');
    theme$ = this.themeSubject.asObservable();
  
    constructor() {
      this.themeSubject.next(this.#colorModeService.colorMode());
    }
  
    setTheme(theme: string): void {
      this.#colorModeService.colorMode.set(theme);
      this.themeSubject.next(theme);
      localStorage.setItem('theme', theme);
    }
  
    get currentTheme(): string {
      return this.#colorModeService.colorMode();
    }
  
}
