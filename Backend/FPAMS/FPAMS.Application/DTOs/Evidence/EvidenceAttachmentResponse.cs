namespace FPAMS.Application.DTOs.Evidence;

public class EvidenceAttachmentResponse
{
    public Guid Id { get; set; }

    public Guid AppraisalFormId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedOn { get; set; }
}
