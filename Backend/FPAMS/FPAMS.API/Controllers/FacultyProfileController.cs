using FPAMS.Application.DTOs.FacultyProfile;
using FPAMS.Application.Interfaces;
using FPAMS.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperAdmin + "," + Roles.Principal + "," + Roles.HOD)]
public class FacultyProfileController : ControllerBase
{
    private readonly IFacultyProfileService _service;

    public FacultyProfileController(IFacultyProfileService service)
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
    public async Task<IActionResult> Create(CreateFacultyProfileRequest request)
    {
        var result = await _service.CreateAsync(request);

        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateFacultyProfileRequest request)
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
