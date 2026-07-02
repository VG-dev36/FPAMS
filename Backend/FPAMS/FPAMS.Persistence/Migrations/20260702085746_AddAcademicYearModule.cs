using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FPAMS.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicYearModule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsCurrent",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "AcademicYears");

            migrationBuilder.AlterColumn<bool>(
                name: "IsCurrent",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldDefaultValue: false);
        }
    }
}
