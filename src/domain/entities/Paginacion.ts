export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  pagination: Pagination;
  data: T[];
}

// Lo que devuelve un repositorio: los datos de la página y el total de registros
export interface PageData<T> {
  data: T[];
  total: number;
}
