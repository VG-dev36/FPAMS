using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.FacultyProfile;

public class CreateFacultyProfileRequest
{
    [Required]
    public Guid UserId { get; set; }

    [Required]
    public Guid DepartmentId { get; set; }

    [Required]
    public Guid DesignationId { get; set; }

    [Required]
    public DateTime DateOfJoining { get; set; }

    [MaxLength(150)]
    public string HighestQualification { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Specialization { get; set; } = string.Empty;

    public int TeachingExperienceYears { get; set; }

    public int IndustryExperienceYears { get; set; }
}
