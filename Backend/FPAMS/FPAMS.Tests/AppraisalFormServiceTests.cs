using System.Linq.Expressions;
using FPAMS.Application.DTOs.Auth;
using FPAMS.Application.DTOs.Appraisal;
using FPAMS.Application.DTOs.Notification;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Common;
using FPAMS.Domain.Entities;
using FPAMS.Infrastructure.Services;
using FPAMS.Shared.Constants;

namespace FPAMS.Tests;

public class AppraisalFormServiceTests
{
    [Fact]
    public async Task SubmitAsync_UpdatesStatusAndCreatesNotification()
    {
        var form = CreateAppraisalForm();
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        var result = await service.SubmitAsync(form.Id);

        Assert.NotNull(result);
        Assert.Equal("Submitted", result.Status);
        Assert.NotNull(result.SubmittedOn);
        Assert.Single(notifications.Created);
        Assert.Equal("Appraisal Submitted", notifications.Created[0].Title);
        Assert.Equal(form.Id, notifications.Created[0].ReferenceId);
    }

    [Fact]
    public async Task ReviewAsync_AdvancesStatusAndCreatesNotification()
    {
        var form = CreateAppraisalForm();
        form.Status = "Submitted";

        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        var result = await service.ReviewAsync(
            form.Id,
            "HodReviewed",
            new ReviewAppraisalRequest { ReviewerRemarks = "Reviewed by HOD" });

        Assert.NotNull(result);
        Assert.Equal("HodReviewed", result.Status);
        Assert.Equal("Reviewed by HOD", result.ReviewerRemarks);
        Assert.Single(notifications.Created);
        Assert.Equal("HOD Review Completed", notifications.Created[0].Title);
    }

    [Fact]
    public async Task ReviewAsync_RejectsDraftAsReviewStatus()
    {
        var form = CreateAppraisalForm();
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        await Assert.ThrowsAsync<Exception>(() =>
            service.ReviewAsync(
                form.Id,
                "Draft",
                new ReviewAppraisalRequest()));
    }

    [Fact]
    public async Task SubmitAsync_RejectsAlreadySubmittedForm()
    {
        var form = CreateAppraisalForm();
        form.Status = "Submitted";
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        await Assert.ThrowsAsync<Exception>(() => service.SubmitAsync(form.Id));
        Assert.Empty(notifications.Created);
    }

    [Fact]
    public async Task UpdateAsync_PreservesWorkflowStatusAndReviewerRemarks()
    {
        var form = CreateAppraisalForm();
        form.Status = "Returned";
        form.ReviewerRemarks = "Please revise evidence.";
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        var result = await service.UpdateAsync(new UpdateAppraisalFormRequest
        {
            Id = form.Id,
            FacultyProfileId = form.FacultyProfileId,
            AcademicYearId = form.AcademicYearId,
            TeachingScore = 90,
            ResearchScore = 85,
            AdministrationScore = 80,
            ContributionScore = 75,
            EvidenceSummary = "Updated evidence",
            FacultyRemarks = "Updated remarks",
            ReviewerRemarks = "Tampered reviewer remarks",
            Status = "IqacReviewed"
        });

        Assert.NotNull(result);
        Assert.Equal("Returned", result.Status);
        Assert.Equal("Please revise evidence.", result.ReviewerRemarks);
        Assert.Equal(330, result.TotalScore);
    }

    [Fact]
    public async Task UpdateAsync_RejectsSubmittedFormEdits()
    {
        var form = CreateAppraisalForm();
        form.Status = "Submitted";
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        await Assert.ThrowsAsync<Exception>(() =>
            service.UpdateAsync(new UpdateAppraisalFormRequest
            {
                Id = form.Id,
                FacultyProfileId = form.FacultyProfileId,
                AcademicYearId = form.AcademicYearId,
                TeachingScore = 90,
                ResearchScore = 85,
                AdministrationScore = 80,
                ContributionScore = 75,
                EvidenceSummary = "Updated evidence",
                FacultyRemarks = "Updated remarks",
                ReviewerRemarks = "",
                Status = "Draft"
            }));
    }

