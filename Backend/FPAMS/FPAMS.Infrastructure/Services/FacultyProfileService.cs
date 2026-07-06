using FPAMS.Application.DTOs.FacultyProfile;
using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;

namespace FPAMS.Infrastructure.Services;

public class FacultyProfileService : IFacultyProfileService
{
    private readonly IGenericRepository<FacultyProfile> _repository;

    public FacultyProfileService(IGenericRepository<FacultyProfile> repository)
    {
        _repository = repository;
    }

    public async Task<List<FacultyProfileResponse>> GetAllAsync()
    {
        var profiles = await _repository.GetAllAsync();

        return profiles.Select(MapToResponse).ToList();
    }

    public async Task<FacultyProfileResponse?> GetByIdAsync(Guid id)
    {
        var profile = await _repository.GetByIdAsync(id);

        if (profile == null || profile.IsDeleted)
            return null;

        return MapToResponse(profile);
    }

    public async Task<FacultyProfileResponse> CreateAsync(CreateFacultyProfileRequest request)
    {
        var existing = await _repository.ExistsAsync(x =>
            x.UserId == request.UserId && !x.IsDeleted);

        if (existing)
            throw new Exception("Faculty profile already exists for this user.");

        var profile = new FacultyProfile
        {
            UserId = request.UserId,
            DepartmentId = request.DepartmentId,
            DesignationId = request.DesignationId,
            DateOfJoining = request.DateOfJoining,
            HighestQualification = request.HighestQualification,
            Specialization = request.Specialization,
            TeachingExperienceYears = request.TeachingExperienceYears,
            IndustryExperienceYears = request.IndustryExperienceYears,
            IsActive = true
        };

        await _repository.AddAsync(profile);
        await _repository.SaveChangesAsync();

        var created = await _repository.GetByIdAsync(profile.Id);

        return MapToResponse(created!);
    }

    public async Task<FacultyProfileResponse?> UpdateAsync(UpdateFacultyProfileRequest request)
    {
        var profile = await _repository.GetByIdAsync(request.Id);

        if (profile == null || profile.IsDeleted)
            return null;

        profile.UserId = request.UserId;
        profile.DepartmentId = request.DepartmentId;
        profile.DesignationId = request.DesignationId;
        profile.DateOfJoining = request.DateOfJoining;
        profile.HighestQualification = request.HighestQualification;
        profile.Specialization = request.Specialization;
        profile.TeachingExperienceYears = request.TeachingExperienceYears;
        profile.IndustryExperienceYears = request.IndustryExperienceYears;
        profile.IsActive = request.IsActive;
        profile.ModifiedOn = DateTime.UtcNow;

        _repository.Update(profile);
        await _repository.SaveChangesAsync();

        var updated = await _repository.GetByIdAsync(profile.Id);

        return MapToResponse(updated!);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var profile = await _repository.GetByIdAsync(id);

        if (profile == null || profile.IsDeleted)
            return false;

        profile.IsDeleted = true;
        profile.IsActive = false;
        profile.ModifiedOn = DateTime.UtcNow;

        _repository.Update(profile);
        await _repository.SaveChangesAsync();

        return true;
    }

    private static FacultyProfileResponse MapToResponse(FacultyProfile profile)
    {
        return new FacultyProfileResponse
        {
            Id = profile.Id,
            UserId = profile.UserId,
            EmployeeCode = profile.User.EmployeeCode,
            FacultyName = $"{profile.User.FirstName} {profile.User.LastName}".Trim(),
            Email = profile.User.Email,
            DepartmentId = profile.DepartmentId,
            DepartmentName = profile.Department.DepartmentName,
            DesignationId = profile.DesignationId,
            DesignationName = profile.Designation.DesignationName,
            DateOfJoining = profile.DateOfJoining,
            HighestQualification = profile.HighestQualification,
            Specialization = profile.Specialization,
            TeachingExperienceYears = profile.TeachingExperienceYears,
            IndustryExperienceYears = profile.IndustryExperienceYears,
            IsActive = profile.IsActive
        };
    }
}
