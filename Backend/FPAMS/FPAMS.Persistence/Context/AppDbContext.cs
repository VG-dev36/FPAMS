using FPAMS.Domain.Entities;
using FPAMS.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace FPAMS.Persistence.Context;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<Role> Roles => Set<Role>();

    public DbSet<Department> Departments => Set<Department>();

    public DbSet<AcademicYear> AcademicYears => Set<AcademicYear>();

    public DbSet<Designation> Designations => Set<Designation>();

    public DbSet<FacultyProfile> FacultyProfiles => Set<FacultyProfile>();

    public DbSet<AppraisalForm> AppraisalForms => Set<AppraisalForm>();

    public DbSet<EvidenceAttachment> EvidenceAttachments => Set<EvidenceAttachment>();

    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(
            typeof(AppDbContext).Assembly);

        modelBuilder.ApplyConfiguration(new AcademicYearConfiguration());

    }
}
