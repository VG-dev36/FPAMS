using FPAMS.Application.DTOs.Auth;

namespace FPAMS.Application.Interfaces;

public interface ICurrentUserService
{
    AuthenticatedUserDto? User { get; }
}