using FieldNotes.Api.Data.Persistence;
using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Notes.Requests;
using FieldNotes.Api.Pagination;
using Microsoft.EntityFrameworkCore;

namespace FieldNotes.Api.Notes;

public class NoteService(FieldNotesDbContext dbContext) : INoteService
{
    public async Task<Note> CreateAsync(CreateNoteRequest request, Guid userId, string username)
    {
        var note = new Note
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = username
        };

        dbContext.Notes.Add(note);
        await dbContext.SaveChangesAsync();

        return note;
    }

    public async Task<Note> UpdateAsync(UpdateNoteRequest request, string username)
    {
        var note = await dbContext.Notes.FindAsync(request.Id);

        if (note is not null)
        {
            note.Title = request.Title;
            note.Description = request.Description;
            note.Category = request.Category;
            note.LastUpdated = DateTimeOffset.UtcNow;
            note.LastUpdatedBy = username;

            await dbContext.SaveChangesAsync();

            return note;
        }

        throw new InvalidOperationException("Note is not found!");
    }

    public async Task DeleteAsync(Guid noteId)
    {
        var note = await dbContext.Notes.FindAsync(noteId);

        if (note is not null)
        {
            dbContext.Notes.Remove(note);
        }

        throw new InvalidOperationException("Note is not found!");
    }

    public async Task<PagedResult<Note>> GetAllAsync(NotesQueryRequest request)
    {
        if (request.PageSize <= 0) request.PageSize = 10;
        if (request.PageNumber <= 0) request.PageSize = 1;

        var query = dbContext.Notes.AsQueryable();

        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(n => n.Category != null &&
                string.Equals(n.Category, request.Category, StringComparison.OrdinalIgnoreCase));
        }

        var totalCount = await query.CountAsync();

        var notes = await query
            .OrderByDescending(n => n.LastUpdated)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PagedResult<Note>
        {
            Items = notes,
            TotalCount = totalCount,
            PageSize = request.PageSize,
            PageNumber = request.PageNumber
        };
    }
}
