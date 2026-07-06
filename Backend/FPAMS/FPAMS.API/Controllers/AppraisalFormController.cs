using FPAMS.Application.DTOs.Appraisal;
using FPAMS.Application.Interfaces;
using FPAMS.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperAdmin + "," + Roles.Faculty + "," + Roles.HOD + "," + Roles.Principal + "," + Roles.APEC)]
public class AppraisalFormController : ControllerBase
{
    private readonly IAppraisalFormService _service;

    public AppraisalFormController(IAppraisalFormService service)
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
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.Faculty)]
    public async Task<IActionResult> Create(CreateAppraisalFormRequest request)
    {
        var result = await _service.CreateAsync(request);

        return Ok(result);
    }

    [HttpPut]
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.Faculty)]
    public async Task<IActionResult> Update(UpdateAppraisalFormRequest request)
    {
        var result = await _service.UpdateAsync(request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("{id:guid}/submit")]
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.Faculty)]
    public async Task<IActionResult> Submit(Guid id)
    {
        var result = await _service.SubmitAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("{id:guid}/hod-review")]
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.HOD)]
    public async Task<IActionResult> HodReview(Guid id, ReviewAppraisalRequest request)
    {
        var result = await _service.ReviewAsync(id, "HodReviewed", request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("{id:guid}/principal-review")]
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.Principal)]
    public async Task<IActionResult> PrincipalReview(Guid id, ReviewAppraisalRequest request)
    {
        var result = await _service.ReviewAsync(id, "PrincipalReviewed", request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("{id:guid}/iqac-review")]
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.APEC)]
    public async Task<IActionResult> IqacReview(Guid id, ReviewAppraisalRequest request)
    {
        var result = await _service.ReviewAsync(id, "IqacReviewed", request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost("{id:guid}/return")]
    [Authorize(Roles = Roles.SuperAdmin + "," + Roles.HOD + "," + Roles.Principal + "," + Roles.APEC)]
    public async Task<IActionResult> Return(Guid id, ReviewAppraisalRequest request)
    {
        var result = await _service.ReviewAsync(id, "Returned", request);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = Roles.SuperAdmin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        return NoContent();
    }
}
