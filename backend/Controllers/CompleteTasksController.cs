using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class CompleteTasksController : ControllerBase
{
    private readonly IEfRepository<CompleteTask> _completeTaskRepository;

    public CompleteTasksController(IEfRepository<CompleteTask> completeTaskRepository)
    {
        _completeTaskRepository = completeTaskRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CompleteTask>>> GetCompleteTasks()
    {
        var completeTasks = await _completeTaskRepository.GetAllAsync();
        return Ok(completeTasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CompleteTask>> GetCompleteTask(int id)
    {
        var completeTask = await _completeTaskRepository.GetByIdAsync(id);
        if (completeTask == null)
        {
            return NotFound();
        }
        return Ok(completeTask);
    }

    [HttpPost]
    public async Task<ActionResult> CreateCompleteTask([FromBody] CompleteTask completeTask)
    {
        await _completeTaskRepository.AddAsync(completeTask);
        await _completeTaskRepository.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCompleteTask), new { id = completeTask.Id }, completeTask);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateCompleteTask(int id, [FromBody] CompleteTask completeTask)
    {
        if (id != completeTask.Id)
        {
            return BadRequest();
        }

        await _completeTaskRepository.UpdateAsync(completeTask);
        await _completeTaskRepository.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteCompleteTask(int id)
    {
        var completeTask = await _completeTaskRepository.GetByIdAsync(id);
        if (completeTask == null)
        {
            return NotFound();
        }

        await _completeTaskRepository.DeleteAsync(completeTask);
        await _completeTaskRepository.SaveChangesAsync();
        return NoContent();
    }
}
