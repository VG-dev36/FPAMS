namespace FPAMS.Application.Interfaces;

public interface IBaseCrudService<TResponse, TCreate, TUpdate>
{
    Task<List<TResponse>> GetAllAsync();

    Task<TResponse?> GetByIdAsync(Guid id);

    Task<TResponse> CreateAsync(TCreate request);

    Task<TResponse?> UpdateAsync(TUpdate request);

    Task<bool> DeleteAsync(Guid id);
}