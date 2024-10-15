public class Tasks
{
    public int Id { get; set; }
    public int HouseholdID { get; set; }
    public Household Household { get; set; }
    public int Interval { get; set; }
    public bool IsArchived { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int Difficulty { get; set; }
    public ICollection<CompleteTask> CompletedTasks { get; set; }
}
