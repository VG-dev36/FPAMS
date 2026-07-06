using FPAMS.Application.DTOs.Evidence;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Shared.Constants;

namespace FPAMS.Infrastructure.Services;

public class EvidenceAttachmentService : IEvidenceAttachmentService
{
    private readonly IGenericRepository<EvidenceAttachment> _repository;
    private readonly IGenericRepository<AppraisalForm> _appraisalRepository;
    private readonly ICurrentUserService _currentUserService;

    public EvidenceAttachmentService(
        IGenericRepository<EvidenceAttachment> repository,
        IGenericRepository<AppraisalForm> appraisalRepository,
        ICurrentUserService currentUserService)
    {
        _repository = repository;
        _appraisalRepository = appraisalRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<EvidenceAttachmentResponse>> GetByAppraisalFormAsync(Guid appraisalFormId)
    {
        var appraisal = await _appraisalRepository.GetByIdAsync(appraisalFormId);

        if (appraisal == null || appraisal.IsDeleted || !CanAccessAppraisal(appraisal))
            throw new UnauthorizedAccessException("You cannot access evidence for this appraisal.");

        var attachments = await _repository.FindAsync(x =>
            x.AppraisalFormId == appraisalFormId && !x.IsDeleted);

        return attachments
            .OrderByDescending(x => x.CreatedOn)
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<EvidenceAttachmentResponse?> GetByIdAsync(Guid id)
    {
        var attachment = await _repository.GetByIdAsync(id);

        if (attachment == null || attachment.IsDeleted)
            return null;

        var appraisal = await _appraisalRepository.GetByIdAsync(attachment.AppraisalFormId);

        if (appraisal == null || appraisal.IsDeleted || !CanAccessAppraisal(appraisal))
            throw new UnauthorizedAccessException("You cannot access this evidence.");

        return MapToResponse(attachment);
    }

    public async Task<EvidenceAttachmentStorageResponse?> GetStorageAsync(Guid id)
    {
        var attachment = await _repository.GetByIdAsync(id);

        if (attachment == null || attachment.IsDeleted)
            return null;

        var appraisal = await _appraisalRepository.GetByIdAsync(attachment.AppraisalFormId);

        if (appraisal == null || appraisal.IsDeleted || !CanAccessAppraisal(appraisal))
            throw new UnauthorizedAccessException("You cannot download this evidence.");

        return new EvidenceAttachmentStorageResponse
        {
            Id = attachment.Id,
            FileName = attachment.FileName,
            StoredFileName = attachment.StoredFileName,
            ContentType = attachment.ContentType
        };
    }

    public async Task<EvidenceAttachmentResponse> CreateAsync(
        Guid appraisalFormId,
        string fileName,
        string storedFileName,
        string contentType,
        long fileSize,
        string description)
    {
        var appraisal = await _appraisalRepository.GetByIdAsync(appraisalFormId);

        if (appraisal == null || appraisal.IsDeleted)
            throw new Exception("Appraisal form not found.");

        if (!CanModifyEvidence(appraisal))
            throw new UnauthorizedAccessException("You cannot upload evidence for this appraisal.");

        var attachment = new EvidenceAttachment
        {
            AppraisalFormId = appraisalFormId,
            FileName = fileName,
            StoredFileName = storedFileName,
            ContentType = contentType,
            FileSize = fileSize,
            Description = description
        };

        await _repository.AddAsync(attachment);
        await _repository.SaveChangesAsync();

        return MapToResponse(attachment);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var attachment = await _repository.GetByIdAsync(id);

        if (attachment == null || attachment.IsDeleted)
            return false;

        var appraisal = await _appraisalRepository.GetByIdAsync(attachment.AppraisalFormId);

        if (appraisal == null || appraisal.IsDeleted || !CanModifyEvidence(appraisal))
            throw new UnauthorizedAccessException("You cannot delete evidence for this appraisal.");

        attachment.IsDeleted = true;
        attachment.ModifiedOn = DateTime.UtcNow;

        _repository.Update(attachment);
        await _repository.SaveChangesAsync();

        return true;
    }

    private static EvidenceAttachmentResponse MapToResponse(EvidenceAttachment attachment)
    {
        return new EvidenceAttachmentResponse
        {
            Id = attachment.Id,
            AppraisalFormId = attachment.AppraisalFormId,
            FileName = attachment.FileName,
            ContentType = attachment.ContentType,
            FileSize = attachment.FileSize,
            Description = attachment.Description,
            CreatedOn = attachment.CreatedOn
        };
    }

    private bool CanAccessAppraisal(AppraisalForm appraisal)
    {
        var currentUser = _currentUserService.User;

        if (currentUser == null)
            return false;

        if (currentUser.Role == Roles.SuperAdmin
            || currentUser.Role == Roles.Principal
            || currentUser.Role == Roles.APEC)
        {
            return true;
        }

        if (currentUser.Role == Roles.HOD)
        {
            return currentUser.DepartmentId.HasValue
                && appraisal.FacultyProfile.DepartmentId == currentUser.DepartmentId.Value;
        }

        if (currentUser.Role == Roles.Faculty)
        {
            return appraisal.FacultyProfile.UserId == currentUser.UserId;
        }

        return false;
    }

    private bool CanModifyEvidence(AppraisalForm appraisal)
    {
        if (!CanAccessAppraisal(appraisal))
            return false;

        var currentUser = _currentUserService.User;

        if (currentUser?.Role == Roles.SuperAdmin)
            return true;

        if (currentUser?.Role == Roles.Faculty)
        {
            return appraisal.Status.Equals("Draft", StringComparison.OrdinalIgnoreCase)
                || appraisal.Status.Equals("Returned", StringComparison.OrdinalIgnoreCase);
        }

        return false;
    }
}
