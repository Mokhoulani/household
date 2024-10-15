using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ProfilesController : ControllerBase
{
    private readonly IEfRepository<Profile> _profileRepository;

    public ProfilesController(IEfRepository<Profile> profileRepository)
    {
        _profileRepository = profileRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Profile>>> GetProfiles()
    {
        var profiles = await _profileRepository.GetAllAsync();
        return Ok(profiles);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Profile>> GetProfile(int id)
    {
        var profile = await _profileRepository.GetByIdAsync(id);
        if (profile == null)
        {
            return NotFound();
        }
        return Ok(profile);
    }

    [HttpPost]
    public async Task<ActionResult> CreateProfile([FromBody] Profile profile)
    {
        await _profileRepository.AddAsync(profile);
        await _profileRepository.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProfile), new { id = profile.Id }, profile);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateProfile(int id, [FromBody] Profile profile)
    {
        if (id != profile.Id)
        {
            return BadRequest();
        }

        await _profileRepository.UpdateAsync(profile);
        await _profileRepository.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProfile(int id)
    {
        var profile = await _profileRepository.GetByIdAsync(id);
        if (profile == null)
        {
            return NotFound();
        }

        await _profileRepository.DeleteAsync(profile);
        await _profileRepository.SaveChangesAsync();
        return NoContent();
    }
}
