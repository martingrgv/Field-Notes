using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Notes.Requests;
using FieldNotes.Api.Pagination;

namespace FieldNotes.Api.Notes;

public interface INoteService
{
    Task<PagedResult<Note>> GetAllAsync(NotesQueryRequest request);
    Task<Note> GetByIdAsync(Guid noteId);
    Task<Note> CreateAsync(CreateNoteRequest request, Guid userId, string username);
    Task<Note> UpdateAsync(UpdateNoteRequest request, string username);
    Task DeleteAsync(Guid noteId);
}
