export interface Pager {
  currentPage:  number;
  currentUri : any;

  hasMore : boolean;
  next :any;
  pageCount :number;
  pageSelector: string;
  perPage: number;
  previous :any;
  segment : number;
  total : number;
  uri : any
}
