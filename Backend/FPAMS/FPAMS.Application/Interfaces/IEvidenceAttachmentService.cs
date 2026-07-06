using FPAMS.Application.DTOs.Evidence;

namespace FPAMS.Application.Interfaces;

public interface IEvidenceAttachmentService
{
    Task<List<EvidenceAttachmentResponse>> GetByAppraisalFormAsync(Guid appraisalFormId);

    Task<EvidenceAttachmentResponse?> GetByIdAsync(Guid id);

    Task<EvidenceAttachmentStorageResponse?> GetStorageAsync(Guid id);

    Task<EvidenceAttachmentResponse> CreateAsync(
        Guid appraisalFormId,
        string fileName,
        string storedFileName,
        string contentType,
        long fileSize,
        string description);

    Task<bool> DeleteAsync(Guid id);
}
