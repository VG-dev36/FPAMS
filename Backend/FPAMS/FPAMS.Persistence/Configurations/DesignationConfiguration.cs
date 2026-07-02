using FPAMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FPAMS.Persistence.Configurations;

public class DesignationConfiguration : IEntityTypeConfiguration<Designation>
{
    public void Configure(EntityTypeBuilder<Designation> builder)
    {
        builder.ToTable("Designations");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.DesignationCode)
               .HasMaxLength(20)
               .IsRequired();

        builder.Property(x => x.DesignationName)
               .HasMaxLength(150)
               .IsRequired();

        builder.Property(x => x.Description)
               .HasMaxLength(500);

        builder.Property(x => x.DisplayOrder)
               .HasDefaultValue(0);

        builder.HasIndex(x => x.DesignationCode)
               .IsUnique();
    }
}