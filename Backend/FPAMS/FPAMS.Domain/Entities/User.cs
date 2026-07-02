using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class User : BaseEntity
{
    public string EmployeeCode { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Mobile { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public Guid RoleId { get; set; }

    public Role Role { get; set; } = null!;

    public Guid? DepartmentId { get; set; }

    public Department? Department { get; set; }

    public Guid? DesignationId { get; set; }

    public Designation? Designation { get; set; }
}