using FPAMS.Application.DTOs.User;

namespace FPAMS.Application.Interfaces;

public interface IUserService
{
    Task<List<UserResponse>> GetAllAsync();

    Task<UserResponse?> GetByIdAsync(Guid id);

    Task<UserResponse> CreateAsync(CreateUserRequest request);

    Task<UserResponse> UpdateAsync(UpdateUserRequest request);

    Task<bool> DeleteAsync(Guid id);
}