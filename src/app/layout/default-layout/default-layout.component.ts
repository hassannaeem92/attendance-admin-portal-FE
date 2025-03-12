import { ChangeDetectorRef, Component, inject, NgModule, OnInit, NgZone, HostListener, ElementRef, Renderer2  } from '@angular/core';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconComponent, IconDirective, IconModule } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  SidebarModule,
  NavModule
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navBarItems } from './_nav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgModel } from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ThemeService } from '../../_sharedresources/_services/theme.service';
import { Utils } from '../../utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    RouterLink,
    IconDirective,
    NgScrollbar,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    ContainerComponent,
    RouterOutlet,
    DefaultFooterComponent,
    NgClass,
    IconComponent,
    NgxSpinnerModule,
    SidebarModule,
    NavModule,
    IconModule,
    NgIf,
    NgFor
  ]
})
export class DefaultLayoutComponent implements OnInit{
  readonly utils = inject(Utils);
  readonly themeService = inject(ThemeService);
  themeStatus: any;
  currentRole: any;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    // { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];
  navItems: any = [];
  // public navItems = navItems;

  constructor(public spinner: NgxSpinnerService, private eRef: ElementRef, private renderer: Renderer2) {

  }


  ngOnInit(): void {
    this.themeService.theme$.subscribe(theme => {
      this.themeStatus = theme;
    });

    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentRole = userData.Role
    this.filterSideBar();
  
  }


  ngAfterViewInit(): void {
    // Select all items with "data-prevent-close"
    const dropdownItems = document.querySelectorAll('[data-prevent-close]');

    dropdownItems.forEach(item => {
      this.renderer.listen(item, 'click', (event) => {
        event.stopPropagation(); // Stop dropdown from closing
      });
    });
  }


  @HostListener('document:click', ['$event'])
clickOutside(event: Event) {
  // Check if the clicked element has the 'sidebar-backdrop' class
  if (this.isSidebarVisibleMobile && (event.target as HTMLElement).classList.contains('sidebar-backdrop')) {
    this.isSidebarVisibleMobile = false; // Close sidebar only when clicking on the backdrop
  }
}



  // filterSideBar() {
  //   // Create a new array to avoid mutating the original navBarItems
  //   if (navBarItems && navBarItems.length > 0) {
  //     this.navItems = navBarItems.filter(item => !((item.name === 'Company' || item.name === 'Quick Start') && this.currentRole === 'Admin'));
  //   } else {
  //     this.navItems = [];
  //   }
  // }




  filterSideBar() {
    if (navBarItems && navBarItems.length > 0) {
      this.navItems = navBarItems.filter(item => {
        // Exclude 'Company' and 'Quick Start' for Admins
        if ((item.name === 'Company' || item.name === 'Quick Start') && this.currentRole === 'Admin') {
          return false;
        }
  
        if (this.sidebarUnfoldable) {
          // When sidebar is closed (narrow):
          return (
            !['Device', 'Reports'].includes(item.name) || // Hide 'Device' & 'Reports'
            ['createDeviceNarow', 'deviceSettingNarow', 'calendarNarow', 'rawAttendanceNarow', 'attendanceViewNarow'].includes(item.name) // Show narrow items
          );
        } else {
          // When sidebar is open (full view):
          return (
            !['createDeviceNarow', 'deviceSettingNarow', 'calendarNarow', 'rawAttendanceNarow', 'attendanceViewNarow'].includes(item.name) || // Remove narrow items
            ['Device', 'Reports'].includes(item.name) // Restore 'Device' & 'Reports'
          );
        }
      });
    } else {
      this.navItems = [];
    }
  }
  
  

  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }


  isSettingsOpen = false;
  fontSize = 16;

  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  changeTheme(theme: string) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(`${theme}-theme`);
  }

  colorModeChange(theme: string) {
    // Trigger the theme change
    this.themeService.setTheme(theme);
  }

  sidebarCollapsed = false;
  sidebarUnfoldable = false;
  toggleSidebarCollapse() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  isSidebarVisibleMobile: any = true;

  toggleSidebarUnfoldable() {
    
    // this.sidebarUnfoldable = !this.sidebarUnfoldable;
    // this.isSidebarVisibleMobile = !this.isSidebarVisibleMobile; 


    if (window.innerWidth > 992) { // Adjust the breakpoint for full-screen mode
      this.sidebarUnfoldable = !this.sidebarUnfoldable; // Toggle narrow mode only in full-screen
      this.filterSideBar()
      if(this.sidebarUnfoldable){
      }
    } else {
      this.isSidebarVisibleMobile = !this.isSidebarVisibleMobile; // Toggle visibility in mobile mode
    }

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }


}
