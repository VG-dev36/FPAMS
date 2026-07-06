using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.Appraisal;

public class UpdateAppraisalFormRequest : CreateAppraisalFormRequest
{
    [Required]
    public Guid Id { get; set; }

    [MaxLength(1000)]
    public string ReviewerRemarks { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string Status { get; set; } = "Draft";
}
