using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.Department;

public class CreateDepartmentRequest
{
    [Required]
    [MaxLength(20)]
    public string DepartmentCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DepartmentName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}