import { PageData, PaginatedResult } from "../../domain/entities/Paginacion";

// Convierte { data, total } en la respuesta { pagination, data } que pide la entrega
export function paginar<T>(resultado: PageData<T>, page: number, limit: number): PaginatedResult<T> {
  return {
    pagination: {
      page,
      limit,
      total: resultado.total,
      totalPages: Math.max(1, Math.ceil(resultado.total / limit)),
    },
    data: resultado.data,
  };
}
