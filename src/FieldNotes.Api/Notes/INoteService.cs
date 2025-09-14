using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Notes.Requests;
using FieldNotes.Api.Notes.Responses;
using FieldNotes.Api.Pagination;

namespace FieldNotes.Api.Notes;

public interface INoteService
{
    Task<PagedResult<Note>> GetAllAsync(NotesQueryRequest request, string userId);
    Task<NoteDetailsResponse> GetByIdAsync(string id);
    Task<string[]> GetCategoriesAsync(string userId);
    Task<Note> CreateAsync(CreateNoteRequest request, string userId, string username);
    Task<Note> UpdateAsync(UpdateNoteRequest request, string username);
    Task DeleteAsync(string noteId);
}
