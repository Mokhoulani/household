using Microsoft.AspNetCore.Identity;



public class Account : IdentityUser
{
    // The ID property is inherited from IdentityUser
    // public int ID { get; set; } // REMOVE THIS LINE

    public string Name { get; set; } // Keep the Name property
    // public string Password { get; set; } // REMOVE THIS LINE
    // Use PasswordHash from IdentityUser to store hashed passwords
 

    public ICollection<Profile> Profiles { get; set; }
}
