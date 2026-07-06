namespace FPAMS.Application.DTOs.Appraisal;

public class AppraisalFormResponse
{
    public Guid Id { get; set; }

    public Guid FacultyProfileId { get; set; }

    public string FacultyName { get; set; } = string.Empty;

    public string EmployeeCode { get; set; } = string.Empty;

    public string DepartmentName { get; set; } = string.Empty;

    public Guid AcademicYearId { get; set; }

    public string AcademicYearName { get; set; } = string.Empty;

    public int TeachingScore { get; set; }

    public int ResearchScore { get; set; }

    public int AdministrationScore { get; set; }

    public int ContributionScore { get; set; }

    public int TotalScore { get; set; }

    public string EvidenceSummary { get; set; } = string.Empty;

    public string FacultyRemarks { get; set; } = string.Empty;

    public string ReviewerRemarks { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime? SubmittedOn { get; set; }
}
