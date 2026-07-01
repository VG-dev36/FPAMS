using FPAMS.Domain.Entities;

namespace FPAMS.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, string role);
}