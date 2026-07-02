using FPAMS.Application.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FPAMS.Application.Common;

namespace FPAMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok(
            ApiResponseFactory.Success(
                "Public API Working",
                "Success"));
    }

    [Authorize]
    [HttpGet("private")]
    public IActionResult Private()
    {
        return Ok(
            ApiResponseFactory.Success(
                "JWT Authentication Successful",
                "Authenticated"));
    }
}