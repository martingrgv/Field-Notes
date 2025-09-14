export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface CreateNoteRequest {
    title: string;
    description?: string;
    category: string;
}

export interface UpdateNoteRequest extends CreateNoteRequest {
    id: string;
} 
