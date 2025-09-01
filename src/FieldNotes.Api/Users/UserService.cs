using FieldNotes.Api.Data.Persistence;
using FieldNotes.Api.Data.Persistence.Models;
using FieldNotes.Api.Data.Services;
using FieldNotes.Api.Users.Requests;
using Microsoft.EntityFrameworkCore;

namespace FieldNotes.Api.Users;

public class UserService(FieldNotesDbContext dbContext, IPasswordHasher passwordHasher, TokenProvider tokenProvider) : IUserService
{
    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<string> LoginAsync(UserLoginRequest request)
    {
        var user = await GetUserByUsernameAsync(request.Username);

        if (user is not null)
        {
            string token = tokenProvider.CreateToken(user);
            return token;
        }

        throw new InvalidOperationException("User not found!");
    }

    public async Task<Guid> RegisterAsync(UserRegisterRequest request)
    {
        if (await GetUserByUsernameAsync(request.Username) is not null)
        {
            throw new InvalidOperationException("Username already exists");
        }
        if (await GetUserByEmailAsync(request.Email) is not null)
        {
            throw new InvalidOperationException("User already exists");
        }

        string hashedPassword = passwordHasher.GenerateHash(request.Password);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            Password = hashedPassword
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return user.Id;
    }
}
