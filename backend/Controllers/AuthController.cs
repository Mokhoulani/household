using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<Account> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(UserManager<Account> userManager, IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            return Unauthorized();
        }

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Store the refresh token in the AspNetUserTokens table
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "refresh_token", refreshToken);

        return Ok(new
        {
            AccessToken = token,
            RefreshToken = refreshToken
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var userExists = await _userManager.FindByEmailAsync(request.Email);
        if (userExists != null)
        {
            return BadRequest("User already exists");
        }

        var user = new Account
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.FullName
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Store the refresh token in the AspNetUserTokens table
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "refresh_token", refreshToken);

        return Ok(new
        {
            AccessToken = token,
            RefreshToken = refreshToken
        });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
    {
        // Validate the refresh token
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            return BadRequest("Invalid user");
        }

        var storedRefreshToken = await _userManager.GetAuthenticationTokenAsync(user, "Default", "refresh_token");

        if (storedRefreshToken != request.RefreshToken)
        {
            return BadRequest("Invalid refresh token");
        }

        // Generate new tokens
        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        // Update the stored refresh token
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "refresh_token", newRefreshToken);

        return Ok(new
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }

    private string GenerateJwtToken(Account user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}





