export interface Pager {
  pageSize: number;
  cursor?: string;
}

export interface PagedResult<T> {
  data: T[];
  cursor?: string;
  messages?: string[];
}
