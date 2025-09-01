using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Users.Requests;

namespace FieldNotes.Api.Users;

public interface IUserService
{
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<Guid> RegisterAsync(UserRegisterRequest request);
    Task<string> LoginAsync(UserLoginRequest request);
}
