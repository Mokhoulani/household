using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Profile
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
    public string Name { get; set; }

    public bool IsOwner { get; set; }
    public bool IsRequest { get; set; }

    public int HouseholdId { get; set; }

    [Required]
    [ForeignKey("Account")]
    public string AccountId { get; set; }

    [ForeignKey("HouseholdId")]
    public Household Household { get; set; }

    public Account Account { get; set; }
}
