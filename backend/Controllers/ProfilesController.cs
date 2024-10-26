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
public class ProfilesController : ControllerBase
{
    private readonly IEfRepository<Profile> _profileRepository;
    private readonly ILogger<ProfilesController> _logger;

    public ProfilesController(IEfRepository<Profile> profileRepository, ILogger<ProfilesController> logger)
    {
        _profileRepository = profileRepository;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfiles()
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<Profile>> { Message = "User is not authenticated." });
            }

            var query = await _profileRepository.QueryAsync();
            var profiles = await query
            .Include(p => p.Household)
            .Where(p => p.AccountId == userId)

            .ToListAsync();

            if (!profiles.Any())
            {
                return NotFound(new ApiResponse<IEnumerable<Profile>> { Message = "No profiles found for the current user." });
            }

            return Ok(new ApiResponse<IEnumerable<Profile>> { Data = profiles, Message = "Profiles retrieved successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving profiles");
            return StatusCode(500, new ApiResponse<IEnumerable<Profile>> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpGet("{householdId}")]
    public async Task<IActionResult> GetProfilesByHouseholdId(int householdId)
    {
        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<IEnumerable<Profile>>
                {
                    Message = "User is not authenticated."
                });
            }

            var query = await _profileRepository.QueryAsync();
            var profiles = await query
                .Where(p => p.HouseholdId == householdId)
                .ToListAsync();

            if (!profiles.Any())
            {
                return NotFound(new ApiResponse<IEnumerable<Profile>>
                {
                    Message = "No profiles found for the specified household and user."
                });
            }

            return Ok(new ApiResponse<IEnumerable<Profile>>
            {
                Data = profiles,
                Message = "Profiles retrieved successfully."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving profiles by household ID");
            return StatusCode(500, new ApiResponse<IEnumerable<Profile>>
            {
                Message = "An error occurred while processing your request."
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] Profile profile)
    {
        try
        {
            // Extract user ID from the token claims
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<Profile> { Message = "User is not authenticated." });
            }

            // Check if the incoming model is valid based on data annotations in Profile class
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<Profile>
                {
                    Message = "Invalid profile data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            // Set the AccountId to the current authenticated user
            profile.AccountId = userId;
            // Add the profile to the repository and save changes
            await _profileRepository.AddAsync(profile);
            await _profileRepository.SaveChangesAsync();

            // Log profile creation
            _logger.LogInformation($"Profile created for user {userId}");

            // Return a 201 Created response with the newly created profile
            return CreatedAtAction(nameof(GetProfiles), new { id = profile.Id }, new ApiResponse<Profile>
            {
                Data = profile,
                Message = "Profile created successfully"
            });
        }
        catch (DbUpdateException dbEx)
        {
            _logger.LogError(dbEx, "Database error while creating profile");
            return StatusCode(500, new ApiResponse<Profile> { Message = "Database error occurred while processing your request." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while creating profile");
            return StatusCode(500, new ApiResponse<Profile> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromBody] Profile profile)
    {
        try
        {
            if (id != profile.Id)
            {
                return BadRequest(new ApiResponse<Profile> { Message = "Profile ID mismatch." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId) || profile.AccountId != userId)
            {
                return Unauthorized(new ApiResponse<Profile> { Message = "You are not authorized to update this profile." });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<Profile>
                {
                    Message = "Invalid profile data",
                    Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList()
                });
            }

            await _profileRepository.UpdateAsync(profile);
            await _profileRepository.SaveChangesAsync();

            _logger.LogInformation($"Profile updated for user {userId}");

            return Ok(new ApiResponse<Profile> { Data = profile, Message = "Profile updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while updating profile");
            return StatusCode(500, new ApiResponse<Profile> { Message = "An error occurred while processing your request." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(id);
            if (profile == null)
            {
                return NotFound(new ApiResponse<object> { Message = "Profile not found." });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId) || profile.AccountId != userId)
            {
                return Unauthorized(new ApiResponse<object> { Message = "You are not authorized to delete this profile." });
            }

            await _profileRepository.DeleteAsync(profile);
            await _profileRepository.SaveChangesAsync();

            _logger.LogInformation($"Profile deleted for user {userId}");

            return Ok(new ApiResponse<object> { Message = "Profile deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while deleting profile");
            return StatusCode(500, new ApiResponse<object> { Message = "An error occurred while processing your request." });
        }
    }

    private string GetUserIdFromClaims()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    }
}

