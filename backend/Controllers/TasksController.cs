using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class TasksController : ControllerBase
{
    private readonly IEfRepository<Tasks> _tasksRepository;

    public TasksController(IEfRepository<Tasks> tasksRepository)
    {
        _tasksRepository = tasksRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Tasks>>> GetTasks()
    {
        var tasks = await _tasksRepository.GetAllAsync();
        return Ok(tasks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Tasks>> GetTask(int id)
    {
        var task = await _tasksRepository.GetByIdAsync(id);
        if (task == null)
        {
            return NotFound();
        }
        return Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult> CreateTask([FromBody] Tasks task)
    {
        await _tasksRepository.AddAsync(task);
        await _tasksRepository.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(int id, [FromBody] Tasks task)
    {
        if (id != task.Id)
        {
            return BadRequest();
        }

        await _tasksRepository.UpdateAsync(task);
        await _tasksRepository.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        var task = await _tasksRepository.GetByIdAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        await _tasksRepository.DeleteAsync(task);
        await _tasksRepository.SaveChangesAsync();
        return NoContent();
    }
}
