using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public Guid? ReferenceId { get; set; }

    public bool IsRead { get; set; }
}
