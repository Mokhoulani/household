public class Household
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Code { get; set; }

    // Initialize collections to avoid validation errors if they're not provided
    public ICollection<Profile> Profiles { get; set; } = new List<Profile>();
    public ICollection<HouseholdTask> Tasks { get; set; } = new List<HouseholdTask>();
}
