using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Repositories;

public class DepartmentRepository : IDepartmentRepository
{
    private readonly AppDbContext _context;

    public DepartmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Department>> GetAllAsync()
    {
        return await _context.Departments
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.DepartmentName)
            .ToListAsync();
    }

    public async Task<Department?> GetByIdAsync(Guid id)
    {
        return await _context.Departments
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<Department?> GetByCodeAsync(string code)
    {
        return await _context.Departments
            .FirstOrDefaultAsync(x => x.DepartmentCode == code && !x.IsDeleted);
    }

    public async Task AddAsync(Department department)
    {
        await _context.Departments.AddAsync(department);
    }

    public void Update(Department department)
    {
        _context.Departments.Update(department);
    }

    public void Delete(Department department)
    {
        department.IsDeleted = true;
        Update(department);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
