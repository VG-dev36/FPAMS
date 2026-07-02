using FPAMS.Domain.Common;
using System.Linq.Expressions;

namespace FPAMS.Application.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<List<T>> GetAllAsync();

    Task<T?> GetByIdAsync(Guid id);

    Task<List<T>> FindAsync(Expression<Func<T, bool>> predicate);

    Task AddAsync(T entity);

    Task AddRangeAsync(IEnumerable<T> entities);

    void Update(T entity);

    void Delete(T entity);

    void DeleteRange(IEnumerable<T> entities);

    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

    Task<int> SaveChangesAsync();
}