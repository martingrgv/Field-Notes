using System.Security.Claims;
using System.Text;
using FieldNotes.Api.Data.Persistence.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace FieldNotes.Api.Data.Services;

public class TokenProvider(IConfiguration configuration)
{
    public string CreateToken(User user)
    {
        string secretKey = configuration["Jwt:Secret"]!;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("username", user.Username.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email.ToString()),
            ]),
            Expires = DateTime.UtcNow.AddDays(configuration.GetValue<int>("Jwt:ExpirationInDays")),
            SigningCredentials = credentials,
            Issuer = configuration["Jwt:Issuer"],
            IssuedAt = DateTime.UtcNow,
            Audience = configuration["Jwt:Audience"],
        };

        var handler = new JsonWebTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);

        return token;
    }
}
