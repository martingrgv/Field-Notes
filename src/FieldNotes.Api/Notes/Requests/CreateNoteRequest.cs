namespace FieldNotes.Api.Notes.Requests;

public class CreateNoteRequest
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = default;
    public string? Category { get; set; } = default;
}