    [Fact]
    public async Task GetAllAsync_FiltersFacultyToOwnAppraisals()
    {
        var ownForm = CreateAppraisalForm();
        var otherForm = CreateAppraisalForm();
        otherForm.FacultyProfile.UserId = Guid.NewGuid();
        otherForm.FacultyProfile.User.Id = otherForm.FacultyProfile.UserId;
        var repository = new InMemoryRepository<AppraisalForm>(ownForm, otherForm);
        var notifications = new FakeNotificationService();
        var currentUser = new FakeCurrentUserService(new AuthenticatedUserDto
        {
            UserId = ownForm.FacultyProfile.UserId,
            EmployeeCode = ownForm.FacultyProfile.User.EmployeeCode,
            FullName = "Demo Faculty",
            Email = ownForm.FacultyProfile.User.Email,
            Role = Roles.Faculty,
            DepartmentId = ownForm.FacultyProfile.DepartmentId,
            IsActive = true
        });
        var service = new AppraisalFormService(
            repository,
            notifications,
            currentUserService: currentUser);

        var result = await service.GetAllAsync();

        var visible = Assert.Single(result);
        Assert.Equal(ownForm.Id, visible.Id);
    }

    [Fact]
    public async Task CreateAsync_RejectsFacultyCreatingForAnotherProfile()
    {
        var ownForm = CreateAppraisalForm();
        var otherForm = CreateAppraisalForm();
        otherForm.FacultyProfile.UserId = Guid.NewGuid();
        otherForm.FacultyProfile.User.Id = otherForm.FacultyProfile.UserId;
        var appraisalRepository = new InMemoryRepository<AppraisalForm>();
        var profileRepository = new InMemoryRepository<FacultyProfile>(
            ownForm.FacultyProfile,
            otherForm.FacultyProfile);
        var notifications = new FakeNotificationService();
        var currentUser = new FakeCurrentUserService(new AuthenticatedUserDto
        {
            UserId = ownForm.FacultyProfile.UserId,
            EmployeeCode = ownForm.FacultyProfile.User.EmployeeCode,
            FullName = "Demo Faculty",
            Email = ownForm.FacultyProfile.User.Email,
            Role = Roles.Faculty,
            DepartmentId = ownForm.FacultyProfile.DepartmentId,
            IsActive = true
        });
        var service = new AppraisalFormService(
            appraisalRepository,
            notifications,
            profileRepository,
            currentUser);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.CreateAsync(new CreateAppraisalFormRequest
            {
                FacultyProfileId = otherForm.FacultyProfileId,
                AcademicYearId = otherForm.AcademicYearId,
                TeachingScore = 80,
                ResearchScore = 70,
                AdministrationScore = 60,
                ContributionScore = 90,
                EvidenceSummary = "Evidence",
                FacultyRemarks = "Remarks"
            }));
    }

    [Theory]
    [InlineData("Draft", "HodReviewed")]
    [InlineData("Submitted", "PrincipalReviewed")]
    [InlineData("HodReviewed", "IqacReviewed")]
    [InlineData("IqacReviewed", "Returned")]
    public async Task ReviewAsync_RejectsInvalidWorkflowSkips(string currentStatus, string nextStatus)
    {
        var form = CreateAppraisalForm();
        form.Status = currentStatus;
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        await Assert.ThrowsAsync<Exception>(() =>
            service.ReviewAsync(
                form.Id,
                nextStatus,
                new ReviewAppraisalRequest { ReviewerRemarks = "Invalid skip" }));

        Assert.Empty(notifications.Created);
    }

    [Fact]
    public async Task ReviewAsync_AllowsFullReviewChainInOrder()
    {
        var form = CreateAppraisalForm();
        var repository = new InMemoryRepository<AppraisalForm>(form);
        var notifications = new FakeNotificationService();
        var service = new AppraisalFormService(repository, notifications);

        await service.SubmitAsync(form.Id);
        var hod = await service.ReviewAsync(
            form.Id,
            "HodReviewed",
            new ReviewAppraisalRequest { ReviewerRemarks = "HOD done" });
        var principal = await service.ReviewAsync(
            form.Id,
            "PrincipalReviewed",
            new ReviewAppraisalRequest { ReviewerRemarks = "Principal done" });
        var iqac = await service.ReviewAsync(
            form.Id,
            "IqacReviewed",
            new ReviewAppraisalRequest { ReviewerRemarks = "IQAC done" });

        Assert.Equal("HodReviewed", hod?.Status);
        Assert.Equal("PrincipalReviewed", principal?.Status);
        Assert.Equal("IqacReviewed", iqac?.Status);
        Assert.Equal(4, notifications.Created.Count);
    }

    private static AppraisalForm CreateAppraisalForm()
    {
        var department = new Department
        {
            Id = Guid.NewGuid(),
            DepartmentCode = "CSE",
            DepartmentName = "Computer Science and Engineering",
            IsActive = true
        };

        var designation = new Designation
        {
            Id = Guid.NewGuid(),
            DesignationCode = "AP",
            DesignationName = "Assistant Professor",
            IsActive = true
        };

        var user = new User
        {
            Id = Guid.NewGuid(),
            EmployeeCode = "FAC001",
            FirstName = "Demo",
            LastName = "Faculty",
            Email = "faculty@fpams.test",
            Mobile = "9999999999",
            PasswordHash = "hash",
            Department = department,
            DepartmentId = department.Id,
            Designation = designation,
            DesignationId = designation.Id
        };

        var profile = new FacultyProfile
        {
            Id = Guid.NewGuid(),
            User = user,
            UserId = user.Id,
            Department = department,
            DepartmentId = department.Id,
            Designation = designation,
            DesignationId = designation.Id,
            DateOfJoining = new DateTime(2020, 6, 1),
            HighestQualification = "M.Tech",
            Specialization = "CSE",
            IsActive = true
        };

        var academicYear = new AcademicYear
        {
            Id = Guid.NewGuid(),
            YearName = "2026-2027",
            StartDate = new DateTime(2026, 7, 1),
            EndDate = new DateTime(2027, 6, 30),
            IsCurrent = true,
            IsActive = true
        };

        return new AppraisalForm
        {
            Id = Guid.NewGuid(),
            FacultyProfile = profile,
            FacultyProfileId = profile.Id,
            AcademicYear = academicYear,
            AcademicYearId = academicYear.Id,
            TeachingScore = 80,
            ResearchScore = 70,
            AdministrationScore = 60,
            ContributionScore = 90,
            EvidenceSummary = "Evidence",
            FacultyRemarks = "Remarks",
            Status = "Draft"
        };
    }

    private sealed class InMemoryRepository<T> : IGenericRepository<T>
        where T : BaseEntity
    {
        private readonly List<T> _items;

        public InMemoryRepository(params T[] items)
        {
            _items = items.ToList();
        }

        public Task<List<T>> GetAllAsync() => Task.FromResult(_items);

        public Task<T?> GetByIdAsync(Guid id) =>
            Task.FromResult(_items.FirstOrDefault(x => x.Id == id));

        public Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.AsQueryable().Where(predicate).ToList());

        public Task AddAsync(T entity)
        {
            _items.Add(entity);
            return Task.CompletedTask;
        }

        public Task AddRangeAsync(IEnumerable<T> entities)
        {
            _items.AddRange(entities);
            return Task.CompletedTask;
        }

        public void Update(T entity)
        {
        }

        public void Delete(T entity)
        {
            _items.Remove(entity);
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities.ToList())
                _items.Remove(entity);
        }

        public Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) =>
            Task.FromResult(_items.AsQueryable().Any(predicate));

        public Task<int> SaveChangesAsync() => Task.FromResult(1);
    }

    private sealed class FakeNotificationService : INotificationService
    {
        public List<CreateNotificationRequest> Created { get; } = new();

        public Task<List<NotificationResponse>> GetAllAsync() => Task.FromResult(new List<NotificationResponse>());

        public Task<NotificationResponse> CreateAsync(CreateNotificationRequest request)
        {
            Created.Add(request);
            return Task.FromResult(new NotificationResponse
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Message = request.Message,
                Category = request.Category,
                ReferenceId = request.ReferenceId,
                IsRead = false,
                CreatedOn = DateTime.UtcNow
            });
        }

        public Task<NotificationResponse?> MarkReadAsync(Guid id) =>
            Task.FromResult<NotificationResponse?>(null);

        public Task<bool> DeleteAsync(Guid id) => Task.FromResult(false);
    }

    private sealed class FakeCurrentUserService : ICurrentUserService
    {
        public FakeCurrentUserService(AuthenticatedUserDto user)
        {
            User = user;
        }

        public AuthenticatedUserDto? User { get; }
    }
}
