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


public class HouseholdTaskDTO
{
    public int Id { get; set; }

    public int HouseholdId { get; set; }

    public HouseholdDTO Household { get; set; }

    public int? Interval { get; set; }

    public bool? IsArchived { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public int? Difficulty { get; set; }

    public ICollection<CompletedTaskDTO> CompletedTasks { get; set; }
}

public class ProfileDTO
{
    public int Id { get; set; }
    public int AvatarId { get; set; }
}

public class HouseHoldTaskDTO
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public int? Difficulty { get; set; }
}

public class HouseholdDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? Code { get; set; }


    public ICollection<ProfileDTO> Profiles { get; set; }
    public ICollection<HouseholdTaskDTO> Tasks { get; set; }
}