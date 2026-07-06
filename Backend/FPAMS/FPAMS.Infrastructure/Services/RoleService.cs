using FPAMS.Application.DTOs.Role;
using FPAMS.Application.Interfaces;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Infrastructure.Services;

public class RoleService : IRoleService
{
    private readonly AppDbContext _context;

    public RoleService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoleResponse>> GetAllAsync()
    {
        return await _context.Roles
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.Name)
            .Select(x => new RoleResponse
            {
                Id = x.Id,
                Name = x.Name,
                Description = x.Description
            })
            .ToListAsync();
    }
}
