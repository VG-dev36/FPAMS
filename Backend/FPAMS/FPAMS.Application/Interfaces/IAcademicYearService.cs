using FPAMS.Application.DTOs.AcademicYear;

namespace FPAMS.Application.Interfaces;

public interface IAcademicYearService
{
    Task<List<AcademicYearResponse>> GetAllAsync();

    Task<AcademicYearResponse?> GetByIdAsync(Guid id);

    Task<AcademicYearResponse> CreateAsync(CreateAcademicYearRequest request);

    Task<AcademicYearResponse?> UpdateAsync(UpdateAcademicYearRequest request);

    Task<bool> DeleteAsync(Guid id);
}