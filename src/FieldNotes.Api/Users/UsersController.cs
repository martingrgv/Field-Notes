using FieldNotes.Api.Common;
using FieldNotes.Api.Users.Requests;
using Microsoft.AspNetCore.Mvc;

namespace FieldNotes.Api.Users;

public class UsersController(IUserService userService) : ApiControllerBase
{
    private const int UsernameMinLength = 3;
    private const int UsernameMaxLength = 20;
    private const int EmailMinLength = 3;
    private const int EmailMaxLength = 255;
    private const int PasswordMinLength = 6;
    private const int PasswordMaxLength = 20;

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
    {
        ValidateCredentailRequest(request);

        var userId = await userService.RegisterAsync(request);
        return CreatedAtAction(nameof(Register), new { id = userId });
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
    {
        ValidateCredentailRequest(request);

        string token = await userService.LoginAsync(request);
        return Ok(token);
    }

    private static void ValidateCredentailRequest(UserCredentialRequest request)
    {
        if (request is UserRegisterRequest registerRequest)
        {
            if (string.IsNullOrEmpty(registerRequest.Email) ||
                registerRequest.Email.Length < EmailMinLength ||
                registerRequest.Email.Length > EmailMaxLength)
                throw new ArgumentException($"Email must be valid!");
        }

        if (string.IsNullOrEmpty(request.Username) ||
            request.Username.Length < UsernameMinLength ||
            request.Username.Length > UsernameMaxLength)
            throw new ArgumentException($"Username must be between {UsernameMinLength} and {UsernameMaxLength} characters long!");


        if (string.IsNullOrEmpty(request.Password) ||
            request.Password.Length < PasswordMinLength ||
            request.Password.Length > PasswordMaxLength)
            throw new ArgumentException($"Password must be between {PasswordMinLength} and {PasswordMaxLength} characters long!");
    }
}
