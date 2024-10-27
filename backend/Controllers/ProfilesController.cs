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
    public async Task<ActionResult<ApiResponse<Profile>>> UpdateProfile(int id, [FromBody] Profile profile)
    {
        if (profile == null)
        {
            return BadRequest(new ApiResponse<Profile> { Message = "Profile data is required." });
        }

        if (id != profile.Id)
        {
            return BadRequest(new ApiResponse<Profile> { Message = "Profile ID mismatch." });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<Profile>
            {
                Message = "Invalid profile data",
                Errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList()
            });
        }

        try
        {
            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<Profile>
                {
                    Message = "Authentication required."
                });
            }

            // Get existing profile first
            var existingProfile = await _profileRepository.GetByIdAsync(id);
            if (existingProfile == null)
            {
                return NotFound(new ApiResponse<Profile>
                {
                    Message = "Profile not found."
                });
            }

            // Check authorization with improved household verification
            var authorizationResult = await CheckProfileUpdateAuthorization(userId, existingProfile, profile);
            if (!authorizationResult.IsAuthorized)
            {
                return Unauthorized(new ApiResponse<Profile>
                {
                    Message = authorizationResult.Message
                });
            }

            await UpdateProfileSafely(existingProfile, profile);
            await _profileRepository.SaveChangesAsync();

            _logger.LogInformation("Profile {ProfileId} in household {HouseholdId} updated by user {UserId}",
                id, existingProfile.HouseholdId, userId);

            return Ok(new ApiResponse<Profile>
            {
                Data = existingProfile,
                Message = "Profile updated successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile {ProfileId}", id);
            return StatusCode(500, new ApiResponse<Profile>
            {
                Message = "An error occurred while processing your request."
            });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProfile(int id)
    {
        try
        {
            var profile = await _profileRepository.GetByIdAsync(id);
            if (profile == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Message = "Profile not found."
                });
            }

            var userId = GetUserIdFromClaims();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Message = "Authentication required."
                });
            }

            // Check authorization with household owner permissions
            var authorizationResult = await CheckProfileDeletionAuthorization(userId, profile);
            if (!authorizationResult.IsAuthorized)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Message = authorizationResult.Message
                });
            }

            // Additional validation before deletion
            var validationResult = await ValidateProfileDeletion(profile);
            if (!validationResult.IsValid)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Message = validationResult.Message
                });
            }

            await _profileRepository.DeleteAsync(profile);
            await _profileRepository.SaveChangesAsync();

            _logger.LogInformation("Profile {ProfileId} in household {HouseholdId} deleted by user {UserId}",
                id, profile.HouseholdId, userId);

            return Ok(new ApiResponse<object>
            {
                Message = "Profile deleted successfully"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting profile {ProfileId}", id);
            return StatusCode(500, new ApiResponse<object>
            {
                Message = "An error occurred while processing your request."
            });
        }
    }
    private string GetUserIdFromClaims()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
    }


    private async Task<(bool IsAuthorized, string Message)> CheckProfileUpdateAuthorization(
        string userId, Profile existingProfile, Profile updatedProfile)
    {
        // Get user's profiles including household ownership info
        var query = await _profileRepository.QueryAsync();
        var userProfiles = await query
            .Where(p => p.AccountId == userId)
            .ToListAsync();

        // Check if user is updating their own profile
        if (existingProfile.AccountId == userId)
        {
            // Ensure they're not trying to change the household
            if (existingProfile.HouseholdId != updatedProfile.HouseholdId)
            {
                return (false, "You cannot change the household of your own profile.");
            }
            return (true, string.Empty);
        }

        // Check if user is a household owner for the profile's household
        var isHouseholdOwner = userProfiles
            .Any(p => p.IsOwner && p.HouseholdId == existingProfile.HouseholdId);

        if (!isHouseholdOwner)
        {
            return (false, "You are not authorized to update this profile.");
        }

        // Ensure the profile being updated belongs to the same household
        if (existingProfile.HouseholdId != updatedProfile.HouseholdId)
        {
            return (false, "Cannot change the household of other profiles.");
        }

        return (true, string.Empty);
    }

    private async Task<(bool IsAuthorized, string Message)> CheckProfileDeletionAuthorization(
        string userId, Profile profile)
    {
        var query = await _profileRepository.QueryAsync();
        var userProfiles = await query
            .Where(p => p.AccountId == userId)
            .ToListAsync();

        if (profile.AccountId == userId)
        {
            if (profile.IsOwner)
            {
                var otherOwnersExist = await query
                    .AnyAsync(p => p.HouseholdId == profile.HouseholdId &&
                                  p.IsOwner &&
                                  p.AccountId != userId);

                if (!otherOwnersExist)
                {
                    return (false, "Cannot delete the last owner profile of a household. Transfer ownership first.");
                }
            }
            return (true, string.Empty);
        }

        var isHouseholdOwner = userProfiles
            .Any(p => p.IsOwner && p.HouseholdId == profile.HouseholdId);

        if (!isHouseholdOwner)
        {
            return (false, "You are not authorized to delete this profile.");
        }

        return (true, string.Empty);
    }


    private async Task UpdateProfileSafely(Profile existingProfile, Profile updatedProfile)
    {

        existingProfile.IsRequest = updatedProfile.IsRequest;

        await _profileRepository.UpdateAsync(existingProfile);
    }


    private async Task<(bool IsValid, string Message)> ValidateProfileDeletion(Profile profile)
    {
        var query = await _profileRepository.QueryAsync();
        var isLastProfileInHousehold = !await query
            .AnyAsync(p => p.HouseholdId == profile.HouseholdId &&
                           p.Id != profile.Id);

        if (isLastProfileInHousehold)
        {
            return (false, "Cannot delete the last profile in a household. Delete the household instead.");
        }

        return (true, string.Empty);
    }
}

