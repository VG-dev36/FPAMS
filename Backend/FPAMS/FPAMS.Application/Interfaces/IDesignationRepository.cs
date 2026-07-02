using FPAMS.Domain.Entities;

namespace FPAMS.Application.Interfaces;

public interface IDesignationRepository : IGenericRepository<Designation>
{
    Task<Designation?> GetByCodeAsync(string code);

    Task<bool> CodeExistsAsync(string code);

    Task<bool> NameExistsAsync(string name);
}