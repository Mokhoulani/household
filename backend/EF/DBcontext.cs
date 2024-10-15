using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : IdentityDbContext<Account>
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<Household> Households { get; set; }
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Tasks> Tasks { get; set; }
    public DbSet<CompleteTask> CompleteTasks { get; set; }
}
