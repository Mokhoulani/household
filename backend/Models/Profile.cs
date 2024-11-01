using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


public class Profile
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public string Name { get; set; }

    public bool IsOwner { get; set; }
    public bool IsRequest { get; set; }
    public int AvatarId { get; set; }

    public int HouseholdId { get; set; } // Foreign key to Household
    public string? AccountId { get; set; } // Foreign key to Account

    // Navigation properties
    [ForeignKey("HouseholdId")]

    [JsonIgnore]
    public Household? Household { get; set; } // Navigation to Household

    [ForeignKey("AccountId")]
    public Account? Account { get; set; } // Navigation to Account
}
