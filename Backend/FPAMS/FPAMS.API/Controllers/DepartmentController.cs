using FPAMS.Application.DTOs.Department;
using FPAMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentController : ControllerBase
{
    private readonly IDepartmentService _service;

    public DepartmentController(IDepartmentService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var department = await _service.GetByIdAsync(id);

        if (department == null)
            return NotFound();

        return Ok(department);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDepartmentRequest request)
    {
        var department = await _service.CreateAsync(request);

        return CreatedAtAction(
            nameof(Get),
            new { id = department.Id },
            department);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateDepartmentRequest request)
    {
        var department = await _service.UpdateAsync(request);

        if (department == null)
            return NotFound();

        return Ok(department);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}