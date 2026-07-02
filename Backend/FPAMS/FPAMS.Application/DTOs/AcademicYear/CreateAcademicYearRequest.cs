using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.AcademicYear;

public class CreateAcademicYearRequest
{
    [Required]
    [MaxLength(30)]
    public string YearName { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    public bool IsCurrent { get; set; }
}