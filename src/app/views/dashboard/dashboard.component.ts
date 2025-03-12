import { DOCUMENT, NgClass, NgFor, NgForOf, NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef, Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Chart, ChartOptions, registerables } from 'chart.js';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  FormModule,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

// import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
// import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { NgApexchartsModule } from 'ng-apexcharts'; // Import NgApexchartsModule
import { ChartComponent } from 'ng-apexcharts'; // Import ChartComponent for type definition
import { ApexFill, ApexNonAxisChartSeries, ApexStroke, ApexPlotOptions, ApexDataLabels, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexLegend, ApexGrid, ApexTooltip } from 'ng-apexcharts'; // Import ApexCharts types
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { UserServiceService } from '../_services/user-service.service';
import { Utils } from '../../utils';
import { Page } from '../../_sharedresources/page';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { DevicesService } from '../_services/devices/devices.service';


export type ChartOptions = {
  // series: ApexAxisChartSeries;
  // chart: ApexChart;
  // xaxis: ApexXAxis;
  // yaxis: ApexYAxis;
  // legend: ApexLegend;
  // colors: string[];
  // grid: ApexGrid;
  // tooltip: ApexTooltip;
  // dataLabels: ApexDataLabels;
  // plotOptions: ApexPlotOptions;
  // fill: ApexFill;
  // stroke: ApexStroke;
  // labels?: string[];


  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
  colors: string[];
  yaxis: ApexYAxis;


};


// export type ChartOptionsRadial = {
//   // series: ApexNonAxisChartSeries;
//   // chart: ApexChart;
//   // xaxis: ApexXAxis;
//   // yaxis: ApexYAxis;
//   // legend: ApexLegend;
//   // colors: string[];
//   // grid: ApexGrid;
//   // tooltip: ApexTooltip;
//   // dataLabels: ApexDataLabels;
//   // plotOptions: ApexPlotOptions;
//   // fill: ApexFill;
//   // stroke: ApexStroke;
//   // labels?: string[];

//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   labels: string[];
//   fill: ApexFill;
//   legend: ApexLegend;
//   dataLabels: ApexDataLabels;
//   colors?: string[];
//   plotOptions?: {
//     pie: {
//       donut: {
//         labels: {
//           show: boolean;
//           total: {
//             show: boolean;
//             showAlways: boolean;
//             label: string;
//             fontSize: string;
//             color: string;
//           }
//         }
//       }
//     }
//   };

// };

export type ChartOptionsRadial = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  labels?: string[];
  colors?: string[];
  fill?: ApexFill;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
  tooltip?: ApexTooltip;
  responsive?: ApexResponsive[];
  plotOptions?: {
    pie?: {
      expandOnClick?: boolean; // Expands the slice when clicked
      dataLabels?: {
        offset?: number;
        minAngleToShowLabel?: number;
      };
      donut?: {
        size?: string;
        labels?: {
          show?: boolean;
          total?: {
            show?: boolean;
            label?: string;
            fontSize?: string;
            color?: string;
          };
        };
      };
    };
  };
};


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [NgClass, RouterLink, FormModule, NgForOf, NgFor, NgApexchartsModule, MatIconModule, ScrollingModule]
})

export class DashboardComponent implements OnInit {

  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;
  readonly userService = inject(UserServiceService);
  readonly utils = inject(Utils);
  readonly deviceService = inject(DevicesService);

  totalDevices: any = 0;
  totalClientCompanyLocations: any = 0;
  totalClientCompanies: any = 0;
  totalEmployees: any = 0;

  employeesData: any = [];
  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  rows: any = [];
  page = new Page();
  searchKeyword: any = '';
  orgIdFromLocalHost: any;
  currentUserRole: any;
  currentUserId: any;


  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public recruitmentChartOptions: Partial<ChartOptions>;
  public loanChartOptions: Partial<ChartOptionsRadial>;
  private scrollSubscription!: Subscription;

  ngOnInit(): void {
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    this.currentUserId = userData.Id
    this.currentUserRole = userData.Role
    this.orgIdFromLocalHost = userData.OrganizationId
    this.getDashboardData();
    this.setPage({ offset: 0 });
    
  }

