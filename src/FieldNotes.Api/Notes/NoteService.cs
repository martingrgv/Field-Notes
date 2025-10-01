using FieldNotes.Api.Data.Persistence;
using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Notes.Requests;
using FieldNotes.Api.Notes.Responses;
using FieldNotes.Api.Pagination;
using Microsoft.EntityFrameworkCore;

namespace FieldNotes.Api.Notes;

public class NoteService(FieldNotesDbContext dbContext) : INoteService
{
    public async Task<Note> CreateAsync(CreateNoteRequest request, string userId, string username)
    {
        var note = new Note
        {
            Id = Guid.NewGuid(),
            UserId = Guid.Parse(userId),
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
        var noteId = Guid.Parse(request.Id);
        var note = await dbContext.Notes.FindAsync(noteId);

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

    public async Task DeleteAsync(string noteId)
    {
        var internalNoteId = Guid.Parse(noteId);
        var note = await dbContext.Notes.FindAsync(internalNoteId);

        if (note != null)
        {
            dbContext.Notes.Remove(note);
            await dbContext.SaveChangesAsync();

            return;
        }

        throw new InvalidOperationException("Note not found!");
    }

    public async Task<PagedResult<Note>> GetAllAsync(NotesQueryRequest request, string userId)
    {
        if (request.PageSize <= 0) request.PageSize = 10;
        if (request.PageNumber <= 0) request.PageSize = 1;

        var query = dbContext.Notes
            .Where(n => n.UserId == Guid.Parse(userId))
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrEmpty(request.Category))
        {
            query = query.Where(n => n.Category != null &&
                n.Category == request.Category);
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
            PageNumber = request.PageNumber,
            PageSize = request.PageSize
        };
    }

    public async Task<string[]> GetCategoriesAsync(string userId)
    {
        string[] categories = await dbContext.Notes
            .AsNoTracking()
            .Where(n => !string.IsNullOrEmpty(n.Category) &&
                    n.UserId == Guid.Parse(userId))
            .Select(n => n.Category!)
            .Distinct()
            .ToArrayAsync();

        return categories;
    }

    public async Task<NoteDetailsResponse> GetByIdAsync(string id)
    {
        var noteId = Guid.Parse(id);
        var note = await dbContext.Notes.FindAsync(noteId);

        if (note is not null)
        {
            return new NoteDetailsResponse
            {
                Id = note.Id.ToString(),
                Title = note.Title,
                Description = note.Description,
                Category = note.Category,
                LastUpdated = note.LastUpdated,
                LastUpdatedBy = note.LastUpdatedBy
            };
        }

        throw new InvalidOperationException("Note not found");
    }
}
