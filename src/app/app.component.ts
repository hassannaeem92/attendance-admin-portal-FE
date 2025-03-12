import { Component, DestroyRef, inject, OnInit, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { delay, filter, map, tap } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { ThemeService } from './_sharedresources/_services/theme.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  standalone: true,
  imports: [RouterOutlet]
})
export class AppComponent implements OnInit {
  title = 'SimpleLogix';
  readonly themeService = inject(ThemeService);
  readonly renderer = inject(Renderer2);

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);
  themeStatus: string;
  themeFromlocal: string;

  constructor() {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
    this.themeFromlocal = localStorage.getItem('theme');
  }

  // ngOnInit(): void {

  //   this.#router.events.pipe(
  //       takeUntilDestroyed(this.#destroyRef)
  //     ).subscribe((evt) => {
  //     if (!(evt instanceof NavigationEnd)) {
  //       return;
  //     }
  //   });

  //   this.#activatedRoute.queryParams
  //     .pipe(
  //       delay(1),
  //       map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
  //       filter(theme => ['dark', 'light', 'auto'].includes(theme)),
  //       tap(theme => {
  //         this.#colorModeService.colorMode.set(theme);
  //       }),
  //       takeUntilDestroyed(this.#destroyRef)
  //     )
  //     .subscribe();


  //     this.themeService.theme$.subscribe(theme => {
       
  //       this.themeStatus = theme;

  //     // Add or remove classes dynamically based on theme
  //       if (this.themeStatus === 'dark') {
  //         this.renderer.addClass(document.body, 'darkTheme');
  //         this.renderer.removeClass(document.body, 'lightTheme');
  //       } else if (this.themeStatus === 'light') {
  //         this.renderer.addClass(document.body, 'lightTheme');
  //         this.renderer.removeClass(document.body, 'darkTheme');
  //       }
  //     });
      

  // }

  ngOnInit(): void {
    // Ensure theme is set immediately
    this.themeService.theme$.subscribe(theme => {
      this.themeStatus = theme;
      if (this.themeStatus === 'dark') {
        this.renderer.addClass(document.body, 'darkTheme');
        this.renderer.removeClass(document.body, 'lightTheme');
      } else if (this.themeStatus === 'light') {
        this.renderer.addClass(document.body, 'lightTheme');
        this.renderer.removeClass(document.body, 'darkTheme');
      }else if(this.themeFromlocal === 'dark'){
        this.themeService.setTheme('dark')
        setTimeout(() => {
          this.renderer.addClass(document.body, 'darkTheme');
          this.renderer.removeClass(document.body, 'lightTheme');
        })

      }else if(this.themeFromlocal === 'light'){
        this.themeService.setTheme('light')
        setTimeout(() => {
          this.renderer.addClass(document.body, 'lightTheme');
          this.renderer.removeClass(document.body, 'darkTheme');

        })
      }
    });

    // Apply theme from query parameters or fallback
    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();

    // Ensure theme is applied immediately on reload
    if (!this.themeStatus) {
      const initialTheme = this.themeService.currentTheme; // Get theme from service if not already set
      this.themeService.setTheme(initialTheme);
    }

    // Handling router events
    this.#router.events.pipe(
      takeUntilDestroyed(this.#destroyRef)
    ).subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }

}
