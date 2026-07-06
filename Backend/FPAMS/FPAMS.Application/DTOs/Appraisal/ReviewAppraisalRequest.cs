using System.ComponentModel.DataAnnotations;

namespace FPAMS.Application.DTOs.Appraisal;

public class ReviewAppraisalRequest
{
    [MaxLength(1000)]
    public string ReviewerRemarks { get; set; } = string.Empty;
}
