using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Repositories;

public class AcademicYearRepository : IAcademicYearRepository
{
    private readonly AppDbContext _context;

    public AcademicYearRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AcademicYear>> GetAllAsync()
    {
        return await _context.AcademicYears
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.StartDate)
            .ToListAsync();
    }

    public async Task<AcademicYear?> GetByIdAsync(Guid id)
    {
        return await _context.AcademicYears
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<AcademicYear?> GetCurrentAsync()
    {
        return await _context.AcademicYears
            .FirstOrDefaultAsync(x => x.IsCurrent && !x.IsDeleted);
    }

    public async Task<bool> ExistsAsync(string yearName)
    {
        return await _context.AcademicYears
            .AnyAsync(x => x.YearName == yearName && !x.IsDeleted);
    }

    public async Task AddAsync(AcademicYear academicYear)
    {
        await _context.AcademicYears.AddAsync(academicYear);
    }

    public void Update(AcademicYear academicYear)
    {
        _context.AcademicYears.Update(academicYear);
    }

    public void Delete(AcademicYear academicYear)
    {
        academicYear.IsDeleted = true;
        Update(academicYear);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
