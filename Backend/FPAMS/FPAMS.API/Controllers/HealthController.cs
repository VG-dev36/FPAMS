using FPAMS.Application.Common;
using Microsoft.AspNetCore.Mvc;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
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
}