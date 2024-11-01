using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
public class HouseholdTask
{
    public int Id { get; set; }

    [Required]
    [ForeignKey("Household")]
    public int HouseholdId { get; set; }

    [JsonIgnore]
    public Household? Household { get; set; }

    [Required]
    public int? Interval { get; set; }

    public bool? IsArchived { get; set; }

    [Required]
    [StringLength(100, ErrorMessage = "Title cannot exceed 100 characters.")]
    public string? Title { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }

    [Range(1, 5, ErrorMessage = "Difficulty must be between 1 and 5.")]
    public int? Difficulty { get; set; }

    public ICollection<CompleteTask> CompletedTasks { get; set; } = new List<CompleteTask>();
}