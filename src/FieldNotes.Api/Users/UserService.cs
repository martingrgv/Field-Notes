using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Data.Services;

namespace FieldNotes.Api.Users;

public class UserService(PasswordHasher passwordHasher, TokenProvider tokenProvider) : IUserService
{
    public User GetUserByUsername(string username)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = "example@mail.com",
            Username = "guest",
            Password = "guest12345"
        };
    }

    public string Login(User user)
    {
        string token = tokenProvider.CreateToken(user);
        return token;
    }

    public User Register(UserCredentialViewModel userViewModel)
    {
        string hashedPassword = passwordHasher.GenerateHash(userViewModel.Password);

        return new User
        {
            Id = Guid.NewGuid(),
            Username = userViewModel.Username,
            Email = userViewModel.Email,
            Password = hashedPassword
        };
    }
}
