using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Shared.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.SuperAdmin + "," + Roles.Faculty + "," + Roles.HOD + "," + Roles.Principal + "," + Roles.APEC)]
public class EvidenceAttachmentController : ControllerBase
{
    private readonly IEvidenceAttachmentService _service;
    private readonly IWebHostEnvironment _environment;

    public EvidenceAttachmentController(
        IEvidenceAttachmentService service,
        IWebHostEnvironment environment)
    {
        _service = service;
        _environment = environment;
    }

    [HttpGet("appraisal/{appraisalFormId:guid}")]
    public async Task<IActionResult> GetByAppraisal(Guid appraisalFormId)
    {
        return Ok(await _service.GetByAppraisalFormAsync(appraisalFormId));
    }

    [HttpPost("appraisal/{appraisalFormId:guid}")]
    [RequestSizeLimit(25_000_000)]
    public async Task<IActionResult> Upload(
        Guid appraisalFormId,
        IFormFile file,
        [FromForm] string description = "")
    {
        if (file.Length == 0)
            return BadRequest("File is required.");

        var uploadDirectory = GetUploadDirectory();
        Directory.CreateDirectory(uploadDirectory);

        var extension = Path.GetExtension(file.FileName);
        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var storedPath = Path.Combine(uploadDirectory, storedFileName);

        await using (var stream = System.IO.File.Create(storedPath))
        {
            await file.CopyToAsync(stream);
        }

        var result = await _service.CreateAsync(
            appraisalFormId,
            Path.GetFileName(file.FileName),
            storedFileName,
            file.ContentType,
            file.Length,
            description);

        return Ok(result);
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> Download(Guid id)
    {
        var attachment = await _service.GetStorageAsync(id);

        if (attachment == null)
            return NotFound();

        var storedPath = Path.Combine(GetUploadDirectory(), attachment.StoredFileName);

        if (!System.IO.File.Exists(storedPath))
            return NotFound();

        var stream = System.IO.File.OpenRead(storedPath);

        return File(stream, attachment.ContentType, attachment.FileName);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var attachment = await _service.GetStorageAsync(id);

        if (attachment == null)
            return NotFound();

        var storedPath = Path.Combine(GetUploadDirectory(), attachment.StoredFileName);
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound();

        if (System.IO.File.Exists(storedPath))
            System.IO.File.Delete(storedPath);

        return NoContent();
    }

    private string GetUploadDirectory()
    {
        return Path.Combine(_environment.ContentRootPath, "App_Data", "Evidence");
    }
}
