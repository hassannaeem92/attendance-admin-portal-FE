import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormModule } from '@coreui/angular';


@Component({
  selector: 'app-table-footer',
  standalone: true,
  imports: [MatFormFieldModule, MatOptionModule, MatSelectModule, NgIf, FormModule, NgStyle],
  templateUrl: './table-footer.component.html',
  styleUrl: './table-footer.component.scss'
})
export class TableFooterComponent {
  delete = 'Delete';
  ddPageSize = 5;
  // tableViewtext = Constants.tableViewtext;
  // IMPORT = Constants.importText;
  // DOWNLOAD_TEMPLATE = Constants.downloadTemplateText;
  btnCancelText = 'Cancel';


  @Input() page: any;
  @Input() isShowImportDownloadBtn: boolean = false;
  @Output() clickEventImportDownloadBtn = new EventEmitter<any>()
  @Input() isImportShow: boolean = true;
  @Input() isDownloadTemplateShow: boolean = true;
  @Input() showPaginate: boolean = true;

  @Input() isDeleteShow: boolean = true;
  @Input() selected: any;
  @Output() changePageSizeEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  // @Input() onCancelURL: string = null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['page'] && changes['page'].currentValue) {
      this.page = changes['page'].currentValue;
      this.ddPageSize = this.page.size
    }
  }

  ngOnInit() {
    this.ddPageSize = this.page.size
  }

  /**
   * To change page size
   * @param event 
   */
  changePageSize(event: any) {
    this.page
    this.ddPageSize = event;
    this.changePageSizeEvent.emit(event);
  }

  clickEvent(event: any) {
    this.clickEventImportDownloadBtn.emit(event)
  }

  deleteClick() {
    // debugger
    // console.log('JJ')
    // $('#confirmation-modal').modal('show');
    this.deleteEvent.emit();
    

  }
}
