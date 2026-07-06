using FPAMS.Application.Common;
using FPAMS.Persistence.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        var response =
            ApiResponseFactory.Success(
                new
                {
                    Status = "Running",
                    Application = "FPAMS",
                    Version = "1.0.0",
                    Time = DateTime.Now
                },
                "Application is running successfully.");

        return Ok(response);
    }

    [HttpGet("database")]
    public async Task<IActionResult> Database()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();

            if (!canConnect)
            {
                return StatusCode(
                    StatusCodes.Status503ServiceUnavailable,
                    ApiResponseFactory.Failure<object>("Database is not reachable."));
            }

            var pendingMigrations = await _context.Database.GetPendingMigrationsAsync();

            return Ok(
                ApiResponseFactory.Success(
                    new
                    {
                        Status = "Connected",
                        PendingMigrations = pendingMigrations.ToList(),
                        Time = DateTime.Now
                    },
                    "Database connection is healthy."));
        }
        catch (Exception ex)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                ApiResponseFactory.Failure<object>(
                    "Database health check failed.",
                    ex.Message));
        }
    }
}
