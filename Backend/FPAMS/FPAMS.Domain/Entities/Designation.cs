using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class Designation : BaseEntity
{
    public string DesignationCode { get; set; } = string.Empty;

    public string DesignationName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<User> Users { get; set; } = new List<User>();
}