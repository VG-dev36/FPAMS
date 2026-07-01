using System.Security.Claims;
using FPAMS.Application.DTOs.Auth;
using FPAMS.Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace FPAMS.Infrastructure.Authentication;

public sealed class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public AuthenticatedUserDto? User
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;

            if (user == null || !user.Identity?.IsAuthenticated == true)
                return null;

            Guid.TryParse(
                user.FindFirstValue(ClaimTypes.NameIdentifier),
                out Guid userId);

            Guid? departmentId = null;

            var departmentClaim = user.FindFirst("DepartmentId");

            if (departmentClaim != null &&
                Guid.TryParse(departmentClaim.Value, out Guid deptId))
            {
                departmentId = deptId;
            }

            return new AuthenticatedUserDto
            {
                UserId = userId,
                FullName = user.FindFirstValue(ClaimTypes.Name) ?? "",
                Email = user.FindFirstValue(ClaimTypes.Email) ?? "",
                Role = user.FindFirstValue(ClaimTypes.Role) ?? "",
                DepartmentId = departmentId,
                EmployeeCode = user.FindFirstValue("EmployeeCode") ?? "",
                IsActive = true
            };
        }
    }
}