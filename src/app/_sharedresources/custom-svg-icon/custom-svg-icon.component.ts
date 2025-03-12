// // src/app/icons/custom-svg-icon/custom-svg-icon.component.ts
// import { Component, Input } from '@angular/core';

// @Component({
//   selector: 'app-custom-svg-icon',
//   template: `
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       [attr.viewBox]="viewBox"
//       class="c-sidebar-nav-icon"
//       [attr.width]="size"
//       [attr.height]="size"
//     >
//       <path [attr.d]="path" fill="currentColor" />
//     </svg>
//   `,
//   styles: [
//     `
//       .c-sidebar-nav-icon {
//         display: inline-block;
//         width: 1.5rem;
//         height: 1.5rem;
//         vertical-align: middle;
//       }
//     `,
//   ],
// })
// export class CustomSvgIconComponent {
//   @Input() name: string = 'logo-simplelogix';
//   @Input() size: string = '1.5rem';

//   // Map of icon names to their SVG properties
//   private iconMap: { [key: string]: { viewBox: string; path: string } } = {
//     'logo-simplelogix': {
//       viewBox: '0 0 24 24', // Update from your SVG
//       path: 'M12 2L2 7v10l10 5 10-5V7l-10-5z', // Update from your SVG
//     },
//     'custom-clock': {
//       viewBox: '0 0 24 24',
//       path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 2v8h-2V4h2zm-1 15a2 2 0 110-4 2 2 0 010 4z', // Example clock icon
//     },
//     // Add more SVGs as needed
//   };

//   get viewBox(): string {
//     return this.iconMap[this.name]?.viewBox || '0 0 24 24';
//   }

//   get path(): string {
//     return this.iconMap[this.name]?.path || '';
//   }
// }


// src/app/icons/custom-svg-icon/custom-svg-icon.component.ts
// import { CommonModule, NgIf } from '@angular/common';
// import { Component, Input, SimpleChanges, Sanitizer, SecurityContext  } from '@angular/core';

// @Component({
//   selector: 'app-custom-svg-icon',
//   standalone: true,
//   imports: [CommonModule],
//   template: `<div [innerHTML]="svg"></div>`,
// })
// export class CustomSvgIconComponent {
//   @Input() name!: string;
//   svg: any;

//   constructor(private sanitizer: Sanitizer) { }

//   ngOnInit(): void {
//     debugger
//     fetch(this.name)
//       .then(response => response.text())
//       .then(svgString => {
//         // Cast the Sanitizer to DomSanitizer to access bypassSecurityTrustHtml
//         const domSanitizer = this.sanitizer as any; // Or use a type assertion: <DomSanitizer>this.sanitizer
//         this.svg = domSanitizer.bypassSecurityTrustHtml(svgString);
//       });
//   }



// }


import { ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Import DomSanitizer directly

@Component({
  selector: 'app-custom-svg-icon',
  templateUrl:  './custom-svg-icon.component.html',
  standalone: true,
  imports: [CommonModule],
  
})
export class CustomSvgIconComponent implements OnInit {
  @Input() name!: string;
  svg: any;

  constructor(private cdRef: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (!this.name) {
      console.error("SVG URL is missing!");
      return;
    }

    console.log("Fetching SVG:", this.name);

    fetch(this.name)
      .then((response) => response.text())
      .then((svgString) => {
        console.log("Fetched SVG:", svgString);

        // Remove XML declaration & comments
        svgString = svgString.replace(/<\?xml.*?\?>\s*/, "").replace(/<!--[\s\S]*?-->/g, "");

        console.log("Cleaned SVG:", svgString);

        this.svg = this.sanitizer.bypassSecurityTrustHtml(svgString);
        this.cdRef.detectChanges(); 
      })
      .catch((error) => {
        console.error("Error fetching SVG:", error);
      });
  }
}