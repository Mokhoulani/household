using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CompleteTasksController : ControllerBase
{
    private readonly IEfRepository<CompleteTask> _completeTaskRepository;
    private readonly IEfRepository<HouseholdTask> _householdTaskRepository;
    private readonly ILogger<CompleteTasksController> _logger;

    public CompleteTasksController(
        IEfRepository<CompleteTask> completeTaskRepository,
        IEfRepository<HouseholdTask> householdTaskRepository,   
        ILogger<CompleteTasksController> logger)
    {
        _completeTaskRepository = completeTaskRepository;
        _householdTaskRepository = householdTaskRepository;
        _logger = logger;
    }

        [HttpGet("by-household/{householdId}")] 
        public async Task<IActionResult> GetCompletedTasksByHouseholdID(int householdId)
        {
            try{ 
                var userId = GetUserIdFromClaims();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new ApiResponse<IEnumerable<CompleteTask>> { Message = "User is not authenticated." });
                }
                var query = await _completeTaskRepository.QueryAsync();
                var completedTasks = await query
                .Include(ct => ct.HouseholdTask)
                .Include(ct => ct.Profile)
                .Where(ct => ct.HouseholdId == householdId) 
                .ToListAsync();

                if (!completedTasks.Any())
                {
                    return NotFound(new ApiResponse<IEnumerable<CompleteTask>> { Message = "No completed tasks found for the current household." });
                }

                var completedTasksDTO = completedTasks.Select(task => new CompletedTaskDTO
                {
                    Id = task.Id,
                    CompletedAt = task.CompletedAt,
                    Comment = task.Comment,
                    ProfileId = task.ProfileId,
                    Profile = new ProfileDTO
                    {
                        Id = task.ProfileId,
                        AvatarId = task.Profile.AvatarId
                    },
                    HouseholdTaskId = task.HouseholdTaskId,
                    HouseholdTask = new HouseholdTaskDTO
                    {
                        Id = task.HouseholdTaskId,
                        Title = task.HouseholdTask.Title,
                        Difficulty = task.HouseholdTask.Difficulty 
                    }
                }).ToList();

                return Ok(new ApiResponse<IEnumerable<CompletedTaskDTO>> { Data = completedTasksDTO, Message = "Completed tasks retrieved successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving completed tasks");
                return StatusCode(500, new ApiResponse<IEnumerable<CompleteTask>> { Message = "An error occurred while processing your request." });
            }
        }

    [HttpGet]
    public async Task<IActionResult> GetCompletedTasks()
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<CompleteTask>> { Message = "User is not authenticated." });
            }

            var query = await _completeTaskRepository.QueryAsync();
            var completedTasks = await query
            .Include(t => t.Profile)
            .Where(t => t.Profile.AccountId == userId)
            .Include(t => t.HouseholdTask)
            .ToListAsync();

            if (!completedTasks.Any())
            {
                return NotFound(new ApiResponse<IEnumerable<CompleteTask>> { Message = "No completed tasks found for the current user." });
            }

            return Ok(new ApiResponse<IEnumerable<CompleteTask>> { Data = completedTasks, Message = "Completed tasks retrieved successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving completed tasks");
            return StatusCode(500, new ApiResponse<IEnumerable<CompleteTask>> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateCompletedTask([FromBody] CompleteTask completedTask)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<CompleteTask> { Message = "User is not authenticated." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<CompleteTask>
                {
                    Message = "Invalid completed task data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            var houseTask = await _householdTaskRepository.GetByIdAsync(completedTask.HouseholdTaskId);
            if (houseTask == null)
            {
                return NotFound(new ApiResponse<CompleteTask> { Message = "House task not found." });
            }

            // Ensure the task belongs to the same household
            if (houseTask.HouseholdId != completedTask.Profile.HouseholdId)
            {
                return BadRequest(new ApiResponse<CompleteTask> { Message = "House task and household do not match." });
            }

            completedTask.CompletedAt = DateTime.UtcNow;

            await _completeTaskRepository.AddAsync(completedTask);
            await _completeTaskRepository.SaveChangesAsync();

            _logger.LogInformation($"Completed task created for user {userId}");

            return CreatedAtAction(nameof(GetCompletedTasks), new { id = completedTask.Id }, new ApiResponse<CompleteTask> { Data = completedTask, Message = "Completed task created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating completed task");
            return StatusCode(500, new ApiResponse<CompleteTask> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCompletedTask(int id, [FromBody] CompleteTask completedTask)
    {
        try
        {
            if (id != completedTask.Id)
            {
                return BadRequest(new ApiResponse<CompleteTask> { Message = "Completed Task ID mismatch." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId) || completedTask.Profile.AccountId != userId)
            {
                return Unauthorized(new ApiResponse<CompleteTask> { Message = "You are not authorized to update this completed task." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<CompleteTask>
                {
                    Message = "Invalid completed task data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            await _completeTaskRepository.UpdateAsync(completedTask);
            await _completeTaskRepository.SaveChangesAsync();

            _logger.LogInformation($"Completed task updated for user {userId}");

            return Ok(new ApiResponse<CompleteTask> { Data = completedTask, Message = "Completed task updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating completed task");
            return StatusCode(500, new ApiResponse<CompleteTask> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompletedTask(int id)
    {
        try
        {
            var completedTask = await _completeTaskRepository.GetByIdAsync(id);
            if (completedTask == null)
            {
                return NotFound(new ApiResponse<object> { Message = "Completed task not found." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId) || completedTask.Profile.AccountId != userId)
            {
                return Unauthorized(new ApiResponse<object> { Message = "You are not authorized to delete this completed task." });
            }

            await _completeTaskRepository.DeleteAsync(completedTask);
            await _completeTaskRepository.SaveChangesAsync();

            _logger.LogInformation($"Completed task deleted for user {userId}");

            return Ok(new ApiResponse<object> { Message = "Completed task deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting completed task");
            return StatusCode(500, new ApiResponse<object> { Message = "An error occurred while processing your request." });
        }
    }

    private string GetUserIdFromClaims()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    }
}


