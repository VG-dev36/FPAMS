using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Repositories;

public class FacultyProfileRepository : GenericRepository<FacultyProfile>
{
    public FacultyProfileRepository(AppDbContext context)
        : base(context)
    {
    }

    public override async Task<List<FacultyProfile>> GetAllAsync()
    {
        return await DbSet
            .Include(x => x.User)
            .Include(x => x.Department)
            .Include(x => x.Designation)
            .Where(x => !x.IsDeleted)
            .ToListAsync();
    }

    public override async Task<FacultyProfile?> GetByIdAsync(Guid id)
    {
        return await DbSet
            .Include(x => x.User)
            .Include(x => x.Department)
            .Include(x => x.Designation)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }
}
