using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.Appraisal;

public class CreateAppraisalFormRequest
{
    [Required]
    public Guid FacultyProfileId { get; set; }

    [Required]
    public Guid AcademicYearId { get; set; }

    [Range(0, 100)]
    public int TeachingScore { get; set; }

    [Range(0, 100)]
    public int ResearchScore { get; set; }

    [Range(0, 100)]
    public int AdministrationScore { get; set; }

    [Range(0, 100)]
    public int ContributionScore { get; set; }

    [MaxLength(1000)]
    public string EvidenceSummary { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string FacultyRemarks { get; set; } = string.Empty;
}
