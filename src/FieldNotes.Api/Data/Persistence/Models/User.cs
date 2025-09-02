namespace FieldNotes.Api.Data.Persistence.Models;

public class User : Entity
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public ICollection<Note> Notes { get; set; } = null!;
}
