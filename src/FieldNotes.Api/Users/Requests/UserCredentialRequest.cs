namespace FieldNotes.Api.Users.Requests;

public abstract class UserCredentialRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
