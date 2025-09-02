namespace FieldNotes.Api.Notes.Responses;

public class NoteDetailsResponse : NoteResponse
{
    public string? Description { get; set; } = null!;
    public DateTimeOffset LastUpdated { get; set; }
    public string LastUpdatedBy { get; set; } = null!;
}
