namespace FieldNotes.Api.Notes.Requests;

public class RenameCategoryRequest
{
    public string Category { get; set; } = null!;
    public string NewCategory { get; set; } = null!;
}
