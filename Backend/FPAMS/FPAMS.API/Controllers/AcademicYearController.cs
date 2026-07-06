using FPAMS.Application.DTOs.AcademicYear;
using FPAMS.Application.Interfaces;
using FPAMS.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperAdmin)]
public class AcademicYearController : ControllerBase
{
    private readonly IAcademicYearService _service;

    public AcademicYearController(IAcademicYearService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var result = await _service.GetByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAcademicYearRequest request)
    {
        var result = await _service.CreateAsync(request);

        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateAcademicYearRequest request)
    {
        var result = await _service.UpdateAsync(request);

        if (result == null)
            return NotFound();

        return Ok(result);
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
