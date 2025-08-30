using FieldNotes.Api.Data.Persistence.Models;
using Microsoft.AspNetCore.Mvc;

namespace FieldNotes.Api.Users;

[ApiController]
[Route("api/v1/users")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost]
    [Route("register")]
    public IActionResult Register([FromBody] UserCredentialViewModel userViewModel)
    {
        var user = userService.Register(userViewModel);
        return CreatedAtAction(nameof(Register), new { id = user.Id });
    }

    [HttpPost]
    [Route("login")]
    public IActionResult Login([FromBody] UserCredentialViewModel userViewModel) //TODO: Change to user view model
    {
        var user = userService.GetUserByUsername(userViewModel.Username!);
        string token = userService.Login(user);
        return Ok(token);
    }
}
