using FPAMS.Domain.Entities;

namespace FPAMS.Application.Interfaces;

public interface IDepartmentRepository
{
    Task<List<Department>> GetAllAsync();

    Task<Department?> GetByIdAsync(Guid id);

    Task<Department?> GetByCodeAsync(string code);

    Task AddAsync(Department department);

    void Update(Department department);

    void Delete(Department department);

    Task SaveChangesAsync();
}