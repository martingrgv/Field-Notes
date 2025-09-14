import type { Note } from "./Note"

export interface PaginatedResult {
    items: Note[]
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    hasNexPage: boolean;
    hasPreviousPage: boolean;
}
