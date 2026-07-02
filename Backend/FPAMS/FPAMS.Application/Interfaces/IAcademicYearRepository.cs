using FPAMS.Domain.Entities;

namespace FPAMS.Application.Interfaces;

public interface IAcademicYearRepository
{
    Task<List<AcademicYear>> GetAllAsync();

    Task<AcademicYear?> GetByIdAsync(Guid id);

    Task<AcademicYear?> GetCurrentAsync();

    Task<bool> ExistsAsync(string yearName);

    Task AddAsync(AcademicYear academicYear);

    void Update(AcademicYear academicYear);

    void Delete(AcademicYear academicYear);

    Task SaveChangesAsync();
}