using FPAMS.Application.Interfaces;
using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Repositories;

public class DesignationRepository
    : GenericRepository<Designation>,
      IDesignationRepository
{
    private readonly AppDbContext _context;

    public DesignationRepository(AppDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Designation?> GetByCodeAsync(string code)
    {
        return await _context.Designations
            .FirstOrDefaultAsync(x =>
                x.DesignationCode == code &&
                !x.IsDeleted);
    }

    public async Task<bool> CodeExistsAsync(string code)
    {
        return await _context.Designations
            .AnyAsync(x =>
                x.DesignationCode == code &&
                !x.IsDeleted);
    }

    public async Task<bool> NameExistsAsync(string name)
    {
        return await _context.Designations
            .AnyAsync(x =>
                x.DesignationName == name &&
                !x.IsDeleted);
    }
}