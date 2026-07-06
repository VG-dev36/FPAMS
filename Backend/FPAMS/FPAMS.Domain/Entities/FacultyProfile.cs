using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class FacultyProfile : BaseEntity
{
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    public Guid DepartmentId { get; set; }

    public Department Department { get; set; } = null!;

    public Guid DesignationId { get; set; }

    public Designation Designation { get; set; } = null!;

    public DateTime DateOfJoining { get; set; }

    public string HighestQualification { get; set; } = string.Empty;

    public string Specialization { get; set; } = string.Empty;

    public int TeachingExperienceYears { get; set; }

    public int IndustryExperienceYears { get; set; }

    public bool IsActive { get; set; } = true;
}