  constructor(private cdr: ChangeDetectorRef) {

    // this.statsChart();
    // this.recruitmentChart();
    // this.loanChart();
    // Initialize the chart options


  }
  

  ngAfterViewInit() {
    if (this.viewport) {
      console.log('Viewport initialized');
      this.scrollSubscription = this.viewport.elementScrolled().subscribe(() => {
        console.log('Scroll event detected!');
        this.onScroll();
      });
    } else {
      console.error('Viewport not initialized');
    }
  }

  ngOnDestroy() {
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe(); // Clean up subscription
    }
  }

  dashboardData: any;
  getDashboardData(){
    var orgId: any;
    if(this.orgIdFromLocalHost){
      orgId = this.orgIdFromLocalHost
    }else {
      orgId = ''
    }

    this.deviceService.getDashboardDetails(orgId).subscribe(res => {
      debugger
      if (res && res.StatusCode == 200) {
        this.dashboardData = res.Result || [];
        setTimeout(() => {
          this.statsChart();
          this.loanChart();
        },)

        this.totalDevices = this.dashboardData.TotalLocation
        this.totalClientCompanyLocations = this.dashboardData.TotalClientCompaniesLocation
        this.totalClientCompanies = this.dashboardData.TotalClientCompanies
        this.totalEmployees = this.dashboardData.TotalEmployees
      }else {
        setTimeout(() => {
          this.statsChart();
          this.loanChart();
        }, 500)
      }
    })

  }
      
      // [
      //   {
      //     name: "Present",
      //     data: [0, 34, 34, 34, 46, 23, 22] // Raw data (will be normalized to 100%)
      //   },
      //   {
      //     name: "Absent",
      //     data: [20, 34, 34, 34, 46, 23, 22]
      //   },

      // ],
      // series: this.dashboardData.WeeklyAttendanceColumnGraph || [],

  statsChart() {
    this.chartOptions = {
      // series: [
      //   {
      //     name: "Present",
      //     data: [100, 200, 0, 4, 6, 500, 0] // Raw data (will be normalized to 100%)
      //   },
      //   {
      //     name: "Absent",
      //     data: [4,4,4,4,4,4,4]
      //   },

      // ],

      series: this.dashboardData?.WeeklyAttendanceColumnGraph ? this.dashboardData?.WeeklyAttendanceColumnGraph : 
      [{
            name: "Present",
            data: [0, 0, 0, 0, 0, 0, 0] 
          },
          {
            name: "Absent",
            data: [0, 0, 0, 0, 0, 0, 0]
          },
      ],
      
      chart: {
        type: "bar", // Keeping it as a bar chart
        height: 250, // Smaller chart size (reduced from 350 to 250)
        stacked: true, // Stacked remains true for percentage stacking
        // stackType: "100%",
        toolbar: {
          show: false // Removes the toolbar (including download button)
        },
        zoom: {
          enabled: false // Disable zoom if not needed
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: false,

            }
          }
        }
      },
      colors: ["#28A745", "#DC3545"],
      dataLabels: {
        enabled: false,
        formatter: function (val: number) {
          return val + "%"; // Display values as percentages
        }
      },
      xaxis: {
        type: "category",
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] // Monday to Sunday
      },
      legend: {
        position: "right",
        offsetY: 40
      },
      fill: {
        opacity: 1
      }
    };
  }



  // loanChart() {

  //   this.loanChartOptions = {
  //     series: [75, 15, 10], // Values for Present, Absent, Leave
  //     chart: {
  //       width: 380,
  //       type: "donut",
  //       events: {
  //         // This will help center the total value
  //         mounted: (chartContext, config) => {
  //           const total = this.loanChartOptions.series.reduce((a: number, b: number) => a + b, 0);
  //           chartContext.addText({
  //             x: config.globals.chartWidth / 2,
  //             y: config.globals.chartHeight / 2,
  //             text: `${total}`,
  //             textAnchor: 'middle',
  //             fontSize: '24px',
  //             fontWeight: 'bold',
  //             fontFamily: 'Helvetica, Arial, sans-serif'
  //           });
  //         },
  //         updated: (chartContext, config) => {
  //           const total = this.loanChartOptions.series.reduce((a: number, b: number) => a + b, 0);
  //           chartContext.addText({
  //             x: config.globals.chartWidth / 2,
  //             y: config.globals.chartHeight / 2,
  //             text: `${total}`,
  //             textAnchor: 'middle',
  //             fontSize: '24px',
  //             fontWeight: 'bold',
  //             fontFamily: 'Helvetica, Arial, sans-serif'
  //           });
  //         }
  //       }
  //     },
  //     labels: ['Present', 'Absent', 'Leave'],
  //     colors: ['#008ffb', '#FF1744', '#FFB300'], // Green for Present, Red for Absent, Yellow for Leave
  //     dataLabels: {
  //       enabled: true
  //     },
  //     fill: {
  //       type: "gradient",
  //       gradient: {
  //         shade: 'light',
  //         type: "vertical",
  //         shadeIntensity: 0.25,
  //         gradientToColors: undefined,
  //         inverseColors: true,
  //         opacityFrom: 0.85,
  //         opacityTo: 0.85,
  //         stops: [0, 90, 100]
  //       }
  //     },
  //     legend: {
  //       formatter: function (val: string, opts: any) {
  //         return val + " - " + opts.w.globals.series[opts.seriesIndex];
  //       },
  //       position: 'bottom'
  //     },
  //     responsive: [
  //       {
  //         breakpoint: 480,
  //         options: {
  //           chart: {
  //             width: 200
  //           },
  //           legend: {
  //             position: "bottom"
  //           }
  //         }
  //       }
  //     ],
  //     plotOptions: {
  //       pie: {
  //         donut: {
  //           labels: {
  //             show: true,
  //             total: {
  //               show: true,
  //               showAlways: true,
  //               label: 'Total',
  //               fontSize: '16px',
  //               color: '#373d3f',
  //               formatter: function (w) { // Add type assertion here
  //                 return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
  //               }
  //             } as any // ✅ This removes the TypeScript error
  //           }
  //         }
  //       }
  //     }

  //   };

  // }

  loanChart() {
    this.loanChartOptions = {
      series: this.dashboardData?.AttendancePieChart ? this.dashboardData?.AttendancePieChart : [0, 0], // Values for Present, Absent, Leave
      chart: {
        width: 380,
        type: "pie" // ✅ Using "pie" chart
      },
      labels: ['Present', 'Absent'],
      colors: ["#28A745", "#DC3545"], // ✅ Green for Present, Red for Absent
      dataLabels: {
        enabled: true
      },
      fill: {
        // type: "gradient",
        gradient: {
          // shade: 'light',
          type: "vertical",
          // shadeIntensity: 0.25,
          // gradientToColors: ["#28A745", "#DC3545"], // ✅ Darker shades for effect
          // inverseColors: true,
          // opacityFrom: 0.85,
          // opacityTo: 0.85,
          // stops: [0, 90, 100]
        }
      },
      legend: {
        formatter: function (val: string, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        },
        position: 'bottom'
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  
  

  isActive = true
  // setPage(pageInfo: any) {
  //   // this.selected = [];
  //   this.utils.showLoader();
  //   this.rows = JSON.parse(JSON.stringify([]));

  //   var pIndex = pageInfo.offset + 1;
  //   this.page.pageNumber = pageInfo.offset
  //   this.page.pageIndex = pageInfo.offset
  //   this.page.searchKeyword = this.searchKeyword;


  //   this.page.searchTerm = '';


  // this.userService.getAllUsers(this.page, pIndex, this.orgIdFromLocalHost,this.isActive).subscribe((pagedData) => {

  //     if (pagedData && pagedData.Result && pagedData.Result.length) {
  //       this.page.totalElements = pagedData.TotalPages;
  //       // this.page.totalElements = this.page.totalElements;
  //       // var filteredRows = pagedData.Result.filter(row => row.IsActive);
  //       this.employeesData = pagedData.Result


  //       this.utils.hideLoader();

  //     }else {
  //       this.utils.hideLoader();
  //     }
  //     this.utils.hideLoader();
  //   }, (error) => {
  //     this.utils.hideLoader();
  //   });
  // }

  // setPage(pageInfo: any) {
  //   this.utils.showLoader();
  //   this.rows = JSON.parse(JSON.stringify([]));

  //   const pIndex = pageInfo.offset + 1;
  //   this.page.pageNumber = pageInfo.offset;
  //   this.page.pageIndex = pageInfo.offset;
  //   this.page.searchKeyword = this.searchKeyword;


  //   this.userService.getAllUsers(this.page, pIndex, this.orgIdFromLocalHost, this.isActive, null).subscribe(
  //     (pagedData) => {
  //       if (pagedData && pagedData.Result && pagedData.Result.length) {
  //         this.page.totalElements = pagedData.TotalPages;
  //         // Append new data to existing employeesData instead of replacing it
  //         var tempArr = [...this.employeesData, ...pagedData.Result];
  //         this.employeesData = JSON.parse(JSON.stringify(tempArr));
  //         this.utils.hideLoader();
  //       } else {
  //         this.utils.hideLoader();
  //       }
  //       this.isLoadingMore = false; // Reset flag
  //     },
  //     (error) => {
  //       this.utils.hideLoader();
  //       this.isLoadingMore = false; // Reset flag on error
  //     }
  //   );
  // }

  setPage(pageInfo: any) {
    this.utils.showLoader();
    this.rows = []; // Clear rows (if used elsewhere)

    const pIndex = pageInfo.offset + 1;
    this.page.pageNumber = pageInfo.offset;
    this.page.pageIndex = pageInfo.offset;
    this.page.searchKeyword = this.searchKeyword;

    this.userService.getAllUsers(this.page, pIndex, this.orgIdFromLocalHost, this.isActive, null).subscribe(
      (pagedData) => {
        if (pagedData && pagedData.Result && pagedData.Result.length) {
          this.page.totalElements = pagedData.TotalPages; // Adjust if this should be TotalElements

          // If there's a search keyword, always replace the data (don't merge)
          if (this.searchKeyword) {
            this.employeesData = [...pagedData.Result]; // Replace with new search results
          } else {
            // If no search keyword, append for pagination (current behavior)
            if (this.page.pageNumber === 0) {
              this.employeesData = [...pagedData.Result]; // Replace on first page
            } else {
              this.employeesData = [...this.employeesData, ...pagedData.Result]; // Append for pagination
            }
          }
          this.cdr.detectChanges();
          
          // this.cdr.detectChanges(); // Manually trigger change detection
          // this.scrollViewport?.checkViewportSize(); // Ensure virtual scroll updates
        } else {
          // If no results, clear data only if it's the first page or there's a search
          if (this.page.pageNumber === 0 || this.searchKeyword) {
            this.employeesData = [];
          }
          // this.cdr.detectChanges();
        }
        this.utils.hideLoader();
        this.isLoadingMore = false;
      },
      (error) => {
        this.utils.hideLoader();
        this.isLoadingMore = false;
      }
    );
  }

  onSearch(event: any) {
    this.searchKeyword = event.target.value;
    setTimeout(() => {
      this.setPage({ offset: 0 });
    }, 1000)
  }

  // Method called on scroll
  isLoadingMore: boolean = false;
  onScroll() {
    if (this.viewport && !this.isLoadingMore) {
      const scrollOffset = this.viewport.measureScrollOffset('bottom');
      console.log('Scroll Offset from Bottom:', scrollOffset);

      if (scrollOffset <= 50 && this.employeesData.length < this.page.totalElements) { // Increased threshold
        console.log('Bottom reached, fetching more data...');
        this.isLoadingMore = true;
        const nextPage = this.page.pageNumber + 1;
        this.setPage({ offset: nextPage });
      }
    }
  }


  addEmployee() {

  }

}
