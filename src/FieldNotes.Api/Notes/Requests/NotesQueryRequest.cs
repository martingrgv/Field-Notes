namespace FieldNotes.Api.Notes.Requests;

public class NotesQueryRequest
{
    public int PageNumber { get; set; } = 0;
    public int PageSize { get; set; } = 10;
    public string? Category { get; set; } = default;
}
