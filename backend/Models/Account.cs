using Microsoft.AspNetCore.Identity;



public class Account : IdentityUser
{
    public string Name { get; set; }
    public ICollection<Profile> Profiles { get; set; }
}
