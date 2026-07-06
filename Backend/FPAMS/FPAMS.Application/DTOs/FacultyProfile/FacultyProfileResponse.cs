namespace FPAMS.Application.DTOs.FacultyProfile;

public class FacultyProfileResponse
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string EmployeeCode { get; set; } = string.Empty;

    public string FacultyName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public Guid DepartmentId { get; set; }

    public string DepartmentName { get; set; } = string.Empty;

    public Guid DesignationId { get; set; }

    public string DesignationName { get; set; } = string.Empty;

    public DateTime DateOfJoining { get; set; }

    public string HighestQualification { get; set; } = string.Empty;

    public string Specialization { get; set; } = string.Empty;

    public int TeachingExperienceYears { get; set; }

    public int IndustryExperienceYears { get; set; }

    public bool IsActive { get; set; }
}
