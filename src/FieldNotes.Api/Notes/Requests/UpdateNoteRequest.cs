namespace FieldNotes.Api.Notes.Requests;

public class UpdateNoteRequest : CreateNoteRequest
{
    public string Id { get; set; } = null!;
}
