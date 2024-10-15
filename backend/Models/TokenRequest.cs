public class TokenRequest
{
    public string UserId { get; set; } // Pass the UserId along with the refresh token
    public string RefreshToken { get; set; }
}