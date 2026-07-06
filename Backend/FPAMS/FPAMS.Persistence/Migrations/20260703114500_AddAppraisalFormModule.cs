using System;
using FPAMS.Persistence.Context;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPAMS.Persistence.Migrations
{
    /// <inheritdoc />
    [DbContext(typeof(AppDbContext))]
    [Migration("20260703114500_AddAppraisalFormModule")]
    public partial class AddAppraisalFormModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppraisalForms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FacultyProfileId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AcademicYearId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeachingScore = table.Column<int>(type: "int", nullable: false),
                    ResearchScore = table.Column<int>(type: "int", nullable: false),
                    AdministrationScore = table.Column<int>(type: "int", nullable: false),
                    ContributionScore = table.Column<int>(type: "int", nullable: false),
                    EvidenceSummary = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    FacultyRemarks = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    ReviewerRemarks = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    SubmittedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppraisalForms", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppraisalForms_AcademicYears_AcademicYearId",
                        column: x => x.AcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppraisalForms_FacultyProfiles_FacultyProfileId",
                        column: x => x.FacultyProfileId,
                        principalTable: "FacultyProfiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppraisalForms_AcademicYearId",
                table: "AppraisalForms",
                column: "AcademicYearId");

            migrationBuilder.CreateIndex(
                name: "IX_AppraisalForms_FacultyProfileId_AcademicYearId",
                table: "AppraisalForms",
                columns: new[] { "FacultyProfileId", "AcademicYearId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppraisalForms");
        }
    }
}
