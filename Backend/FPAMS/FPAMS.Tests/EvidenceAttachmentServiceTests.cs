using System.Linq.Expressions;
using FPAMS.Application.DTOs.Auth;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Common;
using FPAMS.Domain.Entities;
using FPAMS.Infrastructure.Services;
using FPAMS.Shared.Constants;

namespace FPAMS.Tests;

public class EvidenceAttachmentServiceTests
{
    [Fact]
    public async Task CreateAsync_AllowsFacultyOnOwnDraftAppraisal()
    {
        var appraisal = CreateAppraisalForm();
        var service = CreateService(
            appraisal,
            new AuthenticatedUserDto
            {
                UserId = appraisal.FacultyProfile.UserId,
                Role = Roles.Faculty,
                DepartmentId = appraisal.FacultyProfile.DepartmentId,
                IsActive = true
            });

        var result = await service.CreateAsync(
            appraisal.Id,
            "evidence.pdf",
            "stored.pdf",
            "application/pdf",
            1200,
            "Evidence");

        Assert.Equal(appraisal.Id, result.AppraisalFormId);
    }

    [Fact]
    public async Task CreateAsync_RejectsFacultyOnAnotherAppraisal()
    {
        var appraisal = CreateAppraisalForm();
        var service = CreateService(
            appraisal,
            new AuthenticatedUserDto
            {
                UserId = Guid.NewGuid(),
                Role = Roles.Faculty,
                DepartmentId = appraisal.FacultyProfile.DepartmentId,
                IsActive = true
            });

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.CreateAsync(
                appraisal.Id,
                "evidence.pdf",
                "stored.pdf",
                "application/pdf",
                1200,
                "Evidence"));
    }

    [Fact]
    public async Task GetStorageAsync_AllowsHodForDepartmentAppraisal()
    {
        var appraisal = CreateAppraisalForm();
        var attachment = new EvidenceAttachment
        {
            Id = Guid.NewGuid(),
            AppraisalFormId = appraisal.Id,
            FileName = "evidence.pdf",
            StoredFileName = "stored.pdf",
            ContentType = "application/pdf",
            FileSize = 1200
        };
        var service = CreateService(
            appraisal,
            new AuthenticatedUserDto
            {
                UserId = Guid.NewGuid(),
                Role = Roles.HOD,
                DepartmentId = appraisal.FacultyProfile.DepartmentId,
                IsActive = true
            },
            attachment);

        var result = await service.GetStorageAsync(attachment.Id);

        Assert.NotNull(result);
        Assert.Equal(attachment.StoredFileName, result.StoredFileName);
    }

    [Fact]
    public async Task DeleteAsync_RejectsReviewerDeletingEvidence()
    {
        var appraisal = CreateAppraisalForm();
        var attachment = new EvidenceAttachment
        {
            Id = Guid.NewGuid(),
            AppraisalFormId = appraisal.Id,
            FileName = "evidence.pdf",
            StoredFileName = "stored.pdf",
            ContentType = "application/pdf",
            FileSize = 1200
        };
        var service = CreateService(
            appraisal,
            new AuthenticatedUserDto
            {
                UserId = Guid.NewGuid(),
                Role = Roles.HOD,
                DepartmentId = appraisal.FacultyProfile.DepartmentId,
                IsActive = true
            },
            attachment);

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.DeleteAsync(attachment.Id));
    }

    private static EvidenceAttachmentService CreateService(
        AppraisalForm appraisal,
        AuthenticatedUserDto user,
        params EvidenceAttachment[] attachments)
    {
        return new EvidenceAttachmentService(
            new InMemoryRepository<EvidenceAttachment>(attachments),
            new InMemoryRepository<AppraisalForm>(appraisal),
            new FakeCurrentUserService(user));
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
            DepartmentId = department.Id
        };

        var profile = new FacultyProfile
        {
            Id = Guid.NewGuid(),
            User = user,
            UserId = user.Id,
            Department = department,
            DepartmentId = department.Id,
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

    private sealed class FakeCurrentUserService : ICurrentUserService
    {
        public FakeCurrentUserService(AuthenticatedUserDto user)
        {
            User = user;
        }

        public AuthenticatedUserDto? User { get; }
    }
}
