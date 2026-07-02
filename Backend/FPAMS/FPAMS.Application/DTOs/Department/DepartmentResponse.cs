namespace FPAMS.Application.DTOs.Department;

public class DepartmentResponse
{
    public Guid Id { get; set; }

    public string DepartmentCode { get; set; } = string.Empty;

    public string DepartmentName { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}