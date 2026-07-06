using FPAMS.Application.DTOs.Appraisal;
using FPAMS.Application.DTOs.Notification;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Shared.Constants;

namespace FPAMS.Infrastructure.Services;

public class AppraisalFormService : IAppraisalFormService
{
    private static readonly HashSet<string> ValidStatuses = new(StringComparer.OrdinalIgnoreCase)
    {
        "Draft",
        "Submitted",
        "HodReviewed",
        "PrincipalReviewed",
        "IqacReviewed",
        "Returned"
    };

    private readonly IGenericRepository<AppraisalForm> _repository;
    private readonly INotificationService _notificationService;
    private readonly IGenericRepository<FacultyProfile>? _facultyProfileRepository;
    private readonly ICurrentUserService? _currentUserService;

    public AppraisalFormService(
        IGenericRepository<AppraisalForm> repository,
        INotificationService notificationService,
        IGenericRepository<FacultyProfile>? facultyProfileRepository = null,
        ICurrentUserService? currentUserService = null)
    {
        _repository = repository;
        _notificationService = notificationService;
        _facultyProfileRepository = facultyProfileRepository;
        _currentUserService = currentUserService;
    }

    public async Task<List<AppraisalFormResponse>> GetAllAsync()
    {
        var forms = await _repository.GetAllAsync();

        return forms
            .Where(CanAccessForm)
            .Select(MapToResponse)
            .ToList();
    }

    public async Task<AppraisalFormResponse?> GetByIdAsync(Guid id)
    {
        var form = await _repository.GetByIdAsync(id);

        if (form == null || form.IsDeleted)
            return null;

        if (!CanAccessForm(form))
            return null;

        return MapToResponse(form);
    }

    public async Task<AppraisalFormResponse> CreateAsync(CreateAppraisalFormRequest request)
    {
        var exists = await _repository.ExistsAsync(x =>
            x.FacultyProfileId == request.FacultyProfileId
            && x.AcademicYearId == request.AcademicYearId
            && !x.IsDeleted);

        if (exists)
            throw new Exception("Appraisal form already exists for this faculty and academic year.");

        if (_facultyProfileRepository != null)
        {
            var profile = await _facultyProfileRepository.GetByIdAsync(request.FacultyProfileId);

            if (profile == null)
                throw new Exception("Faculty profile not found.");

            if (!CanAccessProfile(profile))
                throw new UnauthorizedAccessException("You cannot create an appraisal for this faculty profile.");
        }

        var form = new AppraisalForm
        {
            FacultyProfileId = request.FacultyProfileId,
            AcademicYearId = request.AcademicYearId,
            TeachingScore = request.TeachingScore,
            ResearchScore = request.ResearchScore,
            AdministrationScore = request.AdministrationScore,
            ContributionScore = request.ContributionScore,
            EvidenceSummary = request.EvidenceSummary,
            FacultyRemarks = request.FacultyRemarks,
            Status = "Draft"
        };

        await _repository.AddAsync(form);
        await _repository.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(form.Id);

        return MapToResponse(created!);
    }

    public async Task<AppraisalFormResponse?> UpdateAsync(UpdateAppraisalFormRequest request)
    {
        var form = await _repository.GetByIdAsync(request.Id);

        if (form == null || form.IsDeleted)
            return null;

        if (!CanAccessForm(form))
            throw new UnauthorizedAccessException("You cannot edit this appraisal.");

        if (!CanEditForm(form.Status))
            throw new Exception("Only draft or returned appraisal forms can be edited.");

        form.FacultyProfileId = request.FacultyProfileId;
        form.AcademicYearId = request.AcademicYearId;
        form.TeachingScore = request.TeachingScore;
        form.ResearchScore = request.ResearchScore;
        form.AdministrationScore = request.AdministrationScore;
        form.ContributionScore = request.ContributionScore;
        form.EvidenceSummary = request.EvidenceSummary;
        form.FacultyRemarks = request.FacultyRemarks;
        form.ModifiedOn = DateTime.UtcNow;

        _repository.Update(form);
        await _repository.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(form.Id);

        return MapToResponse(updated!);
    }

    public async Task<AppraisalFormResponse?> SubmitAsync(Guid id)
    {
        var form = await _repository.GetByIdAsync(id);

        if (form == null || form.IsDeleted)
            return null;

        if (!CanAccessForm(form))
            throw new UnauthorizedAccessException("You cannot submit this appraisal.");

        if (!CanSubmit(form.Status))
            throw new Exception("Only draft or returned appraisal forms can be submitted.");

        form.Status = "Submitted";
        form.SubmittedOn = DateTime.UtcNow;
        form.ModifiedOn = DateTime.UtcNow;

        _repository.Update(form);
        await _repository.SaveChangesAsync();

        var submitted = await _repository.GetByIdAsync(form.Id);
        await CreateWorkflowNotificationAsync(submitted!, "Appraisal Submitted");

        return MapToResponse(submitted!);
    }

