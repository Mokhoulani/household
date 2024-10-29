public class CompletedTaskDTO
{
    public int Id { get; set; }
    public DateTime CompletedAt { get; set; }
    public string? Comment { get; set; }
    public int ProfileId { get; set; }
  public ProfileDTO Profile { get; set; } 
    public int HouseholdTaskId { get; set; }
    public HouseHoldTaskDTO HouseholdTask { get; set; }
}

public class ProfileDTO {
    public int Id { get; set; }
    public int AvatarId { get; set; }
}

public class HouseHoldTaskDTO{
    public int Id { get; set; }
    public string? Title { get; set; }
    public int? Difficulty { get; set; }
}