import { INavData } from '@coreui/angular';


export const navBarItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-Home' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  // {
  //   name: 'TimeZone',
  //   url: '/main/attendance/timezone/all-timezone',
  //   iconComponent: { name: 'cil-Home' },

  // },

  
  // {
  //   name: 'Quick Start',
  //   url: '/main/attendance/quick-register',
  //   icon:  'icon-quick-start',
  // },

  {
    name: 'Quick Start',
    url: '/main/attendance/quick-register',
    iconComponent: { name: 'cilSpeedometer' },
  },

  {
    name: 'Company',
    url: '/main/attendance/organization/all-organization',
    iconComponent: { name: 'cilBuilding' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: 'Company Location',
    url: '/main/attendance/company-location',
    iconComponent: { name: 'cil-location-pin' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  


  {
    name: 'Client Company',
    url: '/main/attendance/company',
    iconComponent: { name: 'cilHandshake' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },


 

  {
    name: 'Client Company Location',
    url: '/main/attendance/client-company-location',
    iconComponent: { name: 'cil-location-pin' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  // {
  //   name: 'Location',
  //   url: '/main/attendance/location/all-location',
  //   iconComponent: { name: 'cil-location-pin' },
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW'
  //   // }
  // },


  {
    name: 'Department',
    url: '/main/attendance/department',
    iconComponent: { name: 'cil-grid' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  {
    name: 'Designation',
    url: '/main/attendance/designation',
    iconComponent: { name: 'cil-user' },
  
  },
  {
    name: 'User',
    url: '/main/user',
    iconComponent: { name: 'cil-people' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },



  {
    name: 'createDeviceNarow',
    url: '/main/attendance/device',
    iconComponent: { name: 'cilDevices' },
  
  },

  {
    name: 'deviceSettingNarow',
    url: 'main/attendance/device-setting',
    iconComponent: { name: 'cilSettings' },
  
  },



  {
    name: 'Device',
    url: '/base',
    iconComponent: { name: 'cilDevices' },
    children: [

    
      {
        name: 'Create Device',
        url: '/main/attendance/device',
        icon: 'nav-icon-bullet'
    
      },

      {
        name: 'Device Setting',
        url: 'main/attendance/device-setting',
        icon: 'nav-icon-bullet'
    
      },
    
   
     
    ]
  },


  {
    name: 'Shift',
    url: '/main/attendance/shift',
    iconComponent: { name: 'cilClock' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  {
    name: 'Shift Assign',
    url: '/main/attendance/shift-assign',
    iconComponent: { name: 'cil-chart-pie' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  {
    name: 'Holiday',
    url: '/main/attendance/holiday',
    iconComponent: { name: 'cil-map' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },



  {
    name: 'Off Day',
    url: '/main/attendance/off-day',
    iconComponent: { name: 'cil-sun' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  
 

 
  

 

 

  

  // {
  //   title: true,
  //   name: 'Theme'
  // },
  // {
  //   name: 'Colors',
  //   url: '/theme/colors',
  //   iconComponent: { name: 'cil-drop' }
  // },
  // {
  //   name: 'Typography',
  //   url: '/theme/typography',
  //   linkProps: { fragment: 'headings' },
  //   iconComponent: { name: 'cil-pencil' }
  // },
  // {
  //   name: 'Components',
  //   title: true
  // },


  {
    name: 'attendanceViewNarow',
    url: '/main/attendance-view',
    iconComponent: { name: 'cilLayers' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  {
    name: 'rawAttendanceNarow',
    url: '/main/attendance/raw-attendance',
    iconComponent: { name: 'cilList' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },

  {
    name: 'calendarNarow',
    url: '/main/attendance/attendance-calendar',
    iconComponent: { name: 'cilCalendar' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },



  {
    name: 'Reports',
    url: '/base',
    iconComponent: { name: 'cilSpreadsheet' },
    children: [
  
      {
        name: 'Attendance View',
        url: '/main/attendance-view',
        icon: 'nav-icon-bullet'
        // badge: {
        //   color: 'info',
        //   text: 'NEW'
        // }
      },
    
      {
        name: 'Raw Attendance',
        url: '/main/attendance/raw-attendance',
        icon: 'nav-icon-bullet'
        // badge: {
        //   color: 'info',
        //   text: 'NEW'
        // }
      },
    
      {
        name: 'Calendar',
        url: '/main/attendance/attendance-calendar',
        icon: 'nav-icon-bullet'
        // badge: {
        //   color: 'info',
        //   text: 'NEW'
        // }
      },
      // {
      //   name: 'Carousel',
      //   url: '/base/carousel',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Collapse',
      //   url: '/base/collapse',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'List Group',
      //   url: '/base/list-group',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Navs & Tabs',
      //   url: '/base/navs',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Pagination',
      //   url: '/base/pagination',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Placeholder',
      //   url: '/base/placeholder',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Popovers',
      //   url: '/base/popovers',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Progress',
      //   url: '/base/progress',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Spinners',
      //   url: '/base/spinners',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Tables',
      //   url: '/base/tables',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Tabs',
      //   url: '/base/tabs',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Tooltips',
      //   url: '/base/tooltips',
      //   icon: 'nav-icon-bullet'
      // }
    ]
  },




  // {
  //   name: 'Buttons',
  //   url: '/buttons',
  //   iconComponent: { name: 'cil-cursor' },
  //   children: [
  //     {
  //       name: 'Buttons',
  //       url: '/buttons/buttons',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Button groups',
  //       url: '/buttons/button-groups',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Dropdowns',
  //       url: '/buttons/dropdowns',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  // {
  //   name: 'Forms',
  //   url: '/forms',
  //   iconComponent: { name: 'cil-notes' },
  //   children: [
  //     {
  //       name: 'Form Control',
  //       url: '/forms/form-control',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Select',
  //       url: '/forms/select',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Checks & Radios',
  //       url: '/forms/checks-radios',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Range',
  //       url: '/forms/range',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Input Group',
  //       url: '/forms/input-group',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Floating Labels',
  //       url: '/forms/floating-labels',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Layout',
  //       url: '/forms/layout',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Validation',
  //       url: '/forms/validation',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  // {
  //   name: 'Charts',
  //   iconComponent: { name: 'cil-chart-pie' },
  //   url: '/charts'
  // },
  // {
  //   name: 'Icons',
  //   iconComponent: { name: 'cil-star' },
  //   url: '/icons',
  //   children: [
  //     {
  //       name: 'CoreUI Free',
  //       url: '/icons/coreui-icons',
  //       icon: 'nav-icon-bullet',
  //       badge: {
  //         color: 'success',
  //         text: 'FREE'
  //       }
  //     },
  //     {
  //       name: 'CoreUI Flags',
  //       url: '/icons/flags',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'CoreUI Brands',
  //       url: '/icons/brands',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   iconComponent: { name: 'cil-bell' },
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Modal',
  //       url: '/notifications/modal',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Toast',
  //       url: '/notifications/toasts',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   iconComponent: { name: 'cil-calculator' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },
  // {
  //   title: true,
  //   name: 'Links',
  //   class: 'mt-auto'
  // },
  // {
  //   name: 'Docs',
  //   url: 'https://coreui.io/angular/docs/5.x/',
  //   iconComponent: { name: 'cil-description' },
  //   attributes: { target: '_blank' }
  // }
];
