public class Profile
{
    public int Id { get; set; } // Primary key
    public string Name { get; set; }
    public bool IsOwner { get; set; }
    public bool IsRequest { get; set; }
    public int HouseholdID { get; set; } // Foreign key for Household

    // Foreign key for Account
    public string AccountId { get; set; } // This should match the foreign key type from `Account`

    // Navigation properties
    public virtual Household Household { get; set; }
    public virtual Account Account { get; set; }
}
