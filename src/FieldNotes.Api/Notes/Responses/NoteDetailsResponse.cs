namespace FieldNotes.Api.Notes.Responses;

public class NoteDetailsResponse
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Category { get; set; } = null!;
    public DateTimeOffset LastUpdated { get; set; } = DateTimeOffset.UtcNow;
    public string LastUpdatedBy { get; set; } = null!;
}
