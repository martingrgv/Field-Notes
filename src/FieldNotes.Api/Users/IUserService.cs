using FieldNotes.Api.Data.Persistence.Models;

namespace FieldNotes.Api.Users;

public interface IUserService
{
    User GetUserByUsername(string username);
    User Register(UserCredentialViewModel userViewModel);
    string Login(User user);
}
