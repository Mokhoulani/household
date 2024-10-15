using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class HouseholdsController : ControllerBase
{
    private readonly IEfRepository<Household> _householdRepository;

    public HouseholdsController(IEfRepository<Household> householdRepository)
    {
        _householdRepository = householdRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Household>>> GetHouseholds()
    {
        var households = await _householdRepository.GetAllAsync();
        return Ok(households);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Household>> GetHousehold(int id)
    {
        var household = await _householdRepository.GetByIdAsync(id);
        if (household == null)
        {
            return NotFound();
        }
        return Ok(household);
    }

    [HttpPost]
    public async Task<ActionResult> CreateHousehold([FromBody] Household household)
    {
        await _householdRepository.AddAsync(household);
        await _householdRepository.SaveChangesAsync();
        return CreatedAtAction(nameof(GetHousehold), new { id = household.Id }, household);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateHousehold(int id, [FromBody] Household household)
    {
        if (id != household.Id)
        {
            return BadRequest();
        }

        await _householdRepository.UpdateAsync(household);
        await _householdRepository.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteHousehold(int id)
    {
        var household = await _householdRepository.GetByIdAsync(id);
        if (household == null)
        {
            return NotFound();
        }

        await _householdRepository.DeleteAsync(household);
        await _householdRepository.SaveChangesAsync();
        return NoContent();
    }
}
