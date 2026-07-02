using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.Department;

public class UpdateDepartmentRequest
{
    [Required]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string DepartmentCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DepartmentName { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}