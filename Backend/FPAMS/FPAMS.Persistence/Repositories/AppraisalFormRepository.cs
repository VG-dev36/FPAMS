using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Repositories;

public class AppraisalFormRepository : GenericRepository<AppraisalForm>
{
    public AppraisalFormRepository(AppDbContext context)
        : base(context)
    {
    }

    public override async Task<List<AppraisalForm>> GetAllAsync()
    {
        return await DbSet
            .Include(x => x.AcademicYear)
            .Include(x => x.FacultyProfile)
                .ThenInclude(x => x.User)
            .Include(x => x.FacultyProfile)
                .ThenInclude(x => x.Department)
            .Where(x => !x.IsDeleted)
            .ToListAsync();
    }

    public override async Task<AppraisalForm?> GetByIdAsync(Guid id)
    {
        return await DbSet
            .Include(x => x.AcademicYear)
            .Include(x => x.FacultyProfile)
                .ThenInclude(x => x.User)
            .Include(x => x.FacultyProfile)
                .ThenInclude(x => x.Department)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }
}
