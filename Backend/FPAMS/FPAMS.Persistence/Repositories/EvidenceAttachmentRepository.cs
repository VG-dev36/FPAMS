using FPAMS.Domain.Entities;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Repositories;

public class EvidenceAttachmentRepository : GenericRepository<EvidenceAttachment>
{
    public EvidenceAttachmentRepository(AppDbContext context)
        : base(context)
    {
    }

    public override async Task<List<EvidenceAttachment>> GetAllAsync()
    {
        return await DbSet
            .Where(x => !x.IsDeleted)
            .OrderByDescending(x => x.CreatedOn)
            .ToListAsync();
    }

    public override async Task<EvidenceAttachment?> GetByIdAsync(Guid id)
    {
        return await DbSet.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }
}
