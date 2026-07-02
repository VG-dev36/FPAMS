using FPAMS.Application.Interfaces;
using FPAMS.Domain.Common;

namespace FPAMS.Infrastructure.Services;

public abstract class BaseCrudService<TEntity, TResponse, TCreate, TUpdate>
    : IBaseCrudService<TResponse, TCreate, TUpdate>
    where TEntity : BaseEntity
{
    protected readonly IGenericRepository<TEntity> Repository;

    protected BaseCrudService(IGenericRepository<TEntity> repository)
    {
        Repository = repository;
    }

    public abstract Task<List<TResponse>> GetAllAsync();

    public abstract Task<TResponse?> GetByIdAsync(Guid id);

    public abstract Task<TResponse> CreateAsync(TCreate request);

    public abstract Task<TResponse?> UpdateAsync(TUpdate request);

    public abstract Task<bool> DeleteAsync(Guid id);
}