using FPAMS.Application.DTOs.Role;

namespace FPAMS.Application.Interfaces;

public interface IRoleService
{
    Task<List<RoleResponse>> GetAllAsync();
}
