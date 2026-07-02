namespace FPAMS.Application.DTOs.AcademicYear;

public class AcademicYearResponse
{
    public Guid Id { get; set; }

    public string YearName { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsActive { get; set; }
}