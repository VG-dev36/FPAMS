using FPAMS.Domain.Common;

namespace FPAMS.Domain.Entities;

public class EvidenceAttachment : BaseEntity
{
    public Guid AppraisalFormId { get; set; }

    public AppraisalForm AppraisalForm { get; set; } = null!;

    public string FileName { get; set; } = string.Empty;

    public string StoredFileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public string Description { get; set; } = string.Empty;
}
