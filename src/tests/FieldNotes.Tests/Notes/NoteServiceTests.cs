using FieldNotes.Api.Notes;
using FieldNotes.Api.Data.Persistence;
using FieldNotes.Api.Notes.Requests;
using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Notes.Responses;

namespace FieldNotes.Tests.Notes;

[TestFixture]
public class NoteServiceTests
{
    private NoteService _noteService;
    private FieldNotesDbContext _dbContext;
    private DbContextOptions<FieldNotesDbContext> _dbOptions;

    [SetUp]
    public void Setup()
    {
        _dbOptions = new DbContextOptionsBuilder<FieldNotesDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _dbContext = new FieldNotesDbContext(_dbOptions);
        _noteService = new NoteService(_dbContext);
    }

    [Test]
    public async Task CreateAsync_ValidRequest_ShouldCreateAndReturnNote()
    {
        var request = new CreateNoteRequest
        {
            Title = "Test Note",
            Description = "Test Description",
            Category = "Test Category"
        };
        var userId = Guid.NewGuid().ToString();
        var username = "testuser";

        var result = await _noteService.CreateAsync(request, userId, username);
        var savedNote = await _dbContext.Notes.FindAsync(result.Id);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.Not.EqualTo(Guid.Empty));
            Assert.That(result.Title, Is.EqualTo(request.Title));
            Assert.That(result.Description, Is.EqualTo(request.Description));
            Assert.That(result.Category, Is.EqualTo(request.Category));
            Assert.That(result.UserId, Is.EqualTo(Guid.Parse(userId)));
            Assert.That(result.LastUpdatedBy, Is.EqualTo(username));
            Assert.That(result.LastUpdated, Is.LessThanOrEqualTo(DateTimeOffset.UtcNow));
        });

        Assert.Multiple(() =>
        {
            Assert.That(savedNote, Is.Not.Null);
            Assert.That(savedNote!.Title, Is.EqualTo(request.Title));
        });
    }

    [Test]
    public async Task CreateAsync_WithNullDescription_ShouldCreateNote()
    {
        var request = new CreateNoteRequest
        {
            Title = "Test Note",
            Description = null,
            Category = "Test Category"
        };
        var userId = Guid.NewGuid().ToString();
        var username = "testuser";

        var result = await _noteService.CreateAsync(request, userId, username);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo(request.Title));
            Assert.That(result.Description, Is.Null);
            Assert.That(result.Category, Is.EqualTo(request.Category));
        });
    }

    [Test]
    public async Task CreateAsync_WithNullCategory_ShouldCreateNote()
    {
        var request = new CreateNoteRequest
        {
            Title = "Test Note",
            Description = "Test Description",
            Category = null
        };
        var userId = Guid.NewGuid().ToString();
        var username = "testuser";

        var result = await _noteService.CreateAsync(request, userId, username);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo(request.Title));
            Assert.That(result.Description, Is.EqualTo(request.Description));
            Assert.That(result.Category, Is.Null);
        });
    }

    [Test]
    public async Task UpdateAsync_ValidRequestNoteExists_ShouldUpdateNote()
    {
        var existingNote = await SeedNoteAsync();

        var request = new UpdateNoteRequest
        {
            Id = existingNote.Id.ToString(),
            Title = "Updated Note",
            Description = "Updated Category",
            Category = "Updated Category",
        };

        string username = "update user";

        var result = await _noteService.UpdateAsync(request, username);
        var savedNote = await _dbContext.Notes.FindAsync(result.Id);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(existingNote.Id));
            Assert.That(result.Title, Is.EqualTo(request.Title));
            Assert.That(result.Description, Is.EqualTo(request.Description));
            Assert.That(result.Category, Is.EqualTo(request.Category));
            Assert.That(result.UserId, Is.EqualTo(existingNote.UserId));
            Assert.That(result.LastUpdatedBy, Is.EqualTo(username));
            Assert.That(result.LastUpdated, Is.LessThanOrEqualTo(DateTimeOffset.UtcNow));
        });

        Assert.Multiple(() =>
        {
            Assert.That(savedNote, Is.Not.Null);
            Assert.That(savedNote!.Title, Is.EqualTo(request.Title));
            Assert.That(savedNote.Description, Is.EqualTo(request.Description));
            Assert.That(savedNote.Category, Is.EqualTo(request.Category));
            Assert.That(savedNote.LastUpdatedBy, Is.EqualTo(username));
        });
    }

    [Test]
    public void UpdateAsync_ValidRequestNoteNonExisting_ShouldThrowException()
    {
        var request = new UpdateNoteRequest
        {
            Id = Guid.NewGuid().ToString(),
            Title = "Updated Note",
            Description = "Updated Category",
            Category = "Updated Category",
        };

        string username = "update user";

        var ex = Assert.ThrowsAsync<InvalidOperationException>(() => _noteService.UpdateAsync(request, username));
        Assert.That(ex.Message, Is.EqualTo("Note not found!"));
    }

    [Test]
    public async Task DeleteAsync_ExistingNote_ShouldDeleteNote()
    {
        var existingNote = await SeedNoteAsync();

        var savedNote = await _dbContext.Notes.FindAsync(existingNote.Id);
        await _noteService.DeleteAsync(existingNote.Id.ToString());
        var savedNoteAfterDelete = await _dbContext.Notes.FindAsync(existingNote.Id);

        Assert.Multiple(() =>
        {
            Assert.That(savedNote, Is.Not.Null);
            Assert.That(savedNoteAfterDelete, Is.Null);
        });
    }

    [Test]
    public void DeleteAsync_NonExistingNote_ShouldThrowException()
    {
        string noteId = Guid.NewGuid().ToString();

        var ex = Assert.ThrowsAsync<InvalidOperationException>(() => _noteService.DeleteAsync(noteId));

        Assert.That(ex.Message, Is.EqualTo("Note not found!"));
    }

    [Test]
    public async Task GetByIdAsync_ExistingNote_ShouldReturnNoteDetailsResponse()
    {
        var existingNote = await SeedNoteAsync();

        var result = await _noteService.GetByIdAsync(existingNote.Id.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Is.TypeOf(typeof(NoteDetailsResponse)));
            Assert.That(result.Id, Is.EqualTo(existingNote.Id.ToString()));
            Assert.That(result.Title, Is.EqualTo(existingNote.Title));
            Assert.That(result.Description, Is.EqualTo(existingNote.Description));
            Assert.That(result.Category, Is.EqualTo(existingNote.Category));
        });
    }

    [Test]
    public void GetByIdAsync_NoteNonExisting_ShouldThrowException()
    {
        string noteId = Guid.NewGuid().ToString();

        var ex = Assert.ThrowsAsync<InvalidOperationException>(() => _noteService.GetByIdAsync(noteId));

        Assert.That(ex.Message, Is.EqualTo("Note not found"));
    }

    [Test]
    public async Task GetCategoriesAsync_NotesWithDifferentCategoriesValidUser_ShouldReturnCategoriesDistinct()
    {
        var userId = Guid.NewGuid();
        var note1 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 1",
            Description = "Description 1",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note2 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 2",
            Description = "Description 2",
            Category = "Personal",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note3 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 3",
            Description = "Description 3",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(note1, note2, note3);
        await _dbContext.SaveChangesAsync();

        var result = await _noteService.GetCategoriesAsync(userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(2));
            Assert.That(result, Contains.Item("Work"));
            Assert.That(result, Contains.Item("Personal"));
        });
    }

    [Test]
    public async Task GetCategoriesAsync_NotesWithNoCategoryValidUser_ShouldReturnEmptyArray()
    {
        var userId = Guid.NewGuid();
        var note1 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 1",
            Description = "Description 1",
            Category = null,
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note2 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 2",
            Description = "Description 2",
            Category = "",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(note1, note2);
        await _dbContext.SaveChangesAsync();

        var result = await _noteService.GetCategoriesAsync(userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(0));
        });
    }

    [Test]
    public async Task GetCategoriesAsync_NoNotesValidUser_ShouldReturnEmptyArray()
    {
        var userId = Guid.NewGuid();

        var result = await _noteService.GetCategoriesAsync(userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(0));
        });
    }

    [Test]
    public async Task GetCategoriesAsync_NotesWithDifferentCategoriesInvalidUser_ShouldReturnEmptyArray()
    {
        var validUserId = Guid.NewGuid();
        var invalidUserId = Guid.NewGuid();

        var note1 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 1",
            Description = "Description 1",
            Category = "Work",
            UserId = validUserId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note2 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 2",
            Description = "Description 2",
            Category = "Personal",
            UserId = validUserId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(note1, note2);
        await _dbContext.SaveChangesAsync();

        var result = await _noteService.GetCategoriesAsync(invalidUserId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(0));
        });
    }

    [Test]
    public async Task GetAllAsync_ValidRequestWithPagination_ShouldReturnPagedNotes()
    {
        var userId = Guid.NewGuid();
        var notes = new List<Note>();

        for (int i = 1; i <= 15; i++)
        {
            notes.Add(new Note
            {
                Id = Guid.NewGuid(),
                Title = $"Note {i}",
                Description = $"Description {i}",
                Category = "Work",
                UserId = userId,
                LastUpdated = DateTimeOffset.UtcNow.AddDays(-i),
                LastUpdatedBy = "testuser"
            });
        }

        _dbContext.Notes.AddRange(notes);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 2,
            PageSize = 5
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Items.Count, Is.EqualTo(5));
            Assert.That(result.TotalCount, Is.EqualTo(15));
            Assert.That(result.PageNumber, Is.EqualTo(2));
            Assert.That(result.PageSize, Is.EqualTo(5));
            Assert.That(result.Items.First().Title, Is.EqualTo("Note 6"));
        });
    }

    [Test]
    public async Task GetAllAsync_WithCategoryFilter_ShouldReturnFilteredNotes()
    {
        var userId = Guid.NewGuid();
        var workNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Work Note",
            Description = "Work Description",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var personalNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Personal Note",
            Description = "Personal Description",
            Category = "Personal",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow.AddMinutes(-1),
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(workNote, personalNote);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 1,
            PageSize = 10,
            Category = "Work"
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Items.Count, Is.EqualTo(1));
            Assert.That(result.TotalCount, Is.EqualTo(1));
            Assert.That(result.Items.First().Category, Is.EqualTo("Work"));
            Assert.That(result.Items.First().Title, Is.EqualTo("Work Note"));
        });
    }

    [Test]
    public async Task GetAllAsync_InvalidPaginationParameters_ShouldUseDefaults()
    {
        var userId = Guid.NewGuid();
        var note = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Test Note",
            Description = "Test Description",
            Category = "Test",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.Add(note);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 0,
            PageSize = -5
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.PageSize, Is.EqualTo(10));
            Assert.That(result.Items.Count, Is.EqualTo(1));
        });
    }

    [Test]
    public async Task GetAllAsync_NoNotesForUser_ShouldReturnEmptyResult()
    {
        var userId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var otherUserNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Other User Note",
            Description = "Other Description",
            Category = "Work",
            UserId = otherUserId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "otheruser"
        };

        _dbContext.Notes.Add(otherUserNote);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 1,
            PageSize = 10
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Items.Count, Is.EqualTo(0));
            Assert.That(result.TotalCount, Is.EqualTo(0));
            Assert.That(result.PageNumber, Is.EqualTo(1));
            Assert.That(result.PageSize, Is.EqualTo(10));
        });
    }

    [Test]
    public async Task GetAllAsync_OrderByLastUpdated_ShouldReturnNotesInDescendingOrder()
    {
        var userId = Guid.NewGuid();
        var oldNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Old Note",
            Description = "Old Description",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow.AddDays(-2),
            LastUpdatedBy = "testuser"
        };
        var newNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "New Note",
            Description = "New Description",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var middleNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Middle Note",
            Description = "Middle Description",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow.AddDays(-1),
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(oldNote, newNote, middleNote);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 1,
            PageSize = 10
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Items.Count, Is.EqualTo(3));
            Assert.That(result.Items[0].Title, Is.EqualTo("New Note"));
            Assert.That(result.Items[1].Title, Is.EqualTo("Middle Note"));
            Assert.That(result.Items[2].Title, Is.EqualTo("Old Note"));
        });
    }

    [Test]
    public async Task GetByIdAsync_AccessingOtherUsersNote_ShouldReturnNote()
    {
        var userId1 = Guid.NewGuid();
        var userId2 = Guid.NewGuid();

        var note = new Note
        {
            Id = Guid.NewGuid(),
            Title = "User1 Note",
            Description = "User1 Description",
            Category = "User1 Category",
            UserId = userId1,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "user1"
        };

        _dbContext.Notes.Add(note);
        await _dbContext.SaveChangesAsync();

        var result = await _noteService.GetByIdAsync(note.Id.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(note.Id.ToString()));
            Assert.That(result.Title, Is.EqualTo("User1 Note"));
        });
    }

    [Test]
    public void CreateAsync_InvalidUserIdGuid_ShouldThrowFormatException()
    {
        var request = new CreateNoteRequest
        {
            Title = "Test Note",
            Description = "Test Description",
            Category = "Test Category"
        };
        var invalidUserId = "invalid-guid";
        var username = "testuser";

        Assert.ThrowsAsync<FormatException>(() => _noteService.CreateAsync(request, invalidUserId, username));
    }

    [Test]
    public void UpdateAsync_InvalidNoteIdGuid_ShouldThrowFormatException()
    {
        var request = new UpdateNoteRequest
        {
            Id = "invalid-guid",
            Title = "Updated Note",
            Description = "Updated Description",
            Category = "Updated Category"
        };
        var username = "testuser";

        Assert.ThrowsAsync<FormatException>(() => _noteService.UpdateAsync(request, username));
    }

    [Test]
    public void DeleteAsync_InvalidNoteIdGuid_ShouldThrowFormatException()
    {
        var invalidNoteId = "invalid-guid";

        Assert.ThrowsAsync<FormatException>(() => _noteService.DeleteAsync(invalidNoteId));
    }

    [Test]
    public void GetByIdAsync_InvalidNoteIdGuid_ShouldThrowFormatException()
    {
        var invalidNoteId = "invalid-guid";

        Assert.ThrowsAsync<FormatException>(() => _noteService.GetByIdAsync(invalidNoteId));
    }


    [Test]
    public async Task UpdateAsync_WithNullValues_ShouldUpdateNote()
    {
        var existingNote = await SeedNoteAsync();

        await Task.Delay(10);

        var request = new UpdateNoteRequest
        {
            Id = existingNote.Id.ToString(),
            Title = "Updated Title",
            Description = null,
            Category = null
        };
        var username = "testuser";

        var result = await _noteService.UpdateAsync(request, username);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Title, Is.EqualTo("Updated Title"));
            Assert.That(result.Description, Is.Null);
            Assert.That(result.Category, Is.Null);
            Assert.That(result.LastUpdatedBy, Is.EqualTo(username));
            Assert.That(result.LastUpdated, Is.GreaterThanOrEqualTo(existingNote.LastUpdated));
        });
    }

    [Test]
    public async Task GetAllAsync_WithEmptyCategoryFilter_ShouldReturnAllNotes()
    {
        var userId = Guid.NewGuid();
        var note1 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 1",
            Description = "Description 1",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note2 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 2",
            Description = "Description 2",
            Category = null,
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow.AddMinutes(-1),
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(note1, note2);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 1,
            PageSize = 10,
            Category = ""
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Items.Count, Is.EqualTo(2));
            Assert.That(result.TotalCount, Is.EqualTo(2));
        });
    }

    [Test]
    public async Task GetAllAsync_WithNullCategoryFilter_ShouldReturnAllNotes()
    {
        var userId = Guid.NewGuid();
        var note1 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 1",
            Description = "Description 1",
            Category = "Work",
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note2 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 2",
            Description = "Description 2",
            Category = null,
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow.AddMinutes(-1),
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(note1, note2);
        await _dbContext.SaveChangesAsync();

        var request = new NotesQueryRequest
        {
            PageNumber = 1,
            PageSize = 10,
            Category = null
        };

        var result = await _noteService.GetAllAsync(request, userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Items.Count, Is.EqualTo(2));
            Assert.That(result.TotalCount, Is.EqualTo(2));
        });
    }

    [Test]
    public async Task GetByIdAsync_CompleteFieldMapping_ShouldReturnAllFields()
    {
        var existingNote = await SeedNoteAsync();

        var result = await _noteService.GetByIdAsync(existingNote.Id.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Id, Is.EqualTo(existingNote.Id.ToString()));
            Assert.That(result.Title, Is.EqualTo(existingNote.Title));
            Assert.That(result.Description, Is.EqualTo(existingNote.Description));
            Assert.That(result.Category, Is.EqualTo(existingNote.Category));
            Assert.That(result.LastUpdated, Is.EqualTo(existingNote.LastUpdated));
            Assert.That(result.LastUpdatedBy, Is.EqualTo(existingNote.LastUpdatedBy));
        });
    }

    [Test]
    public async Task GetCategoriesAsync_WithUnicodeCategories_ShouldReturnCorrectly()
    {
        var userId = Guid.NewGuid();
        var note1 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 1",
            Description = "Description 1",
            Category = "工作", // Chinese for "Work"
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };
        var note2 = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Note 2",
            Description = "Description 2",
            Category = "Träning", // Swedish for "Training"
            UserId = userId,
            LastUpdated = DateTimeOffset.UtcNow,
            LastUpdatedBy = "testuser"
        };

        _dbContext.Notes.AddRange(note1, note2);
        await _dbContext.SaveChangesAsync();

        var result = await _noteService.GetCategoriesAsync(userId.ToString());

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(2));
            Assert.That(result, Contains.Item("工作"));
            Assert.That(result, Contains.Item("Träning"));
        });
    }

    [TearDown]
    public void TearDown()
    {
        _dbContext.Dispose();
    }

    private async Task<Note> SeedNoteAsync()
    {
        var existingNote = new Note
        {
            Id = Guid.NewGuid(),
            Title = "Existing Note",
            Description = "Existing Description",
            Category = "Existing Category",
            UserId = Guid.NewGuid(),
            LastUpdated = DateTimeOffset.UtcNow.AddDays(-1),
            LastUpdatedBy = "existing user"
        };

        _dbContext.Add(existingNote);
        await _dbContext.SaveChangesAsync();

        return existingNote;
    }
}
