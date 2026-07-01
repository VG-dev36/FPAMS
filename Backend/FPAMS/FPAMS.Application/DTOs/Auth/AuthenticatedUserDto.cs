namespace FPAMS.Application.DTOs.Auth;

public sealed class AuthenticatedUserDto
{
    public Guid UserId { get; init; }

    public string EmployeeCode { get; init; } = string.Empty;

    public string FullName { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string Role { get; init; } = string.Empty;

    public Guid? DepartmentId { get; init; }

    public bool IsActive { get; init; }
}