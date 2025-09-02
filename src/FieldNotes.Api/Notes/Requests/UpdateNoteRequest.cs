namespace FieldNotes.Api.Notes.Requests;

public class UpdateNoteRequest : CreateNoteRequest
{
    public Guid Id { get; set; }
}
