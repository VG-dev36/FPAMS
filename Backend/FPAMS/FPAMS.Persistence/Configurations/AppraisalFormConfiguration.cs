using FPAMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FPAMS.Persistence.Configurations;

public class AppraisalFormConfiguration : IEntityTypeConfiguration<AppraisalForm>
{
    public void Configure(EntityTypeBuilder<AppraisalForm> builder)
    {
        builder.ToTable("AppraisalForms");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.EvidenceSummary)
            .HasMaxLength(1000);

        builder.Property(x => x.FacultyRemarks)
            .HasMaxLength(1000);

        builder.Property(x => x.ReviewerRemarks)
            .HasMaxLength(1000);

        builder.Property(x => x.Status)
            .HasMaxLength(30)
            .IsRequired();

        builder.HasIndex(x => new { x.FacultyProfileId, x.AcademicYearId })
            .IsUnique();

        builder.HasOne(x => x.FacultyProfile)
            .WithMany()
            .HasForeignKey(x => x.FacultyProfileId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.AcademicYear)
            .WithMany()
            .HasForeignKey(x => x.AcademicYearId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
