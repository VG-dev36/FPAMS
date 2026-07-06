namespace FPAMS.Application.DTOs.Evidence;

public class EvidenceAttachmentStorageResponse
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string StoredFileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;
}
