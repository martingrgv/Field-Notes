namespace FieldNotes.Api.Users.Requests;

public class UserRegisterRequest : UserCredentialRequest
{
    public string Email { get; set; } = null!;
}
