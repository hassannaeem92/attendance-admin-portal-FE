import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { IconSetService } from '@coreui/icons-angular';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private iconSetService: IconSetService
  ) {
    this.registerIcons();
  }

  registerIcons() {
    // ✅ Register Custom SVG for Angular Material Icons
    this.iconRegistry.addSvgIcon(
      'company',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/company.svg')
    );

    // ✅ Fix Type Error by Using an Array of Strings
    this.iconSetService.icons = {
      company: [
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor" d="M3 21v-9h18v9H3Zm2-2h14v-5H5v5Zm2-2h2v-1H7v1Zm4 0h2v-1h-2v1Zm4 0h2v-1h-2v1ZM3 10V8l9-6 9 6v2H3Zm2-2h14L12 3L5 8Z"/>
        </svg>`
      ]
    };
  }
}
