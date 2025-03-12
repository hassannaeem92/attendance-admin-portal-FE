import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { provideToastr } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpconfigInterceptor } from './_sharedresources/httpconfig.interceptor';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Parsing format for input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // Display format in the input
    monthYearLabel: 'MMM YYYY', // Format for month/year label
    dateA11yLabel: 'LL', // Accessibility label for dates
    monthYearA11yLabel: 'MMMM YYYY', // Accessibility label for month/year
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      // withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(), provideAnimationsAsync(),

    provideHttpClient(withInterceptors([
      httpconfigInterceptor
    ])),

    provideToastr({closeButton: true}),
    provideCharts(withDefaultRegisterables()),

    // {
    //   provide: DateAdapter,
    
    //   useClass: MomentDateAdapter, // or NativeDateAdapter
    //   deps: [MAT_DATE_LOCALE],
    // },

    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
    
  ]
};
