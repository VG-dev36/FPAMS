using FPAMS.Application.DTOs.Auth;

namespace FPAMS.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}