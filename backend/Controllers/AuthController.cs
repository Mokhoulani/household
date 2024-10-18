using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<Account> _userManager;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;

    public AuthController(UserManager<Account> userManager, IConfiguration configuration, ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Validate the request model (you may need to add model validation attributes)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Attempt to find the user by email
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
        {
            _logger.LogWarning($"Failed login attempt for email: {request.Email}");
            return Unauthorized("Invalid email or password");
        }

        // Check if the user account is locked out
        if (await _userManager.IsLockedOutAsync(user))
        {
            _logger.LogWarning($"Locked out user attempted to log in: {request.Email}");
            return BadRequest("Account is locked out. Please try again later.");
        }

        // Reset failed access count on successful login
        await _userManager.ResetAccessFailedCountAsync(user);

        // Generate JWT token
        var token = GenerateJwtToken(user);

        // Generate refresh token
        var refreshToken = GenerateRefreshToken();

        // Set the JWT as a secure cookie
        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true, // Prevents JavaScript access
            Secure = true, // Only send cookie over HTTPS
            SameSite = SameSiteMode.Strict, // Adjust based on your app requirements
            Expires = DateTimeOffset.UtcNow.AddHours(1) // Set the cookie expiration
        });

        // Store the new refresh token securely
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "refresh_token", refreshToken);

        // Here, it's returned in the response body for demonstration
        return Ok(new
        {
            AccessToken = token,
            RefreshToken = refreshToken, // Return refresh token (if required)
            Account = new
            {
                user.Id,
                user.Name,
                user.Email,
                // Add any additional fields you want to return
            }
        });
    }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Validate the request model (add validation attributes to RegisterRequest if necessary)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if the user already exists
        var userExists = await _userManager.FindByEmailAsync(request.Email);
        if (userExists != null)
        {
            _logger.LogWarning($"Registration attempt with existing email: {request.Email}");
            return BadRequest("User already exists");
        }

        // Create a new user account
        var user = new Account
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.FullName
        };

        // Attempt to create the user with the provided password
        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            _logger.LogWarning($"Failed registration attempt for email: {request.Email}. Errors: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            return BadRequest(result.Errors.Select(e => e.Description)); // Return a list of error messages
        }

        // Generate JWT token and refresh token
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Set the JWT as a secure cookie
        Response.Cookies.Append("access_token", token, new CookieOptions
        {
            HttpOnly = true, // Prevents JavaScript access
            Secure = true, // Only send cookie over HTTPS
            SameSite = SameSiteMode.Strict, // Adjust based on your app requirements
            Expires = DateTimeOffset.UtcNow.AddHours(1) // Set the cookie expiration
        });

        // Optionally store the refresh token in a secure manner, e.g., database or secure cookie
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "refresh_token", refreshToken);

        _logger.LogInformation($"New user registered: {request.Email}");

        // Return the generated tokens and user information
        return Ok(new
        {
            AccessToken = token,
            RefreshToken = refreshToken,
            Account = new
            {
                user.Id,
                user.Name,
                user.Email,
                // Include any other necessary fields
            }
        });
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] TokenRequest request)
    {
        // Validate the request model (add validation attributes to TokenRequest if necessary)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Find the user by ID
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            _logger.LogWarning($"Refresh token attempt for invalid user ID: {request.UserId}");
            return BadRequest("Invalid user");
        }

        // Retrieve the stored refresh token
        var storedRefreshToken = await _userManager.GetAuthenticationTokenAsync(user, "Default", "refresh_token");

        // Validate the provided refresh token
        if (storedRefreshToken != request.RefreshToken)
        {
            _logger.LogWarning($"Invalid refresh token used for user: {user.Email}");
            return BadRequest("Invalid refresh token");
        }

        // Generate new access and refresh tokens
        var newAccessToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();

        // Set the JWT as a secure cookie
        Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
        {
            HttpOnly = true, // Prevents JavaScript access
            Secure = true, // Only send cookie over HTTPS
            SameSite = SameSiteMode.Strict, // Adjust based on your app requirements
            Expires = DateTimeOffset.UtcNow.AddHours(1) // Set the cookie expiration
        });

        // Store the new refresh token securely
        await _userManager.SetAuthenticationTokenAsync(user, "Default", "refresh_token", newRefreshToken);

        _logger.LogInformation($"Tokens refreshed for user: {user.Email}");

        // Return the new tokens and user ID
        return Ok(new
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            AccountId = user // Changed from "AcountId" to "AccountId" for consistency
        });
    }
    private string GenerateJwtToken(Account user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user), "User cannot be null");
        }

        // Define the claims you want to include in the token
        var claims = new[]
        {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim("userId", user.Id), // Include userId claim
        new Claim("name", user.Name), // Optionally include user's name
        new Claim("email", user.Email), // Optionally include user's email
        // Other claims can be added here as necessary
    };

        // Get the secret key from configuration
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

        // Create signing credentials using the key and algorithm
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Create the token
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30), // Set expiration time
            signingCredentials: creds);

        // Return the generated token as a string
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