using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CompleteTask
{
    public int Id { get; set; }

    [Required]
    public DateTime CompletedAt { get; set; }

    [Required]
    [ForeignKey("Profile")]
    public int ProfileId { get; set; }
    public Profile? Profile { get; set; }

    [Required]
    [ForeignKey("HouseholdTask")]
    public int HouseholdTaskId { get; set; }
    public HouseholdTask? HouseholdTask { get; set; }

    [StringLength(500, ErrorMessage = "Comment cannot exceed 500 characters.")]
    public string? Comment { get; set; }

    [Required]
    [ForeignKey("Household")]
    public int HouseholdId { get; set; }
    public Household? Household { get; set; }
}