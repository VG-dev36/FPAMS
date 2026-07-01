using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class Department : BaseEntity
{
    public string DepartmentCode { get; set; } = string.Empty;

    public string DepartmentName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public ICollection<User> Users { get; set; } = new List<User>();
}