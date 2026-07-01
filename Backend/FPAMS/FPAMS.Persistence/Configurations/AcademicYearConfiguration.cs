using FPAMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FPAMS.Persistence.Configurations;

public class AcademicYearConfiguration :
    IEntityTypeConfiguration<AcademicYear>
{
    public void Configure(EntityTypeBuilder<AcademicYear> builder)
    {
        builder.ToTable("AcademicYears");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.YearName)
            .HasMaxLength(30)
            .IsRequired();
    }
}