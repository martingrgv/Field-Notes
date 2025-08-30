namespace FieldNotes.Api.Data.Services;

public class PasswordHasher
{
    public string GenerateHash(string password)
    {
        return "12345";
    }

    public void Verify(string password, string passwordHash)
    {

    }
}
