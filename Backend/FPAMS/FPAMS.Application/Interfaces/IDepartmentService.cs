using FPAMS.Application.DTOs.Department;

namespace FPAMS.Application.Interfaces;

public interface IDepartmentService
{
    Task<List<DepartmentResponse>> GetAllAsync();

    Task<DepartmentResponse?> GetByIdAsync(Guid id);

    Task<DepartmentResponse> CreateAsync(CreateDepartmentRequest request);

    Task<DepartmentResponse?> UpdateAsync(UpdateDepartmentRequest request);

    Task<bool> DeleteAsync(Guid id);
}