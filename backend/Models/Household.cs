
public class Household
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public ICollection<Profile> Profiles { get; set; }
    public ICollection<Tasks> Tasks { get; set; }
}