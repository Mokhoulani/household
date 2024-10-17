
using System.ComponentModel.DataAnnotations;
public class RegisterRequest
{
    [Required] // Requires that the email is provided
    [EmailAddress] // Ensures the email format is valid
    public string Email { get; set; }

    [Required] // Requires that the password is provided
    [DataType(DataType.Password)] // Indicates it's a password
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; }

    [Required] // Requires that the full name is provided
    public string FullName { get; set; }
}
