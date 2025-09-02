namespace FieldNotes.Api.Data.Persistence.Models;

public class Note : Entity
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; } = null!;
    public string? Category { get; set; } = null!;
    public DateTimeOffset LastUpdated { get; set; } = DateTimeOffset.UtcNow;
    public string LastUpdatedBy { get; set; } = null!;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}
