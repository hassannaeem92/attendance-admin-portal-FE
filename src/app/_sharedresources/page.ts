export class Page {
    //The number of elements in the page
    size: number = 7;
    //The total number of elements
    totalElements: number = 0;
    //The total number of pages
    totalPages: number = 0;
    //The current page number
    pageNumber: number = 0;
    sortOn: string = 'id';
    sortBy: string = 'DESC';
    searchKeyword: string = '';
    transactionType?: number;

    pageIndex: number = 1;
    pageSize: number = 10;
    isDropdown: boolean = false;
    searchTerm: string = '';
    isActive: boolean = true
}