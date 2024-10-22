using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class HouseholdsController : ControllerBase
{
    private readonly IEfRepository<Household> _householdRepository;
    private readonly ILogger<HouseholdsController> _logger;

    public HouseholdsController(IEfRepository<Household> householdRepository, ILogger<HouseholdsController> logger)
    {
        _householdRepository = householdRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetHouseholds()
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<Household>> { Message = "User is not authenticated." });
            }

            var households = await _householdRepository.FindAsync(h => h.Profiles.Any(m => m.AccountId == userId));

            if (!households.Any())
            {
                return NotFound(new ApiResponse<IEnumerable<Household>> { Message = "No households found for the current user." });
            }

            return Ok(new ApiResponse<IEnumerable<Household>> { Data = households, Message = "Households retrieved successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving households");
            return StatusCode(500, new ApiResponse<IEnumerable<Household>> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateHousehold([FromBody] Household household)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<Household> { Message = "User is not authenticated." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<Household>
                {
                    Message = "Invalid household data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            // Generate a code if it's required
            if (string.IsNullOrEmpty(household.Code))
            {
                household.Code = GenerateHouseholdCode(); // Implement this method to generate a unique code
            }

            await _householdRepository.AddAsync(household);
            await _householdRepository.SaveChangesAsync();

            _logger.LogInformation($"Household created for user {userId}");

            return CreatedAtAction(nameof(GetHouseholds), new { id = household.Id }, new ApiResponse<Household> { Data = household, Message = "Household created successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating household");
            return StatusCode(500, new ApiResponse<Household> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateHousehold(int id, [FromBody] Household household)
    {
        try
        {
            if (id != household.Id)
            {
                return BadRequest(new ApiResponse<Household> { Message = "Household ID mismatch." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<Household> { Message = "User is not authenticated." });
            }

            var existingHousehold = await _householdRepository.GetByIdAsync(id);
            if (existingHousehold == null)
            {
                return NotFound(new ApiResponse<Household> { Message = "Household not found." });
            }

            if (!existingHousehold.Profiles.Any(m => m.AccountId == userId))
            {
                return Unauthorized(new ApiResponse<Household> { Message = "You are not authorized to update this household." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<Household>
                {
                    Message = "Invalid household data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            // Update only allowed properties
            existingHousehold.Name = household.Name;
            // Add other properties as needed

            await _householdRepository.UpdateAsync(existingHousehold);
            await _householdRepository.SaveChangesAsync();

            _logger.LogInformation($"Household {id} updated for user {userId}");

            return Ok(new ApiResponse<Household> { Data = existingHousehold, Message = "Household updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error occurred while updating household {id}");
            return StatusCode(500, new ApiResponse<Household> { Message = "An error occurred while processing your request." });
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteHousehold(int id)
    {
        try
        {
            var household = await _householdRepository.GetByIdAsync(id);
            if (household == null)
            {
                return NotFound(new ApiResponse<object> { Message = "Household not found." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId) || household.Profiles.Any(m => m.AccountId == userId))
            {
                return Unauthorized(new ApiResponse<object> { Message = "You are not authorized to delete this household." });
            }

            await _householdRepository.DeleteAsync(household);
            await _householdRepository.SaveChangesAsync();

            _logger.LogInformation($"Household deleted for user {userId}");

            return Ok(new ApiResponse<object> { Message = "Household deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting household");
            return StatusCode(500, new ApiResponse<object> { Message = "An error occurred while processing your request." });
        }
    }

    private string GetUserIdFromClaims()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    }

    private string GenerateHouseholdCode()
    {
        return Guid.NewGuid().ToString().Substring(0, 8); // Generates an 8-character unique code
    }

}

