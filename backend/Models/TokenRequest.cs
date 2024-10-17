using System.ComponentModel.DataAnnotations;
public class TokenRequest
{
    [Required] // Requires that the user ID is provided
    public string UserId { get; set; }

    [Required] // Requires that the refresh token is provided
    public string RefreshToken { get; set; }
}