    public async Task<AppraisalFormResponse?> ReviewAsync(
        Guid id,
        string status,
        ReviewAppraisalRequest request)
    {
        var form = await _repository.GetByIdAsync(id);

        if (form == null || form.IsDeleted)
            return null;

        if (!CanAccessForm(form))
            throw new UnauthorizedAccessException("You cannot review this appraisal.");

        if (!ValidStatuses.Contains(status) || status.Equals("Draft", StringComparison.OrdinalIgnoreCase))
            throw new Exception("Invalid appraisal review status.");

        if (!CanReview(form.Status, status))
            throw new Exception($"Cannot move appraisal from {form.Status} to {status}.");

        form.Status = status;
        form.ReviewerRemarks = request.ReviewerRemarks;
        form.ModifiedOn = DateTime.UtcNow;

        _repository.Update(form);
        await _repository.SaveChangesAsync();

        var reviewed = await _repository.GetByIdAsync(form.Id);
        await CreateWorkflowNotificationAsync(reviewed!, GetNotificationTitle(status));

        return MapToResponse(reviewed!);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var form = await _repository.GetByIdAsync(id);

        if (form == null || form.IsDeleted)
            return false;

        form.IsDeleted = true;
        form.ModifiedOn = DateTime.UtcNow;

        _repository.Update(form);
        await _repository.SaveChangesAsync();

        return true;
    }

    private static AppraisalFormResponse MapToResponse(AppraisalForm form)
    {
        return new AppraisalFormResponse
        {
            Id = form.Id,
            FacultyProfileId = form.FacultyProfileId,
            FacultyName = $"{form.FacultyProfile.User.FirstName} {form.FacultyProfile.User.LastName}".Trim(),
            EmployeeCode = form.FacultyProfile.User.EmployeeCode,
            DepartmentName = form.FacultyProfile.Department.DepartmentName,
            AcademicYearId = form.AcademicYearId,
            AcademicYearName = form.AcademicYear.YearName,
            TeachingScore = form.TeachingScore,
            ResearchScore = form.ResearchScore,
            AdministrationScore = form.AdministrationScore,
            ContributionScore = form.ContributionScore,
            TotalScore = form.TeachingScore + form.ResearchScore + form.AdministrationScore + form.ContributionScore,
            EvidenceSummary = form.EvidenceSummary,
            FacultyRemarks = form.FacultyRemarks,
            ReviewerRemarks = form.ReviewerRemarks,
            Status = form.Status,
            SubmittedOn = form.SubmittedOn
        };
    }

    private bool CanAccessForm(AppraisalForm form)
    {
        var currentUser = _currentUserService?.User;

        if (currentUser == null)
            return true;

        if (currentUser.Role == Roles.SuperAdmin
            || currentUser.Role == Roles.Principal
            || currentUser.Role == Roles.APEC)
        {
            return true;
        }

        if (currentUser.Role == Roles.HOD)
        {
            return currentUser.DepartmentId.HasValue
                && form.FacultyProfile.DepartmentId == currentUser.DepartmentId.Value;
        }

        if (currentUser.Role == Roles.Faculty)
        {
            return form.FacultyProfile.UserId == currentUser.UserId;
        }

        return false;
    }

    private bool CanAccessProfile(FacultyProfile profile)
    {
        var currentUser = _currentUserService?.User;

        if (currentUser == null)
            return true;

        if (currentUser.Role == Roles.SuperAdmin
            || currentUser.Role == Roles.Principal
            || currentUser.Role == Roles.APEC)
        {
            return true;
        }

        if (currentUser.Role == Roles.HOD)
        {
            return currentUser.DepartmentId.HasValue
                && profile.DepartmentId == currentUser.DepartmentId.Value;
        }

        if (currentUser.Role == Roles.Faculty)
        {
            return profile.UserId == currentUser.UserId;
        }

        return false;
    }

    private async Task CreateWorkflowNotificationAsync(AppraisalForm form, string title)
    {
        await _notificationService.CreateAsync(new CreateNotificationRequest
        {
            Title = title,
            Message = $"{form.FacultyProfile.User.EmployeeCode} - {form.FacultyProfile.User.FirstName} {form.FacultyProfile.User.LastName} | {form.AcademicYear.YearName} | Status: {form.Status}",
            Category = "Appraisal",
            ReferenceId = form.Id
        });
    }

    private static string GetNotificationTitle(string status)
    {
        return status switch
        {
            "HodReviewed" => "HOD Review Completed",
            "PrincipalReviewed" => "Principal Review Completed",
            "IqacReviewed" => "IQAC/APEC Review Finalized",
            "Returned" => "Appraisal Returned",
            _ => "Appraisal Updated"
        };
    }

    private static bool CanSubmit(string currentStatus)
    {
        return currentStatus.Equals("Draft", StringComparison.OrdinalIgnoreCase)
            || currentStatus.Equals("Returned", StringComparison.OrdinalIgnoreCase);
    }

    private static bool CanEditForm(string currentStatus)
    {
        return currentStatus.Equals("Draft", StringComparison.OrdinalIgnoreCase)
            || currentStatus.Equals("Returned", StringComparison.OrdinalIgnoreCase);
    }

    private static bool CanReview(string currentStatus, string nextStatus)
    {
        if (nextStatus.Equals("Returned", StringComparison.OrdinalIgnoreCase))
        {
            return currentStatus.Equals("Submitted", StringComparison.OrdinalIgnoreCase)
                || currentStatus.Equals("HodReviewed", StringComparison.OrdinalIgnoreCase)
                || currentStatus.Equals("PrincipalReviewed", StringComparison.OrdinalIgnoreCase);
        }

        return nextStatus switch
        {
            "HodReviewed" => currentStatus.Equals("Submitted", StringComparison.OrdinalIgnoreCase),
            "PrincipalReviewed" => currentStatus.Equals("HodReviewed", StringComparison.OrdinalIgnoreCase),
            "IqacReviewed" => currentStatus.Equals("PrincipalReviewed", StringComparison.OrdinalIgnoreCase),
            _ => false
        };
    }
}
