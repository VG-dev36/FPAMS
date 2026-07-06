using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class AppraisalForm : BaseEntity
{
    public Guid FacultyProfileId { get; set; }

    public FacultyProfile FacultyProfile { get; set; } = null!;

    public Guid AcademicYearId { get; set; }

    public AcademicYear AcademicYear { get; set; } = null!;

    public int TeachingScore { get; set; }

    public int ResearchScore { get; set; }

    public int AdministrationScore { get; set; }

    public int ContributionScore { get; set; }

    public string EvidenceSummary { get; set; } = string.Empty;

    public string FacultyRemarks { get; set; } = string.Empty;

    public string ReviewerRemarks { get; set; } = string.Empty;

    public string Status { get; set; } = "Draft";

    public DateTime? SubmittedOn { get; set; }
}
