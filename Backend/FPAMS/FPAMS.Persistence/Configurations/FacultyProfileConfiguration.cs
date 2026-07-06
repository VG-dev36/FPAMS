using FPAMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FPAMS.Persistence.Configurations;

public class FacultyProfileConfiguration : IEntityTypeConfiguration<FacultyProfile>
{
    public void Configure(EntityTypeBuilder<FacultyProfile> builder)
    {
        builder.ToTable("FacultyProfiles");

        builder.HasKey(x => x.Id);

        builder.HasIndex(x => x.UserId)
            .IsUnique();

        builder.Property(x => x.HighestQualification)
            .HasMaxLength(150);

        builder.Property(x => x.Specialization)
            .HasMaxLength(150);

        builder.HasOne(x => x.User)
            .WithOne()
            .HasForeignKey<FacultyProfile>(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Department)
            .WithMany()
            .HasForeignKey(x => x.DepartmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Designation)
            .WithMany()
            .HasForeignKey(x => x.DesignationId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
