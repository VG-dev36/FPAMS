using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.User;

public class UpdateUserRequest
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    public string EmployeeCode { get; set; } = string.Empty;

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Mobile { get; set; } = string.Empty;

    [Required]
    public Guid DepartmentId { get; set; }

    [Required]
    public Guid DesignationId { get; set; }

    [Required]
    public Guid RoleId { get; set; }

    public bool IsActive { get; set; }
}