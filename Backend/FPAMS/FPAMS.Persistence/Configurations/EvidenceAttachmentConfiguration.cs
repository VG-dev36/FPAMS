using FPAMS.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FPAMS.Persistence.Configurations;

public class EvidenceAttachmentConfiguration : IEntityTypeConfiguration<EvidenceAttachment>
{
    public void Configure(EntityTypeBuilder<EvidenceAttachment> builder)
    {
        builder.ToTable("EvidenceAttachments");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.FileName)
            .HasMaxLength(260)
            .IsRequired();

        builder.Property(x => x.StoredFileName)
            .HasMaxLength(260)
            .IsRequired();

        builder.Property(x => x.ContentType)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(x => x.Description)
            .HasMaxLength(500);

        builder.HasOne(x => x.AppraisalForm)
            .WithMany()
            .HasForeignKey(x => x.AppraisalFormId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
