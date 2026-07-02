using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.User;

public class CreateUserRequest
{
    [Required]
    public string EmployeeCode { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Mobile { get; set; } = string.Empty;

    [Required]
    public Guid DepartmentId { get; set; }

    [Required]
    public Guid DesignationId { get; set; }

    [Required]
    public Guid RoleId { get; set; }

    [Required]
    public string Password { get; set; } = string.Empty;
}