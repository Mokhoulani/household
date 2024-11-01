using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class HouseholdTasksController : ControllerBase
{
    private readonly IEfRepository<HouseholdTask> _householdTaskRepository;
    private readonly IEfRepository<Household> _householdRepository;
    private readonly ILogger<HouseholdTasksController> _logger;

    public HouseholdTasksController(
        IEfRepository<HouseholdTask> householdTaskRepository,
        IEfRepository<Household> householdRepository,
        ILogger<HouseholdTasksController> logger)
    {
        _householdTaskRepository = householdTaskRepository;
        _householdRepository = householdRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetHouseholdTasks()
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<HouseholdTask>> { Message = "User is not authenticated." });
            }

            var query = await _householdTaskRepository.QueryAsync();
            var householdTasks = await query
                .Include(t => t.Household)
                .Include(t => t.CompletedTasks)
                .Where(t => t.Household.Profiles.Any(p => p.AccountId == userId))
                .ToListAsync();

            var householdTasksDTO = householdTasks.Select(task => new HouseholdTaskDTO
            {
                Id = task.Id,
                HouseholdId = task.HouseholdId,
                Household = new HouseholdDTO
                {
                    Id = task.HouseholdId,
                    Name = task.Household.Name,
                    Code = task.Household.Code
                },
                Interval = task.Interval,
                IsArchived = task.IsArchived,
                Title = task.Title,
                Difficulty = task.Difficulty,
                Description = task.Description,
            }).ToList();
            
            return Ok(new ApiResponse<IEnumerable<HouseholdTaskDTO>>
            {
                Data = householdTasksDTO,
                Message = householdTasks.Any()
                    ? "House tasks retrieved successfully."
                    : "No house tasks found for the current user."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving house tasks");
            return StatusCode(500, new ApiResponse<IEnumerable<HouseholdTask>> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateHouseholdTask([FromBody] HouseholdTask householdTask)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<HouseholdTask>
                {
                    Message = "User is not authenticated."
                });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<HouseholdTask>
                {
                    Message = "Invalid house task data",
                    Errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList()
                });
            }

            // Validate household exists
            var household = await (await _householdRepository.QueryAsync())
                .FirstOrDefaultAsync(h => h.Id == householdTask.HouseholdId);

            if (household == null)
            {
                return BadRequest(new ApiResponse<HouseholdTask>
                {
                    Message = "Specified household does not exist."
                });
            }

            // Check user's membership in the household
            if (!await UserBelongsToHouseholdAsync(userId, householdTask.HouseholdId))
            {
                return Unauthorized(new ApiResponse<HouseholdTask>
                {
                    Message = "User is not part of the specified household."
                });
            }


            // Add and save the task
            await _householdTaskRepository.AddAsync(householdTask);
            await _householdTaskRepository.SaveChangesAsync();

            _logger.LogInformation($"House task created for user {userId} in household {householdTask.HouseholdId}");

            // Return created response with the new task
            return CreatedAtAction(
                nameof(GetHouseholdTasks),
                new { id = householdTask.Id },
                new ApiResponse<HouseholdTask>
                {
                    Data = householdTask,
                    Message = "House task created successfully"
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating house task");
            return StatusCode(500, new ApiResponse<HouseholdTask>
            {
                Message = "An error occurred while processing your request."
            });
        }
    }


    private async Task<bool> UserBelongsToHouseholdAsync(string userId, int householdId)
    {
        if (string.IsNullOrEmpty(userId))
            throw new ArgumentException("User ID cannot be null or empty", nameof(userId));

        if (householdId <= 0)
            throw new ArgumentException("Household ID must be positive", nameof(householdId));

        var query = await _householdRepository.QueryAsync();
        return await query
            .Where(h => h.Id == householdId)
            .AnyAsync(h => h.Profiles.Any(p => p.AccountId == userId));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHouseTask(int id, [FromBody] HouseholdTask houseTask)
    {
        try
        {
            if (id != houseTask.Id)
            {
                return BadRequest(new ApiResponse<HouseholdTask> { Message = "House task ID mismatch." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<HouseholdTask> { Message = "User is not authenticated." });
            }

            if (!await UserBelongsToHouseholdAsync(userId, houseTask.HouseholdId))
            {
                return Unauthorized(new ApiResponse<HouseholdTask> { Message = "You are not authorized to update this house task." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<HouseholdTask>
                {
                    Message = "Invalid house task data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            await _householdTaskRepository.UpdateAsync(houseTask);
            await _householdTaskRepository.SaveChangesAsync();

            _logger.LogInformation($"House task updated for user {userId}");

            return Ok(new ApiResponse<HouseholdTask> { Data = houseTask, Message = "House task updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating house task");
            return StatusCode(500, new ApiResponse<HouseholdTask> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHouseTask(int id)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<object> { Message = "User is not authenticated." });
            }

            var query = await _householdTaskRepository.QueryAsync();
            var houseTask = await query
                .Include(ht => ht.Household)
                .ThenInclude(h => h.Profiles)
                .FirstOrDefaultAsync(ht => ht.Id == id);

            if (houseTask == null)
            {
                return NotFound(new ApiResponse<object> { Message = "House task not found." });
            }

            if (!await UserBelongsToHouseholdAsync(userId, houseTask.HouseholdId))
            {
                return Unauthorized(new ApiResponse<object> { Message = "You are not authorized to delete this house task." });
            }

            await _householdTaskRepository.DeleteAsync(houseTask);
            await _householdTaskRepository.SaveChangesAsync();

            _logger.LogInformation($"House task deleted for user {userId}");

            return Ok(new ApiResponse<object> { Message = "House task deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting house task");
            return StatusCode(500, new ApiResponse<object> { Message = "An error occurred while processing your request." });
        }
    }

    private string GetUserIdFromClaims()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    }
}

