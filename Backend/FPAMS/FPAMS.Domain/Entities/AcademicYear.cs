using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class AcademicYear : BaseEntity
{
    public string YearName { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsActive { get; set; } = true;
}