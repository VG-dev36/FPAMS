using FPAMS.Application.DTOs.FacultyProfile;

namespace FPAMS.Application.Interfaces;

public interface IFacultyProfileService
{
    Task<List<FacultyProfileResponse>> GetAllAsync();

    Task<FacultyProfileResponse?> GetByIdAsync(Guid id);

    Task<FacultyProfileResponse> CreateAsync(CreateFacultyProfileRequest request);

    Task<FacultyProfileResponse?> UpdateAsync(UpdateFacultyProfileRequest request);

    Task<bool> DeleteAsync(Guid id);
}
