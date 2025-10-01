export interface Note {
    id: string;
    title: string;
    description?: string;
    category?: string;
    lastUpdated: string;
    lastUpdatedBy: string;
    userId: string;
}
